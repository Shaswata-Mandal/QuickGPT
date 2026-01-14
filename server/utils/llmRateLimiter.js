import redis from "../configs/redis.js";
import { LLM_LIMITS } from "../configs/llmRateLimits.js";

const ONE_MIN = 60;
const ONE_HOUR = 60 * ONE_MIN;
const ONE_DAY = 24 * ONE_HOUR;

export const checkLLMLimit = async (userId, provider) => {
  const limits = LLM_LIMITS[provider];
  if (!limits) throw new Error("INVALID_PROVIDER");

  const now = Math.floor(Date.now() / 1000);
  const key = `llm:${userId}:${provider}`;

  const windows = [
    limits.rpm && { limit: limits.rpm, window: ONE_MIN },
    limits.rph && { limit: limits.rph, window: ONE_HOUR },
    limits.rpd && { limit: limits.rpd, window: ONE_DAY },
  ].filter(Boolean);

  const maxWindow = Math.max(...windows.map(w => w.window));

  // Cleanup old entries
  await redis.zRemRangeByScore(key, 0, now - maxWindow);

  // Check limits
  for (const { limit, window } of windows) {
    const count = await redis.zCount(key, now - window, now);
    if (count >= limit) {
      const oldest = await redis.zRangeWithScores(key, 0, 0);
      const retryAfter = Math.max(
        window - (now - oldest[0].score),
        1
      );

      return {
        allowed: false,
        retryAfter,
      };
    }
  }

  // ---- optimistic usage ----
  const cap = limits.rpd || limits.rph || limits.rpm;
  const used = (await redis.zCard(key)) + 1;
  const remaining = cap ? Math.max(cap - used, 0) : null;
  const usageRatio = cap ? used / cap : 0;

  return {
    allowed: true,
    remaining,
    nearLimit: usageRatio >= limits.warnAt,
  };
};

export const recordLLMUsage = async (userId, provider) => {
  const key = `llm:${userId}:${provider}`;
  const now = Math.floor(Date.now() / 1000);
  await redis.zAdd(key, [{ score: now, value: String(now) }]);
};
