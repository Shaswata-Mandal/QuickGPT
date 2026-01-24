import avatarMemoryModel from "../models/avatarMemoryModel.js";
import avatarModel from "../models/avatarModel.js";
import userModel from "../models/userModel.js";

//API to get all the available avatar details
export const getAvailableAvatarDetails = async (req, res) => {

    const { userId } = req.body;

    if(!userId) {
        return res.json({ success: false, message: "Missing required details!" });
    }

    const availableAvatars = await avatarModel.find({}).select("key name type description isActive category");

    return res.json({ success: true, availableAvatars });

}

//API to get all the avatar memories per user
export const getAvatarMemories = async (req, res) => {

    const { userId, avatarId } = req.body;

    if(!userId && !avatarId) {
        return res.json({ success: false, message: "Missing required details!" });
    }

    const user = await userModel.findById(userId);

    const avatarMemories = await avatarMemoryModel.find({ userId, avatarId }).select("userSummary facts emotionalState lastMemoryUpdatedAt");

    return res.json({ success: true, avatarMemories, isAvatarMemoryEnabled: user.avatarMemoryEnabled });

}

//API to delete avatar memories
export const deleteAvatarMemories = async (req, res) => {

    const { userId, avatarId } = req.body;

    if(!userId) {
        return res.json({ success: false, message: "Missing required details!" });
    }

    if(avatarId) {

        await avatarMemoryModel.deleteOne({ userId, avatarId });
        
        return res.json({ success: true, message: "Avatar memory successfully deleted!" });

    }
    else {

        const result = await avatarMemoryModel.deleteMany({ userId });

        return res.json({ success: true, message: `${result.deletedCount} avatar memories deleted successfully!` });

    }

}