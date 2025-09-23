import express from 'express';
import taskRoute from './routers/tasksRouters.js'
import { connectDB } from './config/db.js';
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

//middlewares
app.use(express.json());
app.use(cors({origin: "http://localhost:5173"}));

app.use("/api/tasks", taskRoute)

connectDB().then(() => {
    app.listen(5001, () => {
        console.log(`server đang chạy cổng ${PORT}`)
    });
});