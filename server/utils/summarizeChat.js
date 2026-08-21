import { generateText } from "./generateText.js";

//Background system user
const SYSTEM_USER_ID = "system:summarizer";

export const summarizeChat = async ({ messagesChunk, existingSummary = "", avatarMemory = null, summaryMode, avatarType = null }) => {

    const chunkText = messagesChunk
        .filter(
            msg => 
                !msg.isImage &&
                typeof msg.content === "string" &&
                msg.messageType === "normal"
        )
        .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join("\n");

    let prompt = "";

    if (summaryMode === "default") {

        prompt = `
            You are an internal module for extracting meaningfull summary of a chat. 
            
            Your task: You are summarizing a chat conversation for long-term memory based on the existing summary of the chat(if any) and the new conversation.
            
            Important Note (Always Remember this): Ignore greetings, small talk, jokes and other irrelevant talks in the chat. Produce an updated concise meaningful summary. Preserve facts, decisions, preferences, important topics discussed so far and chat context.
                    
            Existing summary of the chat: 
            ${existingSummary || "None"}
                    
            New conversation: 
            ${chunkText} 
        `;

    } else {

        prompt = `
            You are an INTERNAL MEMORY ANALYSIS MODULE.

            You are NOT the avatar speaking to the user.
            You are NOT responding in character.
            You are writing private memory notes FOR the avatar.
            
            Avatar type: ${avatarType}

            Your perspective:
            - Analyze the conversation AS IF you are the avatar
            - Extract what the avatar has learned ABOUT THE USER

            IMPORTANT SUBJECT RULE:
            - The subject of memory is ALWAYS the USER
            - NEVER describe the avatar
            - NEVER summarize the avatar's personality, beliefs, or traits
            - ONLY extract information about the USER

            New Conversation: 
            ${chunkText}
                    
            Existing summary about the user: 
            ${avatarMemory.userSummary || "None"}

            Existing known facts about the user: 
            ${Array.isArray(avatarMemory.facts) ? avatarMemory.facts.join("; ") : "None"}

            Existing known emotional state of the user: 
            ${avatarMemory.emotionalState || "None"}
                    
            Your task:
            1. Extract ONLY stable, long-term information about the USER
            2. Ignore greetings, roleplay, jokes, and avatar responses
            3. Do NOT hallucinate or infer facts not clearly stated
            4. Merge with existing memory when appropriate
            5. Update outdated or corrected information
            6. Remove redundancy
            7. If emotional state is included, it must be a PATTERN, not a temporary mood

            Memory guidelines:
            - Facts = objective, repeatable user traits or circumstances
            - Emotional state = long-term emotional tendency (e.g., anxious, optimistic)
            - Do NOT store transient emotions (e.g., sad today)

            If nothing worth remembering please strictly, return Exactly:
            {
            "userSummary": null,
            "facts": [],
            "emotionalState": null,
            }
                    
            Note: Return STRICT JSON with this schema:
            {
            "userSummary": "Concise long-term user summary (String value)",
            "facts": ["fact1", "fact2"],
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

        // console.log(text);
        let parsed;

        try {

            parsed = JSON.parse(text);
            // console.log(parsed)

        } catch (error) {

            parsed = {
                userSummary: text.userSummary || null,
                facts: text.facts || [],
                emotionalState: text.emotionalState || null
            }

        }

        return parsed;

    }

};