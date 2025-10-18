import { useState } from "react";
import { register } from "../lib/axios";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const isFormValid =
    form.username.trim() !== "" &&
    form.email.trim() !== "" &&
    form.password.trim() !== "";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);

      // Lưu user
      localStorage.setItem("user", JSON.stringify({username: form.username}));

      toast.success("Đăng ký tài khoản thành công.");
      navigate("/login");
    } catch (err) {
      const message = err?.response?.data?.message;
      toast.error(message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="max-w-md w-full p-6 border-0 bg-gradient-card shadow-custom-lg">
        <div className="relative flex items-center">
          <Link to="/login" className="absolute">
            <ArrowLeft className="size-7" />
          </Link>
          <h2 className="text-3xl py-1 font-bold text-transparent bg-primary bg-clip-text text-center flex-1">
            Đăng ký
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="font-medium mb-1 text-muted-foreground"
            >
              Tên người dùng
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className="h-12 text-base bg-slate-50 border-border/50 focus:border-primary/50 focus:ring-primary/20 capitalize"
            />
          </div>

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
            Đăng ký
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Register;
