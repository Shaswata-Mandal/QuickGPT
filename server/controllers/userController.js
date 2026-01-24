import { Webhook } from 'svix'
import userModel from '../models/userModel.js'
import chatModel from '../models/chatModel.js';
import transactionModel from '../models/transactionModel.js'
//API Controller function to manage clerk user with our database
// http://localhost:3000/api/user/webhooks

export const clerkWebhooks = async (req, res) => {

    //Create a Svix instance with clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    //If the svix id, timestamp and signature is correct according to the clerk webhook secret then the process will proceed further
    await whook.verify(JSON.stringify(req.body), {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"]
    });


    //Checking the type of the event
    const { data, type } = req.body;

    switch (type) {

        case "user.created": {

            const user = await userModel.findOne({ email: data.email_addresses[0].email_address });

            if (!user) {

                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url, 
                    personalization: {},
                }

                console.log(userData);

                await userModel.create(userData);

            }
            else {

                await chatModel.deleteMany({ userId: user._id });
                await avatarMemoryModel.deleteMany({ userId: user._id });

                //update the new clerkId of the old user
                await userModel.findByIdAndUpdate(user._id, { clerkId: data.id });

            }

            res.json({});

            break;
        }

        case "user.updated": {

            const userData = {
                email: data.email_addresses[0].email_address,
                firstName: data.first_name,
                lastName: data.last_name,
                photo: data.image_url
            };

            await userModel.findOneAndUpdate({ clerkId: data.id }, userData);

            res.json({ success: true, message: "User data updated successfully!" });

            break;
        }

        case "user.deleted": {

            res.json({ success: true, message: "User delete successfully!" });

            break;
        }

        default:
            break;

    }

}

//API to get published images
export const getPublishedImages = async (req, res) => {

    const publishedImageMessages = await chatModel.aggregate([
        { $unwind: "$messages" },
        {
            $match: {
                "messages.isImage": true,
                "messages.isPublished": true
            }
        },
        {
            $project: {
                _id: 0,
                imageUrl: "$messages.content",
                userName: "$userName"
            }
        }
    ]);

    res.json({ success: true, images: publishedImageMessages.reverse() });

}

//API to get user credit details
export const getUserCreditDetails = async (req, res) => {

    const { userId } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
        return res.json({ success: false, message: "User not found!" });
    }

    res.json({ success: true, credits: user.creditBalance, freeCredits: user.freeCredits });

}

//API to get the last purchased plan details
export const getLastPurchase = async (req, res) => {

    const { userId } = req.body;

    const lastPurchase = await transactionModel.findOne(
        {
            userId: userId,
            isPaid: true
        },
        { plan: 1 },
        { sort: { createdAt: -1 } }  // Sort by newest first
    ).lean();

    res.json({ success: true, plan: lastPurchase ? lastPurchase.plan : null });

}

//API to enable or disable avatarMemory for the user
export const enableDisableAvatarMemory = async (req, res) => {

    const { userId } = req.body;

    if (!userId || !enableStatus) {
        return res.json({ success: false, message: "Missing required details!" });
    }

    const user = await userModel.findById(userId);

    await userModel.updateOne({ _id: userId }, { avatarMemoryEnabled: !user.avatarMemoryEnabled });

    return res.json({ success: true, message: "Avatar memory enable status updated successsfully!", enableStatus: user.avatarMemoryEnabled });

}

//API to enable or disable user personalization memory for the user
export const enableDisablePersonalizationMemory = async (req, res) => {

    const { userId } = req.body;

    if (!userId || !enableStatus) {
        return res.json({ success: false, message: "Missing required details!" });
    }

    const user = await userModel.findById(userId);

    await userModel.updateOne({ _id: userId }, { personalizationMemoryEnabled: !user.personalizationMemoryEnabled });

    return res.json({ success: true, message: "Personalization memory enable status updated successsfully!", enableStatus: user.personalizationMemoryEnabled });

}

//API to update the personalization memory for the user
export const updatePersonalizationData = async (req, res) => {

    const { userId, payload } = req.body;

    if(!user || !payload) {
        return res.json({ success: false, message: "Missing required details!" });
    }

    const user = await userModel.findById(userId);

    await user.updateOne(
        { _id: userId }, 
        { $set: { personalization: payload.personalization } }
    );

    return res.json({ success: true, message: "Personalization data updated successfully!" });

}