import express from 'express'
import {wrapAsync} from '../middlewares/WrapAsync.js';
import {authUser} from '../middlewares/authUser.js';
import { getLastPurchasedPlan, getPlans, paymentRazorpay, verifyRazorpay } from '../controllers/creditController.js';

const creditRouter = express.Router();

creditRouter.get('/get-plans', authUser, wrapAsync(getPlans));
creditRouter.post('/pay-razor', authUser, wrapAsync(paymentRazorpay));
creditRouter.post('/verify-razor', authUser, wrapAsync(verifyRazorpay));
creditRouter.post('/last-purchased', authUser, wrapAsync(getLastPurchasedPlan));

export default creditRouter;