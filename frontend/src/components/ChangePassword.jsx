import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import api from "@/lib/axios";

const ChangePassword = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/auth/change-password",
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Đổi mật khẩu thành công.");
      onClose();
    } catch (error) {
      console.error("❌ Lỗi khi đổi mật khẩu:", error);
      toast.error(error.response?.data?.message || "Lỗi khi đổi mật khẩu.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-3xl py-1 font-bold text-transparent bg-primary bg-clip-text text-center">
          Quên mật khẩu
        </h2>

        {/* Mật khẩu hiện tại */}
        <div className="relative">
          <Input
            type={showCurrent ? "text" : "password"}
            placeholder="Mật khẩu hiện tại"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="h-12 text-base bg-slate-50 border-border/50 focus:border-primary/50 focus:ring-primary/20 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowCurrent((prev) => !prev)}
            className="absolute right-2 top-3 text-muted-foreground"
          >
            {showCurrent ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>

        {/* Mật khẩu mới */}
        <div className="relative">
          <Input
            type={showNew ? "text" : "password"}
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="h-12 text-base bg-slate-50 border-border/50 focus:border-primary/50 focus:ring-primary/20 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowNew((prev) => !prev)}
            className="absolute right-2 top-3 text-muted-foreground"
          >
            {showNew ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>

        {/* Xác nhận mật khẩu mới */}
        <div className="relative">
          <Input
            type={showConfirm ? "text" : "password"}
            placeholder="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-12 text-base bg-slate-50 border-border/50 focus:border-primary/50 focus:ring-primary/20 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((prev) => !prev)}
            className="absolute right-2 top-3 text-muted-foreground"
          >
            {showConfirm ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleChangePassword}
            variant="gradient"
            disabled={!currentPassword || !newPassword || !confirmPassword}
          >
            Xác nhận
          </Button>

          <Button variant="ghost" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
