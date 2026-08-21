import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const generateGroqText = async (prompt, contextMessages = [], systemInstruction = null) => {

    try {

        const messages = [];

        if (systemInstruction) {
            messages.push({ role: "system", content: systemInstruction });
        }

        contextMessages.forEach(msg => {
            messages.push({
                role: msg.role === "assistant" ? "assistant" : "user",
                content: msg.content
            });
        });

        messages.push({ role: "user", content: prompt });

        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages,
            temperature: 0.7
        });

        return response.choices[0].message.content;

    } catch (error) {

        console.error("GROQ ERROR:", error?.status, error?.message);

        if (error?.status === 429) {
            const e = new Error("RATE_LIMIT");
            e.retryAfter = 60;
            e.provider = "groq";
            e.isRateLimit = true;
            throw e;
        }

        const e = new Error("GROQ_ERROR");
        e.provider = "groq";
        throw e;

    }

};