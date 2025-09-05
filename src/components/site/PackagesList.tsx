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
  const [sortBy, setSortBy] = useState<"name" | "duration">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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
    let filtered = normalizedGroups
      .filter((g) => (region === "all" ? true : g.key === region))
      .map((g) => ({
        ...g,
        items: g.items.filter((i) => matchDuration(i.duration) && (q === "" || i.title.toLowerCase().includes(q))),
      }));

    // Sort items within each group
    filtered = filtered.map(group => ({
      ...group,
      items: [...group.items].sort((a, b) => {
        if (sortBy === "name") {
          const aTitle = a.title.toLowerCase();
          const bTitle = b.title.toLowerCase();
          return sortOrder === "asc" ? aTitle.localeCompare(bTitle) : bTitle.localeCompare(aTitle);
        } else {
          const aDays = a.duration.days;
          const bDays = b.duration.days;
          return sortOrder === "asc" ? aDays - bDays : bDays - aDays;
        }
      })
    }));

    return filtered;
  }, [normalizedGroups, region, duration, query, sortBy, sortOrder]);

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
      {/* Enhanced Filter Controls */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {locale === "vi" ? "Tìm kiếm" : "Search"}
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={locale === "vi" ? "Tìm gói du lịch..." : "Search travel packages..."}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              aria-label={locale === "vi" ? "Tìm kiếm gói" : "Search packages"}
            />
          </div>
          
          {/* Region Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {locale === "vi" ? "Khu vực" : "Region"}
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={region}
              onChange={(e) => setRegion((e.target.value as "all" | PackageGroup["key"]))}
          >
            <option value="all">{locale === "vi" ? "Tất cả" : "All"}</option>
            <option value="north">{locale === "vi" ? "Miền Bắc" : "North"}</option>
            <option value="central">{locale === "vi" ? "Miền Trung" : "Central"}</option>
            <option value="south">{locale === "vi" ? "Miền Nam" : "South"}</option>
          </select>
        </div>
          {/* Duration Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {locale === "vi" ? "Thời lượng" : "Duration"}
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
          
          {/* Sort Controls */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {locale === "vi" ? "Sắp xếp" : "Sort"}
            </label>
            <div className="flex gap-2">
              <select
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "duration")}
              >
                <option value="name">{locale === "vi" ? "Tên" : "Name"}</option>
                <option value="duration">{locale === "vi" ? "Thời lượng" : "Duration"}</option>
              </select>
              <button
                type="button"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200"
                title={locale === "vi" ? "Đảo ngược thứ tự" : "Reverse order"}
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
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


