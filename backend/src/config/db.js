import mongoose from 'mongoose';

export const connectDB = async() => {
    try {
       await mongoose.connect(
        process.env.MONGODB_CONNECTIONSTRONG
    );

       console.log("Liên kết mongo thành công")
    } catch (error) {
        console.error("Lỗi kết nối DB");
        process.exit(1); //1: thoát khi có lỗi - 0: thoát khi thành công
    }
}