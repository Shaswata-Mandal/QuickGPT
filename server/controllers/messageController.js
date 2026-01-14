import imagekit from "../configs/imageKit.js";
import chatModel from "../models/chatModel.js";
import userModel from "../models/userModel.js";
import axios from 'axios';
import { deductCredits } from "../utils/deductCredits.js";
import { renameChat } from "../utils/renameChat.js";
import { buildConversationContext } from "../utils/buildConversationContext.js";
import { summarizeChat } from "../utils/summarizeChat.js";
import { generateText } from "../utils/generateText.js";

const SUMMARY_CHUNK_SIZE = 5;

const getReply = (content, isImage = false, isPublished = false) => {

    return {
        role: 'assistant',
        content: content,
        timestamp: Date.now(),
        isImage: isImage,
        isPublished: isPublished || false
    }

}

//Text-based AI Chat Message Controller
export const textMessageController = async (req, res) => {

    const { userId, chatId, prompt, aiModel } = req.body;

    // Validate required fields
    if (!userId || !chatId || !prompt) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields: userId, chatId, or prompt"
        });
    }

    // Find user
    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    // Find chat
    const chat = await chatModel.findOne({ userId, _id: chatId });
    if (!chat) {
        return res.status(404).json({
            success: false,
            message: "Chat not found"
        });
    }

    // Add user message to chat
    const userMessage = {
        role: "user",
        content: prompt,
        timestamp: Date.now(),
        isImage: false,
        isPublished: false,
    };
    chat.messages.push(userMessage);
    await chat.save();

    // Check credits
    if (user.freeCredits < 1 && user.creditBalance < 1) {

        const errorReply = getReply("You have reached your credit limit! Please upgrade for more!");
        chat.messages.push(errorReply);
        await chat.save();

        return res.json({
            success: true,
            reply: errorReply
        });
    }

    //We will generate the ai response and save it 
    let chatName = null;
    let reply = null;

    try {

        //Rename the chat only one time when there is first user message

        if (chat.messages.length === 1) {
            chatName = await renameChat(userId, chatId);
        }

        const recentMessages = chat.messages.slice(chat.summaryIndex);

        const contextMessages = buildConversationContext(chat.summary, recentMessages);

        const { text, meta } = await generateText({
            userId,
            model: "groq",
            prompt,
            contextMessages,
            systemInstruction: "You are a helpful AI assitant. Answer concisely and clearly."
        });

        //Setting headers for the frontend ux
        if (meta?.nearLimit) {

            res.setHeader("X-LLM-Warning", "NEAR_LIMIT");
            res.setHeader("X-LLM-Remaining", meta.remaining);
            res.setHeader("X-LLM-Provider", meta.provider);

        }

        if (aiModel === "auto" && meta?.provider) {

            res.setHeader("X-LLM-Fallback", meta.provider);

        }


        reply = getReply(text);

        // Add AI response to chat
        chat.messages.push(reply);
        await chat.save();

    } catch (aiError) {

        let errorReply = "";

        // console.log(aiError)

        if (aiError.message === "RATE_LIMIT") {

            errorReply = getReply(`Free AI limit reached. Please wait ${aiError.retryAfter}s before retrying or try using some other model.`);

            res.setHeader("X-LLM-LOCKED", "true");
            res.setHeader("X-LLM-COOLDOWN", aiError.retryAfter);

        }
        else {
            errorReply = getReply("Sorry, I'm experiencing technical difficulties. Please try again later.");
        }

        chat.messages.push(errorReply);
        await chat.save();

        return res.json({
            success: true,
            reply: errorReply,
            retryAfter: aiError.retryAfter || null
        });

    }



    //Saving the summary of the chat (whenever applicable)
    const totalMessaages = chat.messages.length;
    const unsummarizedCount = totalMessaages - chat.summaryIndex;

    if (unsummarizedCount >= SUMMARY_CHUNK_SIZE * 2) {

        const chunkToSummarize = chat.messages.slice(
            chat.summaryIndex,
            chat.summaryIndex + SUMMARY_CHUNK_SIZE
        );

        const newSummary = await summarizeChat(
            chunkToSummarize,
            chat.summary
        );

        chat.summary = newSummary;
        chat.summaryIndex += SUMMARY_CHUNK_SIZE;

        await chat.save();

    }

    // Deduct credits
    await deductCredits(userId, 2);

    return res.json({ success: true, reply, chatName });

}

