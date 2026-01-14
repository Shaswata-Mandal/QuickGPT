import userModel from "../models/userModel.js";

//Helper function to deduct credits
export const deductCredits = async (userId, creditAmount) => {

    const user = await userModel.findById(userId);

    if (user.freeCredits >= creditAmount) {
        await userModel.updateOne({ _id: userId }, { $inc: { freeCredits: -creditAmount } });
    } else {
        await userModel.updateOne({ _id: userId }, { $inc: { creditBalance: -creditAmount } });
    }

}