import express from 'express'
import { clerkWebhooks, enableDisableAvatarMemory, enableDisablePersonalizationMemory, getLastPurchase, getPublishedImages, getUserCreditDetails, updatePersonalizationData } from '../controllers/userController.js'
import {wrapAsync} from '../middlewares/WrapAsync.js'
import {authUser} from '../middlewares/authUser.js'

const userRouter = express.Router();

userRouter.post('/webhooks', wrapAsync(clerkWebhooks));
userRouter.get('/published-images', wrapAsync(getPublishedImages));

userRouter.get('/get-credits', authUser , wrapAsync(getUserCreditDetails));
userRouter.get('/last-purchase', authUser , wrapAsync(getLastPurchase));

userRouter.post('/update-enable-status/avatar-memory', authUser, wrapAsync(enableDisableAvatarMemory));
userRouter.post('/update-enable-status/personalization-memory', authUser, wrapAsync(enableDisablePersonalizationMemory));
userRouter.patch('/update-personalization-data', authUser, wrapAsync(updatePersonalizationData));

export default userRouter;