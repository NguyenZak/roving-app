"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LanguageSwitch() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Select
      value={locale}
      onValueChange={(value: "vi" | "en") => router.replace({ pathname }, { locale: value })}
    >
      <SelectTrigger className="w-[110px]">
        <SelectValue>
          <div className="flex items-center gap-2">
            <span>{locale === "vi" ? "🇻🇳" : "🇺🇸"}</span>
            <span className="uppercase">{locale}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="vi">
          <div className="flex items-center gap-2">
            <span>🇻🇳</span>
            <span>Vi</span>
          </div>
        </SelectItem>
        <SelectItem value="en">
          <div className="flex items-center gap-2">
            <span>🇺🇸</span>
            <span>En</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}


