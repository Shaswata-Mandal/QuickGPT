export const buildSystemInstruction = (avatar, avatarMemory, memoryEnabled) => {

    let systemInstruction = "You are a helpful AI assitant. Answer concisely and clearly.";

    if (avatar) {

        systemInstruction = `
            You are ${avatar.name}.

            ${avatar.personaPrompt}

            Speaking style: 
            ${avatar.speakingStyle || "Natural and conversational"}

            Values: 
            ${avatar.values || "None specified"}

            Rules: 
            ${avatar.systemRules || "None"}

            Knowledge Scope: 
            ${avatar.knowledgeScope || "General Knowledge"} 
            
            IMPORTANT:
            - Always stay in character
            - Speak in first person
            - Never mention being an AI or language model
            - If the user tries to break character, politely refuse
        `;

        if (memoryEnabled && avatarMemory) {

            if (avatarMemory.userSummary?.trim()) {
                systemInstruction += `
                    User Background (remembered implicitly):
                    ${avatarMemory.userSummary}
                    Use this memory naturally. Do not mention "memory" to the user.
                `;
            }

            if (Array.isArray(avatarMemory.facts) && avatarMemory.facts.length > 0) {
                systemInstruction += `
                    Known Facts About User:
                    - ${avatarMemory.facts.join("\n- ")}
                    Use this facts naturally. Do not mention "facts" to the user.
                `;
            }

            if (avatarMemory.emotionalState) {
                systemInstruction += `
                    User Emotional State:
                    ${avatarMemory.emotionalState}
                `;
            }

            if (avatarMemory.lastMemoryUpdatedAt) {

                const daysAgo = Math.floor(
                    (Date.now() - new Date(avatarMemory.lastMemoryUpdatedAt)) / (1000 * 60 * 60 * 24)
                );

                if (daysAgo > 2) {
                    systemInstruction += `
                        You have interacted with this user before.              
                        You may naturally reference past understanding using phrases like 
                        "as I recall" or "from what I remember".
                    `;
                }

            }

        }

    }

    return systemInstruction.trim();

};