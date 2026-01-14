import { generateText } from "./generateText.js";

//Background system user
const SYSTEM_USER_ID = "system:summarizer";

//We will summarize messages in chunks of 10
export const summarizeChat = async (messagesChunk, existingSummary = "") => {

    const chunkText = messagesChunk
        .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join("\n");

    const prompt = `
        You are summarizing a chat conversation for long-term memory. 
                    
        Existing summary (if any): 
        ${existingSummary || "None"}
                    
        New conversation: 
        ${chunkText}
                    
        Produce an updated concise summary(bullet points preferred).
        Preserve facts, decisions, preferences, and important context.
    `;

    const { text } = await generateText({
        userId: SYSTEM_USER_ID, 
        model: "groq", 
        prompt,
        contextMessages: [],
        systemInstruction: null
    });

    return text.trim();

};