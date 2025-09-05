"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await signIn("credentials", { email, password, redirect: true, callbackUrl: "/admin" });
    setLoading(false);
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3 border rounded-md p-4">
        <h1 className="text-xl font-semibold text-center">Login</h1>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        </div>
        <button type="submit" disabled={isLoading} className="w-full px-4 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50">
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}



