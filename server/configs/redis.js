import { createClient } from "redis";

const redis = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD, 
  socket: {
    host: "redis-19064.crce262.us-east-1-1.ec2.cloud.redislabs.com",
    port: 19064,
  },
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error", err.message);
});

await redis.connect();

export default redis;
