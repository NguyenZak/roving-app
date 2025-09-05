"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SupportPage() {
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Support</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Help & Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Coming soon: Documentation, FAQs, and support contact.</div>
        </CardContent>
      </Card>
    </div>
  );
}


