import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/mongoDB.js'
import ExpressError from './middlewares/ExpressError.js'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import creditRouter from './routes/creditRoutes.js'

const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();


//Middleware
app.use(cors());
app.use(express.json());


//Routes
app.get('/', (req, res)=>{
    res.send("Server is Live!");
});

app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);
app.use('/api/plans', creditRouter);

app.use((req,res,next)=>{
    next(new ExpressError(404, "Page Not Found"));
});


//-------------------------------------------------------------------------------------------------------------------------------------
//Creating different middlewares for error handling----------------------------------------------------------
app.use((err, req, res, next)=>{
    //deconstrsucting any error thrown to this middleware
    let {statusCode=500, message="something went wrong"}=err;
    res.status(statusCode).send({success: false, message: message, statusCode: statusCode});
});


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});