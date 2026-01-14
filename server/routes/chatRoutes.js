import express from 'express'
import { archiveUnarchiveChat, createChat, deleteAllArchivedChats, deleteAllSharedChats, deleteChat, enableDisableChatSharing, getAllSharedChats, getArchivedChats, getChats, getSharedChat, getShareStatusAndLink, renameParticularChat, saveSharedChat } from '../controllers/chatController.js'
import {authUser} from '../middlewares/authUser.js'
import {wrapAsync} from '../middlewares/WrapAsync.js'
import {shareRateLimiter} from '../middlewares/shareRateLimiter.js'

const chatRouter = express.Router();

chatRouter.post('/create', authUser, wrapAsync(createChat));
chatRouter.get('/get', authUser, wrapAsync(getChats));
chatRouter.post('/delete', authUser, wrapAsync(deleteChat));

chatRouter.post('/rename-chat', authUser, wrapAsync(renameParticularChat));

//Chat archiving feature
chatRouter.get('/get-archived-chats', authUser, wrapAsync(getArchivedChats))
chatRouter.post('/archive-unarchive-chat', authUser, wrapAsync(archiveUnarchiveChat));
chatRouter.post('/delete-all-archived-chats', authUser, wrapAsync(deleteAllArchivedChats));

//Chat sharing feature
chatRouter.post("/share-unshare-chat", authUser, wrapAsync(enableDisableChatSharing));
chatRouter.get("/get-share-status-and-link", authUser, wrapAsync(getShareStatusAndLink));
chatRouter.get("/share/:shareId", shareRateLimiter, wrapAsync(getSharedChat));
chatRouter.post("/share/:shareId/save", shareRateLimiter, authUser, wrapAsync(saveSharedChat));
chatRouter.get("/get-all-shared-chats", authUser, wrapAsync(getAllSharedChats));
chatRouter.post("/delete-all-shared-chats", authUser, wrapAsync(deleteAllSharedChats));

export default chatRouter;