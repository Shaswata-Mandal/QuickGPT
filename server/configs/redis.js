import { createClient } from "redis";

const redis = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST || "redis-19064.crce262.us-east-1-1.ec2.cloud.redislabs.com",
    port: Number(process.env.REDIS_PORT) || 19064,
    connectTimeout: 5000, // fail fast instead of hanging
    reconnectStrategy: (retries) => {

      if (retries > 3) {
        console.error("❌ Redis: giving up after 3 reconnect attempts");
        return new Error("Redis unavailable");
      }
      return Math.min(retries * 200, 1000);
    },
  },
});

let hasLoggedError = false;

redis.on("connect", () => {
  console.log("✅ Redis connected");
  hasLoggedError = false;
});

redis.on("error", (err) => {
  if (!hasLoggedError) {
    console.error("❌ Redis error:", err.message);
    hasLoggedError = true;
  }
});

redis.connect().catch((err) => {
  console.error("❌ Redis initial connect failed:", err.message);
});

export default redis;