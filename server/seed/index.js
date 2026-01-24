import mongoose from "mongoose";
import { seedGandhiAvatar } from "./avatars/gandhi.js";
import connectDB from "../configs/mongoDB.js";
import 'dotenv/config'
import { seedSwamiVivekananda } from "./avatars/swamiVivekananda.js";
import { seedChanakya } from "./avatars/chanakya.js";
import { seedRabindranathTagore } from "./avatars/rabindranath Tagore.js"
import { seedGautamaBuddha } from "./avatars/gautama Buddha.js";

const runSeeds = async () => {
  try {
    
    await connectDB();

    await seedGautamaBuddha();

    console.log("✅ Seeding completed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed", err);
    process.exit(1);
  }
};

runSeeds();
