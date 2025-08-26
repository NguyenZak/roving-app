"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
// Province search is handled at the page level; this component only filters packages.

type Duration = { days: number; nights: number };

type PackageItem = {
  title: string;
  image: string;
  duration: Duration;
  slug: string;
  regionKey: "north" | "central" | "south";
};

type PackageGroup = {
  key: "north" | "central" | "south";
  label: string;
  items: PackageItem[];
};

export default function PackagesList({
  locale,
  groups,
}: {
  locale: "vi" | "en";
  groups: { key: PackageGroup["key"]; label: string; items: { title: string; image: string; duration: Duration; slug: string }[] }[];
}) {
  const [region, setRegion] = useState<"all" | PackageGroup["key"]>("all");
  const [duration, setDuration] = useState<"all" | "3-2" | "4-3" | "5-4" | ">=6">("all");
  const [query, setQuery] = useState("");

  const normalizedGroups: PackageGroup[] = useMemo(
    () =>
      groups.map((g) => ({
        key: g.key,
        label: g.label,
        items: g.items.map((i) => ({ ...i, regionKey: g.key } as PackageItem)),
      })),
    [groups]
  );

  const filteredGroups = useMemo(() => {
    const matchDuration = (d: Duration) => {
      if (duration === "all") return true;
      if (duration === ">=6") return d.days >= 6;
      const [days, nights] = duration.split("-").map((v) => parseInt(v, 10));
      return d.days === days && d.nights === nights;
    };

    const q = query.trim().toLowerCase();
    return normalizedGroups
      .filter((g) => (region === "all" ? true : g.key === region))
      .map((g) => ({
        ...g,
        items: g.items.filter((i) => matchDuration(i.duration) && (q === "" || i.title.toLowerCase().includes(q))),
      }));
  }, [normalizedGroups, region, duration, query]);

  // Province matches are not shown here; handled by the page using the navbar query.

  function renderHighlighted(text: string) {
    const q = query.trim();
    if (!q) return text;
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, idx) =>
      idx % 2 === 1 ? (
        <mark key={idx} className="bg-yellow-200 rounded px-0.5 text-inherit">
          {part}
        </mark>
      ) : (
        <span key={idx}>{part}</span>
      )
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[220px]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={locale === "vi" ? "Tìm gói..." : "Search packages..."}
            className="w-full border rounded-md px-3 py-2 text-sm bg-background"
            aria-label={locale === "vi" ? "Tìm kiếm gói" : "Search packages"}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground min-w-20">{locale === "vi" ? "Khu vực" : "Region"}</label>
          <select
            className="border rounded-md px-3 py-2 text-sm bg-background"
            value={region}
            onChange={(e) => setRegion((e.target.value as "all" | PackageGroup["key"]))}
          >
            <option value="all">{locale === "vi" ? "Tất cả" : "All"}</option>
            <option value="north">{locale === "vi" ? "Miền Bắc" : "North"}</option>
            <option value="central">{locale === "vi" ? "Miền Trung" : "Central"}</option>
            <option value="south">{locale === "vi" ? "Miền Nam" : "South"}</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground min-w-20">{locale === "vi" ? "Thời lượng" : "Duration"}</label>
          <select
            className="border rounded-md px-3 py-2 text-sm bg-background"
            value={duration}
            onChange={(e) => setDuration((e.target.value as "all" | "3-2" | "4-3" | "5-4" | ">=6"))}
          >
            <option value="all">{locale === "vi" ? "Tất cả" : "All"}</option>
            <option value="3-2">3N2Đ</option>
            <option value="4-3">4N3Đ</option>
            <option value="5-4">5N4Đ</option>
            <option value=">=6">{locale === "vi" ? ">= 6N" : ">= 6 days"}</option>
          </select>
        </div>
      </div>

      {/* Province cards removed from here */}

      {filteredGroups.map((g) => (
        <section key={g.key}>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">{g.label}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {g.items.map((pkg) => (
              <div key={`${g.key}-${pkg.slug}`} className="group border rounded-lg overflow-hidden">
                <div className="relative h-40">
                  <Image src={pkg.image} alt={pkg.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="p-4 space-y-2">
                  <div className="font-semibold">{renderHighlighted(pkg.title)}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-between">
                    <span>{locale === "vi" ? "Giá: Liên hệ" : "Price: Contact"}</span>
                    <span>
                      {pkg.duration.days}N{pkg.duration.nights}Đ
                    </span>
                  </div>
                  <div className="pt-2">
                    <Button asChild size="sm">
                      <Link href={`/regions/packages/${pkg.slug}`}>{locale === "vi" ? "Xem chi tiết" : "View details"}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}


