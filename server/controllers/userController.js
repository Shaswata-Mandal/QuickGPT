import { Webhook } from 'svix'
import userModel from '../models/userModel.js'
//API Controller function to manage clerk user with our database
// http://localhost:3000/api/user/webhooks

const clerkWebhooks = async (req, res) => {

    //Create a Svix instance with clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    console.log(req.body);

    //If the svix id, timestamp and signature is correct according to the clerk webhook secret then the process will proceed further
    await whook.verify(JSON.stringify(req.body), {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"]
    });


    //Checking the type of the event
    const { data, type } = req.body;

    console.log(data, type);

    switch (type) {

        case "user.created": {

            const user = await userModel.findOne({ email: data.email_addresses[0].email_address });

            if(!user){

                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                }

                console.log(userData);

                await userModel.create(userData);

            }
            else{

                //update the new clerkId of the old user
                await userModel.findByIdAndUpdate(user._id, {clerkId: data.id});

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

            await userModel.findOneAndUpdate( {clerkId: data.id}, userData );

            res.json({});

            break;
        }

        case "user.deleted": {

            res.json({});

            break;
        }

        default:
            break;

    }

}

export {clerkWebhooks};