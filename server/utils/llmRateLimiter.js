//Rate limiter feature was integrated in this project using AI.

import redis from "../configs/redis.js";
import { LLM_LIMITS } from "../configs/llmRateLimits.js";

const ONE_MIN = 60;
const ONE_HOUR = 60 * ONE_MIN;
const ONE_DAY = 24 * ONE_HOUR;

export const checkLLMLimit = async (userId, provider) => {

  if (typeof userId === "string" && userId.startsWith("system:")) {

    return {
      allowed: true,
      remaining: null,
      nearLimit: false,
      bypassed: true,
    };

  }

  const limits = LLM_LIMITS[provider];
  if (!limits) throw new Error("INVALID_PROVIDER");

  const now = Math.floor(Date.now() / 1000);
  const key = `llm:${userId}:${provider}`;

  const windows = [
    limits.rpm && { name: "rpm", limit: limits.rpm, window: ONE_MIN },
    limits.rph && { name: "rph", limit: limits.rph, window: ONE_HOUR },
    limits.rpd && { name: "rpd", limit: limits.rpd, window: ONE_DAY },
  ].filter(Boolean);

  const maxWindow = Math.max(...windows.map(w => w.window));

  // Cleanup old entries
  await redis.zRemRangeByScore(key, 0, now - maxWindow);

  let nearLimit = false;
  let remaining = null;
  let limitWindow = null;

  for (const { name, limit, window } of windows) {

    const count = await redis.zCount(key, now - window, now);

    // Hard limit hit
    if (count >= limit) {

      const oldest = await redis.zRangeWithScores(key, 0, 0);
      const oldestScore = oldest[0]?.score ?? now;

      return {
        allowed: false,
        retryAfter: Math.max(window - (now - oldestScore), 1),
        provider,
        limitWindow: name,
      };

    }

    const ratio = count / limit;

    // Near-limit warning (per window)
    if (ratio >= limits.warnAt) {
      nearLimit = true;
      remaining = Math.max(limit - count, 0);
      limitWindow = name;
    }

  }

  return {
    allowed: true,
    nearLimit,
    remaining,
    provider,
    limitWindow, // rpm / rph / rpd
  };

};

export const recordLLMUsage = async (userId, provider) => {

  if (typeof userId === "string" && userId.startsWith("system:")) return;

  const key = `llm:${userId}:${provider}`;
  const now = Math.floor(Date.now() / 1000);
  await redis.zAdd(key, [{ score: now, value: `${now}-${Math.random()}` }]);

};
