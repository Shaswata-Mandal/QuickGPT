import { generateGeminiText } from "../configs/gemini.js";
import { generateGroqText } from "../configs/groq.js";
import { LLM_PROVIDERS, AUTO_PROVIDER_ORDER } from "../configs/llmProviders.js";
import { checkLLMLimit, recordLLMUsage } from "./llmRateLimiter.js";

export const generateText = async ({ userId, model = LLM_PROVIDERS.AUTO, prompt, contextMessages = [], systemInstruction = null }) => {

    //Function to check for rate limit and call required provider
    const tryProvider = async (provider) => {

        const limit = await checkLLMLimit(userId, provider);

        //Internal Redis limit
        if (!limit.allowed) {
            const err = new Error("RATE_LIMIT");
            err.retryAfter = limit.retryAfter;
            err.provider = provider;
            err.isInternalLimit = true;
            throw err;
        }

        let text;

        try {

            if (provider === LLM_PROVIDERS.GEMINI) {

                text = await generateGeminiText(prompt, contextMessages, systemInstruction);

            } else if (provider === LLM_PROVIDERS.GROQ) {

                text = await generateGroqText(prompt, contextMessages, systemInstruction);

            } else {

                throw new Error("INVALID_PROVIDER");

            }
        } catch (error) {

            error.provider = provider;
            throw error;

        }

        await recordLLMUsage(userId, provider);

        return {
            text,
            meta: {
                provider: limit.provider,
                remaining: limit.remaining,
                nearLimit: limit.nearLimit,
                limitWindow: limit.limitWindow,
            },
        };
        
    };

    //Explicit provider call
    if (model !== LLM_PROVIDERS.AUTO) {
        return tryProvider(model);
    }

    //Model choice: Auto
    let lastError = null;

    //Calling each provider one by one. Throwing the last error if all the model fails
    for (const provider of AUTO_PROVIDER_ORDER) {

        try {

            return await tryProvider(provider);

        } catch (error) {

            lastError = error;

            if(error.isInternalLimit) {
                throw error;
            }

            //Fallback to next model only if rate-limit or overload
            //If the following condition satisfies, that means none of the model worked, the for loop will break and the last error will be thrown 
            const FALLBACK_ERRORS = ["RATE_LIMIT", "GEMINI_ERROR", "GROQ_ERROR", "OVERLOAD"];

            if (!FALLBACK_ERRORS.includes(error.message)) {
                throw error;
            }

            //otherwise continue to next provider

        }

    }

    throw lastError;

};