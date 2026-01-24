import imagekit from "../configs/imageKit.js";
import chatModel from "../models/chatModel.js";
import userModel from "../models/userModel.js";
import avatarMemoryModel from "../models/avatarMemoryModel.js";
import avatarModel from "../models/avatarModel.js";
import axios from 'axios';
import { deductCredits } from "../utils/deductCredits.js";
import { renameChat } from "../utils/renameChat.js";
import { buildConversationContext } from "../utils/buildConversationContext.js";
import { buildSystemInstruction } from "../utils/buildSystemInstruction.js";
import { summarizeChat } from "../utils/summarizeChat.js";
import { generateText } from "../utils/generateText.js";

const SUMMARY_CHUNK_SIZE = 2;
const AVATAR_MEMORY_CHUNK_SIZE = 2;
const AVATAR_MEMORY_TRIGGER = 4;

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

    // Validate required fields------------------------------------------------
    if (!userId || !chatId || !prompt) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields: userId, chatId, or prompt"
        });
    }

    // Find user--------------------------------------------------------------
    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    // Find chat--------------------------------------------------------------
    const chat = await chatModel.findOne({ userId, _id: chatId });
    if (!chat) {
        return res.status(404).json({
            success: false,
            message: "Chat not found"
        });
    }

    try {

        // Add user message to chat---------------------------------------------------
        const userMessage = {
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false,
            isPublished: false,
        };
        chat.messages.push(userMessage);
        await chat.save();

        // Check credits--------------------------------------------------------------
        if (user.freeCredits < 1 && user.creditBalance < 1) {

            const errorReply = getReply("You have reached your credit limit! Please upgrade for more!");
            chat.messages.push(errorReply);
            await chat.save();

            return res.json({
                success: true,
                reply: errorReply
            });

        }

        //Rename the chat only one time when there is first user message---------------
        let chatName = null;
        if (chat.messages.length === 1) {
            chatName = await renameChat(userId, chatId);
        }

        //Loading avatar and avatar memory if chat mode is avatar-----------------------
        let avatar = null;
        let avatarMemory = null;

        if (chat.avatarId) {

            avatar = await avatarModel.findById(chat.avatarId);

            if (!avatar || !avatar.isActive) {

                const errorReply = getReply("Requested avatar is currently not available. Please try later!");
                chat.messages.push(errorReply);
                await chat.save();

                return res.json({
                    success: true,
                    reply: errorReply
                });

            }

            avatarMemory = await avatarMemoryModel.findOneAndUpdate(
                { userId, avatarId: chat.avatarId }, 
                {}, 
                { upsert: true, new: true }
            );

        }

        //We will generate the ai response and save it-------------------------------------- 
        let reply = null;

        const systemInstruction = buildSystemInstruction(avatar, avatarMemory, user.avatarMemoryEnabled);

        //Building the chat context with existing summary and recent messages
        const recentMessages = chat.messages.slice(chat.summaryIndex);

        const contextMessages = buildConversationContext(chat.summary, recentMessages);

        //Generating ai response
        const { text, meta } = await generateText({
            userId,
            model: aiModel || "groq",
            prompt,
            contextMessages,
            systemInstruction: systemInstruction
        });

        //Setting headers for the frontend ux
        if (meta?.nearLimit) {

            res.setHeader("x-llm-warning", "NEAR_LIMIT");
            res.setHeader("x-llm-remaining", meta.remaining);
            res.setHeader("x-llm-locked-provider", meta.provider);

        }

        if (chatName) {

            res.setHeader("x-chat-name", chatName);

        }

        reply = getReply(text);

        // Add AI response to chat
        chat.messages.push(reply);
        await chat.save();

        //Saving the summary of the chat (whenever applicable)---------------------------
        const totalMessaages = chat.messages.length;
        const unsummarizedCount = totalMessaages - chat.summaryIndex;

        if (unsummarizedCount >= SUMMARY_CHUNK_SIZE * 2) {

            const chunkToSummarize = chat.messages.slice(
                chat.summaryIndex,
                chat.summaryIndex + SUMMARY_CHUNK_SIZE
            );

            const newSummary = await summarizeChat({
                messagesChunk: chunkToSummarize,
                existingSummary: chat.summary,
                avatarMemory: null,
                summaryMode: "default",
                avatarType: null
            });

            chat.summary = newSummary;
            chat.summaryIndex += SUMMARY_CHUNK_SIZE;

            await chat.save();

        }

        //Updating the avatar memory(whenever applicable)--------------------------------
        if (avatar && user.avatarMemoryEnabled) {

            const avatarUnsummarizedCount = totalMessaages - avatarMemory.lastMemoryIndex;

            if (avatarUnsummarizedCount >= AVATAR_MEMORY_TRIGGER) {

                const chunkToSummarize = chat.messages.slice(
                    avatarMemory.lastMemoryIndex,
                    avatarMemory.lastMemoryIndex + AVATAR_MEMORY_CHUNK_SIZE
                );

                const newMemory = await summarizeChat({
                    messagesChunk: chunkToSummarize,
                    existingSummary: "",
                    avatarMemory,
                    summaryMode: "avatar",
                    avatarType: avatar.type
                });

                avatarMemory.userSummary = newMemory.userSummary || "No memory";
                avatarMemory.facts = newMemory.facts || [];

                if (avatar.type === "PERSONALITY") {
                    avatarMemory.emotionalState = newMemory.emotionalState;
                }

                avatarMemory.lastMemoryIndex += AVATAR_MEMORY_CHUNK_SIZE;
                avatarMemory.lastMemoryUpdatedAt = new Date();

                console.log(avatarMemory);

                await avatarMemory.save();

            }

        }

        // Deduct credits
        await deductCredits(userId, 2);

        return res.json({ success: true, reply });

    } catch (aiError) {

        let errorReply = "";

        console.log(aiError)

        // console.log(aiError)

        if (aiError.message === "RATE_LIMIT") {

            errorReply = getReply(`Free AI limit reached. Please wait for some time before retrying or try using some other model.`);

            res.setHeader("x-llm-locked", "true");
            res.setHeader("x-llm-cooldown", aiError.retryAfter);
            res.setHeader("x-llm-locked-provider", aiError.provider);

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

}

//Image Generation Message Controller
export const imageMessageController = async (req, res) => {

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

    try {

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
        if (user.freeCredits < 5 && user.creditBalance < 5) {

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

    } catch (error) {

        console.error("💥 UNEXPECTED ERROR in imageMessageController:", error);
        console.error("Error stack:", error.stack);
        return res.status(500).json({
            success: false,
            message: `Something went wrong: ${error}`
        });

    }
}