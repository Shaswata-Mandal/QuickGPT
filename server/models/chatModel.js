import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({

    userId: {
        type: String,
        ref: 'user',
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        default: "",
    },
    summaryIndex: { //this represents how many messages are already included in summary
        type: Number,
        default: 0,
    },
    messages: [
        {
            _id: false,
            isImage: {
                type: Boolean,
                required: true,
            },
            isPublished: {
                type: Boolean,
                required: true,
            },
            role: {
                type: String,
                required: true,
            },
            content: {
                type: String,
                required: true,
            },
            timestamp: {
                type: Number,
                required: true,
            },
        }
    ],
    isArchived: {
        type: Boolean,
        required: true,
        default: false,
    },
    isPublic: {
        type: Boolean, 
        default: false,
        required: true,
    },
    shareId: {
        type: String,
        unique: true,
        sparse: true,
        index: true,
    },
    clonedFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chat',
    },

}, {timestamps: true});

const chatModel = mongoose.models.chat || mongoose.model("chat", chatSchema);

export default chatModel;