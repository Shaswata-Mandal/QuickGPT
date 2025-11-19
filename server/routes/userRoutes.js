import express from 'express'
import { clerkWebhooks } from '../controllers/userController.js'
import {wrapAsync} from '../middlewares/WrapAsync.js'

const userRouter = express.Router();

userRouter.post('/webhooks', wrapAsync(clerkWebhooks));

export default userRouter;