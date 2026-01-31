import userModel from "../models/userModel.js";

export const canUserAffordCredits = async (userId, creditAmount) => {

    const user = await userModel.findById(userId).select("freeCredits creditBalance");

    if (!user) return false;

    const totalCredits = user.freeCredits + user.creditBalance;

    return totalCredits >= creditAmount;

};