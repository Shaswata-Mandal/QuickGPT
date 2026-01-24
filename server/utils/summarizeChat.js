import { generateText } from "./generateText.js";

//Background system user
const SYSTEM_USER_ID = "system:summarizer";

export const summarizeChat = async ({ messagesChunk, existingSummary = "", avatarMemory = null, summaryMode, avatarType = null }) => {

    const chunkText = messagesChunk
        .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join("\n");

    let prompt = "";

    if (summaryMode === "default") {

        prompt = `
            You are summarizing a chat conversation for long-term memory. 
                    
            Existing summary of the chat: 
            ${existingSummary || "None"}
                    
            New conversation: 
            ${chunkText}
                    
            Ignore greetings, small talk, jokes. Produce an updated concise summary(bullet points preferred).
            Preserve facts, decisions, preferences, and important context.
        `;

    } else {

        prompt = `
            You are extracting LONG-TERM memory about the user for an AI avatar.
            
            Avatar type: ${avatarType}

            New Conversation: 
            ${chunkText}
                    
            Existing summary about the user: 
            ${avatarMemory.userSummary || "None"}

            Existing known facts about the user: 
            ${avatarMemory.facts || "None"}

            Existing known emotional state of the user: 
            ${avatarMemory.emotionalState || "None"}
                    
            Your task:
            1. Extract ONLY stable, long-term information
            2. Ignore greetings, small talk, jokes
            3. Do NOT hallucinate facts
            4. Preserve important facts, preferences, struggles
            5. Update outdated info
            6. Remove redundanc

            If nothing worth remembering, return:
            {
            "userSummary": "No memory",
            "facts": [],
            "emotionalState": null,
            }
                    
            Note: Return STRICT JSON with this schema:
            {
            "userSummary": "Concise long-term user summary (String value)",
            "facts": ["fact1", "fact2"] (max 5 bullet points),
                ${avatarType === "PERSONALITY"
                ? `"emotionalState": "brief emotional pattern if detectable"`
                : `"emotionalState": null`
            }
            }            
        `;

    }


    const { text } = await generateText({
        userId: SYSTEM_USER_ID,
        model: "groq",
        prompt,
        contextMessages: [],
        systemInstruction: null
    });

    if (summaryMode === "default") {

        return text.trim();

    } else {

        console.log(text);
        let parsed;

        try {

            parsed = JSON.parse(text);
            console.log(parsed)

        } catch (error) {

            parsed = {
                userSummary: text.userSummary || "No memory",
                facts: text.facts || [],
                emotionalState: text.emotionalState || null
            }

        }

        return parsed;

    }

};