//Image Generation Message Controller
export const imageMessageController = async (req, res) => {

    try {

        const { userId, chatId, prompt, isPublished } = req.body;

        // Validate required fields
        if (!userId || !chatId || !prompt) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: userId, chatId, or prompt"
            });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const chat = await chatModel.findOne({ userId, _id: chatId });
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        // Add user message
        const userMessage = {
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false,
            isPublished: false
        };
        chat.messages.push(userMessage);

        // Save the chat with user message immediately
        await chat.save();

        //Rename the chat only one time when there is first user message
        let chatName = null;
        if (chat.messages.length === 1) {
            chatName = await renameChat(userId, chatId);
        }

        // Check credits
        if (user.freeCredits < 2 && user.creditBalance < 2) {

            const errorReply = getReply("You don't have enough credits to use this feature!");
            chat.messages.push(errorReply);
            await chat.save();

            return res.json({
                success: true,
                reply: errorReply,
                chatName
            });

        }

        // Encoding the prompt
        const encodedPrompt = encodeURIComponent(prompt);

        // Constructing ImageKit AI generation URL
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

        // Check if ImageKit URL endpoint is configured
        if (!process.env.IMAGEKIT_URL_ENDPOINT) {

            const errorReply = getReply("Image service not configured properly. Please try again later.");
            chat.messages.push(errorReply);
            await chat.save();

            return res.json({
                success: true,
                reply: errorReply,
                chatName
            });

        }

        let aiImageResponse;
        try {

            aiImageResponse = await axios.get(generatedImageUrl, {
                responseType: "arraybuffer",
                timeout: 30000 // 30 second timeout
            });

        } catch (axiosError) {

            // console.error("❌ ImageKit AI request failed:", axiosError.message);

            // if (axiosError.response) {
            //     console.error("Response status:", axiosError.response.status);
            //     console.error("Response data:", axiosError.response.data);
            // }

            const errorReply = getReply("Image generation limit reached. Upgrade for more.", false, false);
            chat.messages.push(errorReply);
            await chat.save();

            return res.json({
                success: true,
                reply: errorReply,
                chatName
            });

        }

        // Check if we got valid image data
        if (!aiImageResponse.data || aiImageResponse.data.length === 0) {

            // console.log("❌ Empty image data received");

            const errorReply = getReply("Image generation failed. The service returned empty data. Please try again.");
            chat.messages.push(errorReply);
            await chat.save();

            return res.json({
                success: true,
                reply: errorReply,
                chatName
            });

        }

        let base64Image;
        try {

            base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data).toString('base64')}`;

        } catch (bufferError) {

            const errorReply = getReply("Image processing failed. Please try again with a different prompt.");
            chat.messages.push(errorReply);
            await chat.save();

            return res.json({
                success: true,
                reply: errorReply,
                chatName
            });
        }

        let uploadResponse;
        try {

            uploadResponse = await imagekit.upload({
                file: base64Image,
                fileName: `quickgpt-${Date.now()}.png`,
                folder: "quickgpt"
            });

        } catch (uploadError) {

            // console.error("❌ ImageKit upload failed:", uploadError.message);

            const errorReply = getReply("Failed to save the generated image. Please try again.");
            chat.messages.push(errorReply);
            await chat.save();

            return res.json({
                success: true,
                reply: errorReply,
                chatName
            });

        }

        // Successfully generated the AI Image
        const successReply = getReply(uploadResponse.url, true, isPublished || false);

        chat.messages.push(successReply);
        await chat.save();

        // Deduct credits
        await deductCredits(userId, 5);

        return res.json({
            success: true,
            reply: successReply,
            chatName
        });

    } catch (error) {

        console.error("💥 UNEXPECTED ERROR in imageMessageController:", error);
        console.error("Error stack:", error.stack);
        return res.status(500).json({
            success: false,
            message: `Something went wrong: ${error}`
        });

    }
}