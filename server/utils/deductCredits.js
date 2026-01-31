import userModel from "../models/userModel.js";

//Helper function to deduct credits
export const deductCredits = async (userId, creditAmount) => {

    const user = await userModel.findById(userId).select("freeCredits creditBalance");

    if (!user) return false;

    const totalCredits = user.freeCredits + user.creditBalance;

    let remaining = creditAmount;

    //Deducting from free credits first
    if (user.freeCredits > 0) {
        const freeUsed = Math.min(user.freeCredits, remaining);
        user.freeCredits -= freeUsed;
        remaining -= freeUsed;
    }

    //Deducting remaining from paid credits
    if (remaining > 0) {
        user.creditBalance -= remaining;
    }

    await user.save();

}