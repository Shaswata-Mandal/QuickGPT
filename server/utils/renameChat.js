import chatModel from "../models/chatModel.js";
import { generateText } from "./generateText.js";

const SYSTEM_USER_ID = "system:chat-renamer";

//Helper function to rename the chat based on the first message
export const renameChat = async (userId, chatId) => {

    try {

        const chat = await chatModel.findOne({ userId, _id: chatId });

        if (!chat) return null;

        const firstUserMessage = chat.messages.find(
            msg => msg.role === "user"
        );

        if (!firstUserMessage) return null;

        const prompt = `Generate a short, descriptive chat name (max 4 words).Return ONLY the name, no quotes, no punctuation.Message: "${firstUserMessage.content}"`;

        const { text } = await generateText({
            userId: SYSTEM_USER_ID, 
            model: "groq", 
            prompt,
            contextMessages: [],
            systemInstruction: "You generate concise chat titles. Be brief and clear."
        });

        const chatName = text?.replace(/["\n]/g, "").trim().slice(0, 40) || "New Chat";

        chat.name = chatName;
        await chat.save();

        return chatName;

    } catch (error) {

        console.error("renameChat error:", error.message);
        return null;

    }

};