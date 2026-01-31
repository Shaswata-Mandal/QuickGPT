import { randomUUID } from 'crypto';
import chatModel from '../models/chatModel.js'
import userModel from '../models/userModel.js'
import { deductCredits } from '../utils/deductCredits.js';

//API Controller for creating a new chat
export const createChat = async (req, res) => {

    const { userId, chatMode, avatarId } = req.body;

    if (!userId || !chatMode) {
        return res.json({
            success: false,
            message: "Missing required details"
        });
    }

    const user = await userModel.findById(userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    const chatData = {
        userId,
        userName: user.firstName,
        name: "New Chat",
        messages: [],
        chatMode, 
        avatarId: avatarId ? avatarId : null
    }

    // Create and save the chat
    const newChat = await chatModel.create(chatData);

    // Populate if needed
    const createdChat = await chatModel.findById(newChat._id).select("name _id updatedAt chatMode");

    res.status(201).json({
        success: true,
        chat: createdChat
    });

}

//API Controller for getting all chats
export const getChats = async (req, res) => {

    const userId = req.body.userId;

    const chats = await chatModel.find({ userId, isArchived: false }).sort({ updatedAt: -1 }).select("name _id updatedAt chatMode");

    res.json({ success: true, chats });

}

//API Controller for getting the messages of a particular chat
export const getChatMessages = async (req, res) => {

    const { chatId } = req.query;
    const userId = req.body.userId;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "chatId is required",
      });
    }

    const chat = await chatModel.findOne({ _id: chatId, userId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: `Unable to load conversation ${chatId}`,
      });
    }

    res.json({ success: true, chatMessages: chat.messages, avatarId: chat.avatarId });

}

//API Controller for deleting a chat
export const deleteChat = async (req, res) => {

    const userId = req.body.userId;
    const { chatId } = req.body;

    if (!userId) {
        return res.json({ success: false, message: "Missing required fields!" });
    }

    if (chatId) {

        await chatModel.deleteOne({ _id: chatId, userId });

        res.json({ success: true, message: "Chat deleted successfully!" });

    }
    else {

        const result = await chatModel.deleteMany({ userId, isArchived: false });

        res.json({ success: true, message: `${result.deletedCount} chats deleted successfully!` });

    }

}

//----Renaming Feature Logic----------------------------------------------------------

//API Controller for renaming a chat
export const renameParticularChat = async (req, res) => {

    const { userId, chatId, newChatName } = req.body;

    if (!userId || !chatId || !newChatName) {
        return res.json({ success: false, message: "Missing required fields" });
    }

    const chat = await chatModel.findOne({ userId, _id: chatId });

    if (!chat) {
        return res.json({ success: false, message: "Chat not found!" });
    }

    chat.name = newChatName;
    await chat.save();

    res.json({ success: true, message: `Chat successfully renamed as ${newChatName}` });

}

//----Archive Feature Logic----------------------------------------------------------

//API Controller for archiving or unarchiving chats
export const archiveUnarchiveChat = async (req, res) => {

    const { userId, chatId, archive } = req.body;

    if (!userId || typeof archive !== "boolean") {
        return res.json({ success: false, message: "Missing required fields" });
    }

    switch (archive) {

        case true: {

            if (chatId) {

                const chat = await chatModel.findOne({ userId, _id: chatId });

                if (!chat) {
                    return res.status(404).json({ success: false, message: "Chat not found!" });
                }

                chat.isArchived = true;
                await chat.save();

                return res.json({
                    success: true,
                    message: "Chat successfully archived!"
                });

            } else {

                //Archiving all the chats
                const result = await chatModel.updateMany(
                    { userId, isArchived: false },
                    { $set: { isArchived: true } }
                );

                return res.json({
                    success: true,
                    message: `Successfully archived ${result.modifiedCount} chats!`
                });

            }

            break;

        }
        case false: {

            if (chatId) {

                const chat = await chatModel.findOne({ userId, _id: chatId });

                if (!chat) {
                    return res.status(404).json({ success: false, message: "Chat not found!" });
                }

                chat.isArchived = false;
                await chat.save();

                return res.json({
                    success: true,
                    message: "Chat successfully unarchived!"
                });

            } else {

                //Un-archiving all the chats
                const result = await chatModel.updateMany(
                    { userId, isArchived: true },
                    { $set: { isArchived: false } }
                );

                return res.json({
                    success: true,
                    message: `Successfully unarchived ${result.modifiedCount} chats!`
                });

            }

            break;

        }
        default: {
            return res.status(400).json({
                success: false,
                message: "Invalid archive value. Must be true or false"
            });
        }

    }

}

//API Controller for getting all the archived chats
export const getArchivedChats = async (req, res) => {

    const userId = req.body.userId;

    const archivedChats = await chatModel.find({ userId, isArchived: true }).sort({ updatedAt: -1 }).select("name _id updatedAt");

    res.json({ success: true, archivedChats });

}

//API Controller for deleting all the archived chats
export const deleteAllArchivedChats = async (req, res) => {

    const userId = req.body.userId;

    if (!userId) {
        return res.json({ success: false, message: "Missing required fields" });
    }

    const result = await chatModel.deleteMany({ userId, isArchived: true });

    res.json({ success: true, message: `${result.deletedCount} chats deleted successfully!` });

}

