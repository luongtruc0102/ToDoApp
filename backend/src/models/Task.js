import mongoose from "mongoose";

const taskSchame = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["active", "complete"],
            default: "active",
        },
        completedAt: {
            type: Date,
            default: null,
        }
    },
    {
        timestamps: true //createdAt và updateAt tự động thêm vào
    }
);

const Task = mongoose.model("Task", taskSchame);
export default Task;