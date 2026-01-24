import express from "express"
import { authUser } from "../middlewares/authUser.js";
import { wrapAsync } from "../middlewares/WrapAsync.js";
import { deleteAvatarMemories, getAvailableAvatarDetails, getAvatarMemories } from "../controllers/avatarController.js";

const avatarRouter = express.Router();

avatarRouter.get("/get", authUser, wrapAsync(getAvailableAvatarDetails));
avatarRouter.get("/get-avatar-memories", authUser, wrapAsync(getAvatarMemories));
avatarRouter.post("/delete-avatar-memories", authUser, wrapAsync(deleteAvatarMemories));

export default avatarRouter;