"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function AuthButtons() {
  const { data } = useSession();
  if (data?.user) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-sm">{data.user.name || data.user.email}</div>
        <Button variant="outline" onClick={() => signOut()}>Sign out</Button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" onClick={() => signIn("google")}>Google</Button>
      <Button onClick={() => signIn()}>Sign in</Button>
    </div>
  );
}


