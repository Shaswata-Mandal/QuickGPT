import express from 'express'
import { clerkWebhooks, getLastPurchase, getMemorySettings, getPersonalizationData, getPublishedImages, getUserCreditDetails, updateMemorySettings, updatePersonalizationData } from '../controllers/userController.js'
import {wrapAsync} from '../middlewares/WrapAsync.js'
import {authUser} from '../middlewares/authUser.js'

const userRouter = express.Router();

userRouter.post('/webhooks', wrapAsync(clerkWebhooks));
userRouter.get('/published-images', wrapAsync(getPublishedImages));

userRouter.get('/get-credits', authUser , wrapAsync(getUserCreditDetails));
userRouter.get('/last-purchase', authUser , wrapAsync(getLastPurchase));

userRouter.get('/memory-settings', authUser, wrapAsync(getMemorySettings));
userRouter.patch('/memory-settings', authUser, wrapAsync(updateMemorySettings));
userRouter.get('/get-personalization-data', authUser, wrapAsync(getPersonalizationData));
userRouter.patch('/update-personalization-data', authUser, wrapAsync(updatePersonalizationData));

export default userRouter;