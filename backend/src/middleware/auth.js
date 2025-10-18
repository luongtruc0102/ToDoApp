import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

export const auth = (req, res, next) => {

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) { 
            return res.status(401).json({ message: "Không có token hoặc token không hợp lệ." })
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT)
        // gắn thông tin user vào request
        req.user = {
            _id: new mongoose.Types.ObjectId(decoded.id)
        };

        next()
    } catch (error) {
        console.error("❌ Lỗi xác thực token:", error.message);
        res.status(400).json({message: "token không hợp lệ."});
    }
}