"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/admin",
    });
    setLoading(false);

    if (res?.ok) {
      router.push("/admin");
    } else {
      setError("Email hoặc mật khẩu không đúng");
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />

      <div className="mx-auto grid min-h-screen max-w-[1440px] grid-cols-1 lg:grid-cols-2">
        {/* Left visual panel */}
        <div className="relative hidden items-center justify-center p-16 lg:flex">
          <div className="absolute inset-0" aria-hidden>
            <div className="absolute left-10 top-10 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />
            <div className="absolute right-16 bottom-16 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />
          </div>
          <div className="relative max-w-xl">
            <Image
              src="https://vj-prod-website-cms.s3.ap-southeast-1.amazonaws.com/agdfsjhahfj-1751956801078.jpg"
              alt="Hồ Gươm (Hoàn Kiếm Lake), Hà Nội"
              width={600}
              height={600}
              className="opacity-90 rounded-2xl shadow-2xl object-cover"
              priority
            />
            <div className="mt-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm text-gray-700 shadow-sm backdrop-blur">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Secure Admin Access
              </span>
              <h2 className="mt-4 text-4xl font-bold text-gray-900">Roving Vietnam Travel</h2>
              <p className="mt-1 text-gray-600">CMS Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Right auth panel */}
        <div className="flex items-center justify-center px-6 py-16">
          <Card className="w-full max-w-md border border-white/60 bg-white/70 shadow-2xl backdrop-blur-xl">
            <div className="p-8">
              <div className="mb-8 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-blue-600/10 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="mt-4 text-2xl font-bold tracking-tight">Đăng nhập CMS</h1>
                <p className="text-sm text-gray-500">Quản lý nội dung website của bạn</p>
              </div>

              {error && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-9 pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <label className="inline-flex items-center gap-2 select-none">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    Ghi nhớ đăng nhập
                  </label>
                  <a className="cursor-pointer text-blue-600 hover:text-blue-700">Quên mật khẩu?</a>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" disabled={isLoading}>
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
                      Đang đăng nhập...
                    </span>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-xs text-gray-500">
                Liên hệ quản trị viên nếu bạn quên mật khẩu.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}



