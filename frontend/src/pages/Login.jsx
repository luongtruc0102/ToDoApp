import { useState } from "react";
import { login } from "../lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import {ForgotPassword} from "../components/Index.jsx";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login(form);

      // 🔹 Kiểm tra token hợp lệ
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);

        //Nếu backend có trả về user thì lưu lại
        if (res?.data?.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        navigate("/"); // Điều hướng về trang chính
        toast.success("Đăng nhập thành công.");
      } else {
        toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      const message = err.response?.data?.message;
      toast.error(message);
    }
  };

  const isFormValid = form.email.trim() !== "" && form.password.trim() !== "";

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="max-w-md w-full p-6 border-0 bg-gradient-card shadow-custom-lg">
        <h2 className="text-3xl py-1 font-bold text-transparent bg-primary bg-clip-text text-center">
          Đăng nhập
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="font-medium mb-1 text-muted-foreground"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="123@gmail.com"
              value={form.email}
              onChange={handleChange}
              className="h-12 text-base bg-slate-50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
              required
            />
          </div>

          <div className="flex flex-col relative">
            <label
              htmlFor="password"
              className="font-medium mb-1 text-muted-foreground"
            >
              Mật khẩu
            </label>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="········"
              value={form.password}
              onChange={handleChange}
              className="h-12 text-base bg-slate-50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-3 text-muted-foreground hover:text-black"
            >
              {showPassword ? (
                <Eye className="size-5" />
              ) : (
                <EyeOff className="size-5" />
              )}
            </button>
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="xl"
            disabled={!isFormValid}
            className={`mt-2 px-6 transition ${
              !isFormValid
                ? "opacity-50 cursor-not-allowed"
                : "opacity-100 cursor-pointer"
            }`}
          >
            Đăng nhập
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-2">
          <button onClick={() => setShowModal(true)} className="text-primary font-medium cursor-pointer hover:underline">
            Quên mật khẩu?
          </button>
        </p>
        {showModal && <ForgotPassword onClose={() => setShowModal(false)} />}

        <p className="text-sm text-center text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-primary font-medium hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
