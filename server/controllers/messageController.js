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
import { canUserAffordCredits } from "../utils/checkCredits.js";

const SUMMARY_CHUNK_SIZE = 8;
const AVATAR_MEMORY_CHUNK_SIZE = 10;
const AVATAR_MEMORY_TRIGGER = 20;
const CREDIT_COST = {
    text: 2, 
    image: 5,
}

const getReply = ({content, isImage = false, isPublished = false, messageType = "normal"}) => {

    return {
        role: 'assistant',
        content: content,
        timestamp: Date.now(),
        isImage: isImage,
        isPublished: isPublished, 
        messageType: messageType,
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

        //Rename the chat only one time when there is first user message---------------
        let chatName = null;
        if (chat.messages.length === 1) {
            chatName = await renameChat(userId, chatId);
        }

        // Check credits--------------------------------------------------------------
        const canProceed = await canUserAffordCredits(userId, CREDIT_COST.text);

        if (!canProceed) {

            const errorReply = getReply({content: "Insufficient credits! Please buy credits to continue!", messageType: "error"});
            chat.messages.push(errorReply);
            await chat.save();

            return res.json({
                success: true,
                reply: errorReply
            });

        }

        //Loading avatar and avatar memory if chat mode is avatar-----------------------
        let avatar = null;
        let avatarMemory = null;

        if (chat.avatarId) {

            avatar = await avatarModel.findById(chat.avatarId);

            if (!avatar || !avatar.isActive) {

                const errorReply = getReply({content: "Requested avatar is currently not available. Please try later!", messageType: "error"});
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

        const systemInstruction = buildSystemInstruction(user, avatar, avatarMemory, user.memorySettings.avatarMemoryEnabled, user.memorySettings.personalizationMemoryEnabled);

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
            res.setHeader("x-llm-window", meta.limitWindow);

        }

        if (chatName) {

            res.setHeader("x-chat-name", chatName);

        }

        reply = getReply({content: text});

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
        if (avatar && user.memorySettings.avatarMemoryEnabled) {

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

                avatarMemory.userSummary = newMemory.userSummary || "";
                avatarMemory.facts = newMemory.facts || [];

                if (avatar.type === "PERSONALITY") {
                    avatarMemory.emotionalState = newMemory.emotionalState;
                }

                avatarMemory.lastMemoryIndex += AVATAR_MEMORY_CHUNK_SIZE;
                avatarMemory.lastMemoryUpdatedAt = new Date();

                // console.log(avatarMemory);

                await avatarMemory.save();

            }

        }

        // Deduct credits
        await deductCredits(userId, CREDIT_COST.text);

        return res.json({ success: true, reply });

    } catch (aiError) {

        let errorReply = "";

        // console.log(aiError)

        if (aiError.message === "RATE_LIMIT") {

            errorReply = getReply({content: `Free AI usage limit reached. Please wait for some time before retrying or try using some other model.`, messageType: "error"});

            res.setHeader("x-llm-locked", "true");
            res.setHeader("x-llm-cooldown", aiError.retryAfter);
            res.setHeader("x-llm-locked-provider", aiError.provider);

        }
        else {
            errorReply = getReply({content: "Sorry, I'm experiencing technical difficulties. Please try again later.", messageType: "error"});
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
        const canProceed = await canUserAffordCredits(userId, CREDIT_COST.image);

        if (!canProceed) {

            const errorReply = getReply({content: "You don't have enough credits to use this feature!", messageType: "error"});
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

            const errorReply = getReply({content: "Image service not configured properly. Please try again later.", messageType: "error"});
            chat.messages.push(errorReply);
            await chat.save();

            return res.json({
                success: true,
                reply: errorReply,
                chatName
            });

        }

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const MAX_ATTEMPTS = 14;
        const POLL_DELAY_MS = 3000; 

        let aiImageResponse;
        let lastNonImageBody = null;

        try {

            for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {

                const res = await axios.get(generatedImageUrl, {
                    responseType: "arraybuffer",
                    timeout: 30000
                });

                const isIntermediate = res.headers?.["is-intermediate-response"] === "true";

                if (!isIntermediate) {
                    aiImageResponse = res;
                    break;
                }

                lastNonImageBody = Buffer.from(res.data).toString("utf-8").slice(0, 500);
                console.error(`IMAGE NOT READY (attempt ${attempt}/${MAX_ATTEMPTS}): ${lastNonImageBody}`);

                if (attempt < MAX_ATTEMPTS) {
                    await sleep(POLL_DELAY_MS);
                }

            }

        } catch (axiosError) {

            const errorReply = getReply({content: "Image generation limit reached. Upgrade for more.", messageType: "error"});
            chat.messages.push(errorReply);
            await chat.save();

            return res.json({
                success: true,
                reply: errorReply,
                chatName
            });

        }

        if (!aiImageResponse) {

            console.error("IMAGEKIT NON-IMAGE RESPONSE (final):", lastNonImageBody);

            const errorReply = getReply({content: "Image is taking longer than usual to generate. Please try again.", messageType: "error"});
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

            const errorReply = getReply({content: "Image generation failed. The service returned empty data. Please try again.", messageType: "error"});
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

            const errorReply = getReply({content: "Image processing failed. Please try again with a different prompt.", messageType: "error"});
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
            const successReply = getReply({content: uploadResponse.url, isImage: true, isPublished: isPublished || false});

            chat.messages.push(successReply);
            await chat.save();

            // Deduct credits
            await deductCredits(userId, CREDIT_COST.image);

            return res.json({
                success: true,
                reply: successReply,
                chatName
            });

        } catch (uploadError) {

            // console.error("❌ ImageKit upload failed:", uploadError.message);

            const errorReply = getReply({content: "Failed to save the generated image. Please try again.", messageType: "error"});
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