//----Share Feature Logic----------------------------------------------------------

//API Controller for enabling/disabling chat sharing
export const enableDisableChatSharing = async (req, res) => {

    const { chatId, userId, share } = req.body;

    if (!userId || typeof share !== "boolean") {
        return res.json({ success: false, message: "Missing required fields" });
    }

    switch (share) {

        //generate link
        case true: {

            if (!chatId) {
                return res.json({ success: false, message: "ChatId is required to share this chat!" });
            }

            const chat = await chatModel.findOne({
                _id: chatId,
                userId: userId,
            });

            if (!chat) {
                return res.status(404).json({ success: false, message: "Chat not found!" });
            }

            chat.shareId = randomUUID();
            chat.isPublic = true;
            await chat.save();

            return res.json({ success: true, shareLink: `${process.env.FRONTEND_URL}/share/${chat.shareId}` });

            break;

        }
        //revoke link
        case false: {

            if (chatId) {

                const chat = await chatModel.findOne({ userId, _id: chatId });

                if (!chat) {
                    return res.status(404).json({ success: false, message: "Chat not found!" });
                }

                await chatModel.updateOne(
                    { _id: chatId }, 
                    {
                        $set: { isPublic: false },
                        $unset: { shareId: "" }
                    }
                );

                return res.json({ success: true, message: "Chat sharing disabled successfully!" });

            } else {

                //Un-sharing all the chats
                const result = await chatModel.updateMany(
                    { userId, isPublic: true },
                    { $set: { isPublic: false }, $unset: { shareId: "" } }
                );

                return res.json({
                    success: true,
                    message: `Successfully unshared ${result.modifiedCount} chats!`
                });

            }

            break;

        }
        default: {
            return res.status(400).json({
                success: false,
                message: "Invalid share value. Must be true or false"
            });
        }

    }

}

//API Controller for getting share status and link if already generated
export const getShareStatusAndLink = async (req, res) => {

    const { chatId } = req.query;
    const userId = req.body.userId;

    if (!userId || !chatId) {
        return res.json({ success: false, message: "Missing required fields" });
    }

    const chat = await chatModel.findOne({
        _id: chatId,
        userId: userId,
    });

    if (!chat) {
        return res.status(404).json({ success: false, message: "Chat not found!" });
    }

    if (chat.isPublic && chat.shareId) {

        return res.json({ success: true, shareLink: `${process.env.FRONTEND_URL}/share/${chat.shareId}`, shareStatus: "active" });

    }
    else {
        return res.json({ success: true, shareLink: "", shareStatus: "inactive" });
    }

}

//API Controller for loading shared chat (read-only mode)
export const getSharedChat = async (req, res) => {

    const { shareId } = req.params;

    const chat = await chatModel.findOne({
        shareId,
        isPublic: true,
    }).select("userName name messages -_id");

    if (!chat) {
        return res.status(404).json({ success: false, message: "Shared chat not found" });
    }

    res.json({ success: true, chat, readOnly: true });

}

//API Controller for saving a copy of the shared chat
export const saveSharedChat = async (req, res) => {

    const { shareId } = req.params;

    //Loading the user
    const user = await userModel.findById(req.body.userId);

    if (!user) {
        return res.status(404).json({ success: false, message: "Unauthorised!" });
    }

    if (user.credits < 10) {
        return res.status(403).json({ success: false, message: "You need at least 50 credits to save a copy!" });
    }

    //Loading the original chat
    const originalChat = await chatModel.findOne({
        shareId,
        isPublic: true,
    });

    if (!originalChat) {
        return res.status(404).json({ success: false, message: "Shared chat not found!" });
    }

    // console.log(originalChat.userId);
    // console.log(req.body.userId);

    //Prevent saving your own chat
    if (originalChat.userId.toString() === req.body.userId.toString()) {
        return res.status(400).json({ success: false, message: "You already own this chat!" });
    }

    //Checking if already saved
    const existingCopy = await chatModel.findOne({
        userId: req.body.userId,
        clonedFrom: originalChat._id,
    });

    if (existingCopy) {
        return res.json({ success: false, message: "Chat already saved!", chatId: existingCopy._id });
    }

    //Clonning the chat
    const newChat = await chatModel.create({
        userId: req.body.userId,
        userName: user.firstName,
        name: originalChat.name,
        messages: originalChat.messages,
        isPublic: false,
        clonedFrom: originalChat._id,
    });

    //Deducting credits
    await deductCredits(req.body.userId, 10);

    res.json({ success: true, message: "Chat copied successfully", chat: newChat });

}

//API Controller for getting all the shared chats
export const getAllSharedChats = async (req, res) => {

    const userId = req.body.userId;

    const sharedChats = await chatModel.find({ userId, isPublic: true }).sort({ updatedAt: -1 }).select("name _id updatedAt");

    res.json({ success: true, sharedChats });

}

//API Controller for deleting all shared chats
export const deleteAllSharedChats = async (req, res) => {

    const userId = req.body.userId;

    if (!userId) {
        return res.json({ success: false, message: "Missing required fields" });
    }

    const result = await chatModel.deleteMany({ userId, isPublic: true });

    res.json({ success: true, message: `${result.deletedCount} chats deleted successfully!` });

}