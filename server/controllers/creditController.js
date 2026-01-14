import transactionModel from "../models/transactionModel.js"
import razorpay from 'razorpay'
import userModel from "../models/userModel.js";
import crypto from 'crypto';

const plans = [
    {
        id: 'Free',
        name: 'Free',
        price: 0,
        credits: 5,
        desc: 'Perfect for getting started!',
        features: [
            '5 free credits monthly',
            'Basic text generation',
            'Standard response speed',
            'Community support',
            'Access to GPT-3.5 model'
        ],
        popular: false,
        cta: "Get Started",
    },
    {
        id: 'Starter',
        name: 'Starter',
        price: 8,
        credits: 100,
        desc: 'Great for casual users!',
        features: [
            '100 credits monthly',
            'Text & image generation',
            'Faster response times',
            'Email support',
            'Access to GPT-4 model',
            'Basic customization options'
        ],
        popular: false,
        cta: "Purchase",
    },
    {
        id: 'Pro',
        name: 'Pro',
        price: 19,
        credits: 500,
        desc: 'Perfect for power users!',
        features: [
            '500 credits monthly',
            'Advanced text & image generation',
            'Priority response times',
            'Priority email & chat support',
            'Access to GPT-4 Turbo',
            'Advanced customization',
            'API access',
            'Custom instructions'
        ],
        popular: true,
        cta: "Purchase",
    },
    {
        id: 'Team',
        name: 'Team',
        price: 49,
        credits: 1500,
        desc: 'Collaborate with your team!',
        features: [
            '1,500 credits monthly',
            'All Pro features',
            'Team workspace',
            'Shared conversations',
            'Admin controls',
            'Dedicated support channel',
            'Custom model fine-tuning',
            'Bulk operations'
        ],
        popular: false,
        cta: "Purchase",
    },
    {
        id: 'Enterprise',
        name: 'Enterprise',
        price: 99,
        credits: 5000,
        desc: 'For large-scale applications!',
        features: [
            '5,000 credits monthly',
            'All Team features',
            'Custom SLA guarantees',
            'Dedicated account manager',
            'On-premise deployment option',
            'Advanced security & compliance',
            'Custom model training',
            '24/7 phone support',
            'Usage analytics dashboard'
        ],
        popular: false,
        cta: "Purchase",
    }
];

//API Controller for getting all the plans
export const getPlans = async (req, res) => {

    res.json({ success: true, plans });

}

//API controller for getting the last purchased plan
export const getLastPurchasedPlan = async (req, res) => {

    const { userId } = req.body;

    //Finding the last purchased plan for this user
    const lastPurchase = await transactionModel.findOne(
        {
            userId: userId, 
            isPaid: true
        }
    )
    .sort({ createdAt: -1 }) // Sort by createdAt descending (newest first)
    .select('plan') // Only return the plan field
    .lean();

    res.json({ success: true, plan: lastPurchase ? lastPurchase.plan : null });

}

//Payment gateway initialization
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//API to make payment for credits
export const paymentRazorpay = async (req, res) => {

    const { userId, planId } = req.body;

    const userData = await userModel.findById(userId);

    if (!userData || !planId) {
        return res.json({ success: false, message: "Invalid Credentials" });
    }

    let plan = plans.find(plan => plan.id === planId);

    if (!plan) {
        return res.json({ success: false, message: "Invalid Plan!" });
    }

    //Now we have to initialize an order for razorpay instance using options
    const options = {
        amount: plan.price * 100,
        currency: process.env.CURRENCY,
        notes: { // Store metadata for verification
            userId,
            planId: plan.id,
            credits: plan.credits
        }
    };

    await razorpayInstance.orders.create(options, (error, order) => {
        if (error) {
            res.json({ success: false, message: error });
        }

        res.json({ success: true, order });
    });

}

//API controller to verify razorpay payment and add credits
export const verifyRazorpay = async (req, res) => {

    try {

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // 1. First, verify the payment signature for security
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed: Invalid signature"
            });
        }

        // 2. Fetch payment details from Razorpay
        const payment = await razorpayInstance.payments.fetch(razorpay_payment_id);

        if (payment.status !== 'captured') {
            return res.status(400).json({
                success: false,
                message: "Payment not successful. Status: " + payment.status
            });
        }

        // 3. Fetch order details (contains our metadata)
        const order = await razorpayInstance.orders.fetch(razorpay_order_id);

        // Check if order notes exist
        if (!order.notes || !order.notes.userId) {
            return res.status(400).json({
                success: false,
                message: "Invalid order data: Missing user information"
            });
        }

        const userId = order.notes.userId;
        const planId = order.notes.planId;
        const credits = parseInt(order.notes.credits) || 0;

        // 4. Verify user exists
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // 5. Create transaction record
        const transactionData = {
            userId: userId,
            plan: planId,
            amount: order.amount / 100, // Convert back to rupees
            credits: credits,
            razorpay_order_id: razorpay_order_id,
            razorpay_payment_id: razorpay_payment_id,
            isPaid: true
        };

        await transactionModel.create(transactionData);

        // 6. Update user credits
        await userModel.findByIdAndUpdate(
            userId, 
            { $inc: { creditBalance: credits } }
        );

        res.json({
            success: true,
            message: "Payment verified and credits added!",
            creditsAdded: credits
        });

    } catch (error) {

        console.error("Verification error:", error);

        res.status(500).json({
            success: false,
            message: "Payment verification failed"
        });

    }

};