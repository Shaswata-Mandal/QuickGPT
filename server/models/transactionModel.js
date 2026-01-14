import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true,
    },
    plan: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    credits: {
        type: Number,
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    razorpay_order_id: {
        type: String,
        required: true,
    },
    razorpay_payment_id: {
        type: String,
        required: true, 
    },

}, {timestamps: true});

const transactionModel = mongoose.models.transaction || mongoose.model("transaction", transactionSchema);

export default transactionModel;