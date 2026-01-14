import rateLimit from "express-rate-limit";

export const shareRateLimiter = rateLimit({
    windowMs: 60 * 1000, //1 minute
    max: 15, //15 requests
    message: "Too many requests, try again later",
    standardHeaders: true,
    legacyHeaders: false,
});