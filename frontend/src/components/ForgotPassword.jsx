import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import api from "@/lib/axios";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const ForgotPassword = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(600);

  const handleSendOtp = async () => {
    try {
      await api.post("/auth/send-otp", { email });
      toast.success("Mã OTP đã được gửi đến email của bạn.");
      setStep(2);
      setTimeLeft(600); // Reset thời gian khi gửi lại OTP
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại."
      );
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await api.post("/auth/verify-otp", { email, otp });
      toast.success("Xác thực OTP thành công. Mật khẩu của bạn là '123456'.");
      onClose(); // Đóng modal sau khi xác thực thành công
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP không hợp lệ.");
    }
  };

  useEffect(() => {
    if (step !== 2 || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const otpSlotClass =
    "border-2 border-black/70 font-semibold text-lg mx-1 rounded-md";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-3xl py-1 font-bold text-transparent bg-primary bg-clip-text text-center">
          Quên mật khẩu
        </h2>

        {step === 1 ? (
          // Step 1: Nhập email
          <>
            <Input
              type="email"
              placeholder="Nhập Email của bạn."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 text-base bg-slate-50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
            />
            <Button
              onClick={handleSendOtp}
              disabled={!email.trim()}
              variant="gradient"
            >
              Gửi mã OTP
            </Button>
          </>
        ) : (
          // Step 2: Nhập OTP
          <>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} className={otpSlotClass} />
                  <InputOTPSlot index={1} className={otpSlotClass} />
                  <InputOTPSlot index={2} className={otpSlotClass} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} className={otpSlotClass} />
                  <InputOTPSlot index={4} className={otpSlotClass} />
                  <InputOTPSlot index={5} className={otpSlotClass} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="text-center text-sm text-muted-foreground mb-2">
              Mã OTP sẽ hết hạn sau:{" "}
              <span className="text-red-500 font-medium">
                {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>
            <Button
              onClick={handleVerifyOtp}
              disabled={otp.length !== 6 || timeLeft <= 0}
              variant="gradient"
            >
              Xác nhận
            </Button>
          </>
        )}

        <Button variant="ghost" onClick={onClose} className="ml-5">
          Đóng
        </Button>
      </div>
    </div>
  );
};

export default ForgotPassword;
