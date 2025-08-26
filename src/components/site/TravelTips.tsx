"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CreditCard, Wifi, Shield, Landmark, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";

const tips = [
  {
    title: "Best Time to Visit",
    content: "North: Oct–Apr, Central: Feb–Aug, South: Nov–Apr.",
    icon: Calendar,
  },
  {
    title: "Currency & Payments",
    content: "VND is common; cards accepted in cities. Carry small cash.",
    icon: CreditCard,
  },
  {
    title: "Connectivity",
    content: "Buy a local eSIM/SIM for reliable 4G and cheaper data.",
    icon: Wifi,
  },
  {
    title: "Safety & Health",
    content: "Use sunscreen, stay hydrated, and beware of traffic when crossing.",
    icon: Shield,
  },
  {
    title: "Local Etiquette",
    content: "Dress modestly at temples, remove shoes when required.",
    icon: Landmark,
  },
  {
    title: "Transport Apps",
    content: "Grab and Be are great for cabs and food delivery.",
    icon: Smartphone,
  },
];

export default function TravelTips() {
  const t = useTranslations("tips");
  return (
    <section id="travel-tips" className="py-16 bg-muted/40 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">{t("title")}</h2>
        <p className="text-muted-foreground text-center mb-8">{t("desc")}</p>
        <div className="grid md:grid-cols-3 gap-4">
          {tips.map((tip) => {
            const Icon = tip.icon;
            return (
              <Card key={tip.title} className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" aria-hidden />
                    <CardTitle className="text-lg">{tip.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  {tip.content}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}


