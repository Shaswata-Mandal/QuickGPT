import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'

//middleware to decode jwt token to get clerk id for user verification
export const authUser = async (req, res, next) => {

    try {

        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized! Login Again!"
            });
        }

        // Verify and decode the token
        const token_decode = jwt.decode(token);

        // Find user by clerkId
        const user = await userModel.findOne({ clerkId: token_decode.sub });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        req.body = req.body || {};
        req.body.userId = user._id;

        next();

    } catch (error) {

        console.log(error.message);
        res.json({ success: false, message: error.message });

    }

}