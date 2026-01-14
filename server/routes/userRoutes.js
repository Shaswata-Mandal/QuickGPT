import express from 'express'
import { clerkWebhooks, getLastPurchase, getPublishedImages, getUserCreditDetails } from '../controllers/userController.js'
import {wrapAsync} from '../middlewares/WrapAsync.js'
import {authUser} from '../middlewares/authUser.js'

const userRouter = express.Router();

userRouter.post('/webhooks', wrapAsync(clerkWebhooks));
userRouter.get('/published-images', wrapAsync(getPublishedImages));

userRouter.get('/get-credits', authUser , wrapAsync(getUserCreditDetails));
userRouter.get('/last-purchase', authUser , wrapAsync(getLastPurchase));

export default userRouter;