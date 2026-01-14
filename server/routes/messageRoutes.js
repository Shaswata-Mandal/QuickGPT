import express from 'express'
import {authUser} from '../middlewares/authUser.js'
import {wrapAsync} from '../middlewares/WrapAsync.js'
import { imageMessageController, textMessageController } from '../controllers/messageController.js';

const messageRouter = express.Router();

messageRouter.post('/text', authUser, wrapAsync(textMessageController));
messageRouter.post('/image', authUser, wrapAsync(imageMessageController));

export default messageRouter;