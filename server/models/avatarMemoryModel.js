import mongoose from "mongoose";

const avatarMemorySchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true, 
        index: true,
    }, 
    avatarId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "avatar", 
        required: true,
        index: true,
    }, 
    userSummary: {
        type: String, 
        default: "", 
    }, 
    facts: {
        type: [String], 
        default: [], 
    }, 
    emotionalState: {
        type: String,
        default: ""
    }, 
    lastMemoryIndex: {
        type: Number,
        default: 0,
    },
    lastMemoryUpdatedAt: {
        type: Date,
    },

}, { timestamps: true });

const avatarMemoryModel = mongoose.models.avatarMemory || mongoose.model("avatarMemory", avatarMemorySchema);

export default avatarMemoryModel;