import mongoose from "mongoose";

const avatarSchema = new mongoose.Schema({

    key: { // "gandhi", "einstein", "career-coach"
        type: String,
        required: true,
        unique: true,
        index: true,
    }, 
    name: {
        type: String, 
        required: true,
    }, 
    type: {
        type: String, 
        enum: ["PERSONALITY", "EXPERT"], 
        required: true,
    }, 
    category: {
        type: String, 
        required: true,
    },
    description: {
        type: String,
    }, 
    personaPrompt: { // core personality instruction
        type: String, 
        required: true,
    }, 
    speakingStyle: { // tone, vocabulary, phrasing style
        type: String,
    }, 
    knowledgeScope: { // optional, mostly for experts
        type: String, 
    }, 
    values: { // ethics, worldview
        type: String, 
    }, 
    systemRules: { // constraints, safety, refusal rules
        type: String,
    },  
    isActive: {
        type: Boolean, 
        default: true,
    }, 

}, {timestamps: true});

const avatarModel = mongoose.models.avatar || mongoose.model("avatar", avatarSchema);

export default avatarModel;