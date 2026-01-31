import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    clerkId: {
        type: String, 
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    photo: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    creditBalance: {
        type: Number,
        default: 0,
    },
    freeCredits: {
        type: Number,
        default: 1,
    }, 
    memorySettings: {
        avatarMemoryEnabled: {
            type: Boolean, 
            default: false,
        }, 
        personalizationMemoryEnabled: {
            type: Boolean, 
            default: false,
        },
    },
    personalization: {
        baseStyle: {
            type: String, 
            enum: ["default", "professional", "friendly", "candid", "quirky", "efficient", "nerdy", "cynical"],
            default: "default"
        }, 
        tone: {
            warm: { type: String, default: "default" }, 
            enthusiastic: { type: String, default: "default" },
        },
        formatting: {
            headerLists: { type: String, default: "default" }, 
            emoji: { type: String, default: "default" }, 
        }, 
        customInstruction: { type: String, default: "" },
        nickname: { type: String, default: "" }, 
        occupation: { type: String, default: "" }, 
        moreAboutYou: { type: String, default: "" },
    },

});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;