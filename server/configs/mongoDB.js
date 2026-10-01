import mongoose from "mongoose";


mongoose.set("bufferCommands", false);

let connectionPromise = null;

const connectDB = async () => {

    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (!connectionPromise) {

        mongoose.connection.on("connected", () => {
            console.log("Database connected successfully!");
        });

        mongoose.connection.on("error", (err) => {
            console.error("MONGODB CONNECTION ERROR:", err.message);
        });

        connectionPromise = mongoose.connect(`${process.env.MONGODB_URI}/quickgpt`, {

            serverSelectionTimeoutMS: 8000, // fail fast instead of hanging for minutes
            connectTimeoutMS: 8000,

        }).catch((error) => {

            connectionPromise = null; // allow a retry
            console.error("MONGODB CONNECT FAILED:", error.message);
            throw error;

        });

    }

    await connectionPromise;

};

export default connectDB;