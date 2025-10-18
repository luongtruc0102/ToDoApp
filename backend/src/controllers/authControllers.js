import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

//Register
export const Register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email 
          ? "Email đã được sử dụng" 
          : "Tên đăng nhập đã được sử dụng"
      });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Tạo tài khoản thành công." });
  } catch (error) {    
    // Xử lý lỗi validation MongoDB
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: field === 'email' 
          ? "Email đã được sử dụng" 
          : "Tên đăng nhập đã được sử dụng"
      });
    }
    
    // Lỗi validation khác
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: "Lỗi server khi đăng ký" });
  }
};

//Login
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Tài khoản không tồn tại." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Mật khẩu không đúng." });

    //Tạo token
    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "1d",
    });
    res.json({
      message: "Đăng nhập thành công.",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({message: "Lỗi server khi đăng nhập"});
  }
};

//Forgot Password - Gửi mã OTP về email
export const sendOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Email không tồn tại." });

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Tạo mã OTP 6 chữ số
  user.resetOtp = otp;
  user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // OTP hết hạn sau 10 phút
  await user.save();

  // Gửi email 
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"ToDoApp" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Mã OTP đặt lại mật khẩu',
    text: `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 10 phút.`,
  });
  res.json({ message: "Đã gửi mã OTP về email." });
};

//Xác thực OTP và đặt lại mật khẩu
export const verifyOtp = async (req, res) => {
  const {email, otp} = req.body;
  const user = await User.findOne({ email });

  if (!user || user.resetOtp !== otp || Date.now() > user.resetOtpExpiry ){
    return res.status(400).json({ message: "Mã OTP không hợp lệ hoặc đã hết hạn." });
  };

  const hashed = await bcrypt.hash("123456", 10); // Mật khẩu mặc định sau khi đặt lại
  user.password = hashed;
  user.resetOtp = undefined;
  user.resetOtpExpiry = undefined;
  await user.save();

  res.json({ message: "Đặt lại mật khẩu thành công. Mật khẩu mới là '123456'." });
};

//Đổi mật khẩu
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại." });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu hiện tại không đúng." });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Đổi mật khẩu thành công." });
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error);
    res.status(500).json({ message: "Lỗi server khi đổi mật khẩu" });
  }
}