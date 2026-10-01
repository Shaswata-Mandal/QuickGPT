import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/mongoDB.js'
import ExpressError from './middlewares/ExpressError.js'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import creditRouter from './routes/creditRoutes.js'
import avatarRouter from './routes/avatarRoutes.js'

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    exposedHeaders: [
        "x-chat-name", "x-llm-warning", "x-llm-remaining", "x-llm-window",
        "x-llm-locked-provider", "x-llm-locked", "x-llm-cooldown",
    ]
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        next(error);
    }
});

app.get('/', (req, res) => {
    res.send("Server is Live!");
});

app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);
app.use('/api/plans', creditRouter);
app.use('/api/avatars', avatarRouter);

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).send({ success: false, message, statusCode });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});