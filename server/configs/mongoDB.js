import mongoose from "mongoose";

const connectDB = async ()=>{

    try {
        
        //event for giving a message upon successful conneciton with the database
        mongoose.connection.on("connected", ()=>{
            console.log("Database connected successfully!")
        })

        //connecting with the database
        await mongoose.connect(`${process.env.MONGODB_URI}/quickgpt`);

    } catch (error) {
        
        console.log(error.message);

    }

}

export default connectDB;