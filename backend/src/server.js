import express from 'express';
import taskRoute from './routers/tasksRouters.js'
import authRoute from './routers/authsRouter.js'
import { connectDB } from './config/db.js';
import dotenv from 'dotenv'
import cors from 'cors';
import path from 'path';

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

//middlewares
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoute)
app.use("/api/tasks", taskRoute)

// ✅ Static frontend build
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

// ✅ Connect DB + Start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ server đang chạy cổng ${PORT}`)
    });
});