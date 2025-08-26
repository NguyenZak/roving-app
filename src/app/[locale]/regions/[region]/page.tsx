import type { Metadata } from "next";
import Image from "next/image";
import Footer from "@/components/site/Footer";
import Navbar from "@/components/site/Navbar";
import { Link } from "@/i18n/routing";
import { getRegionLabel, getProvincesForRegion, getProvinceDisplayName, slugify, type RegionKey, type LocaleOption } from "@/lib/regions";

type Params = { params: { locale: string; region: "north" | "central" | "south" | "packages" } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const titleMap = {
    north: getRegionLabel(params.locale as LocaleOption, "north"),
    central: getRegionLabel(params.locale as LocaleOption, "central"),
    south: getRegionLabel(params.locale as LocaleOption, "south"),
    packages: getRegionLabel(params.locale as LocaleOption, "packages"),
  } as Record<string, string>;
  return {
    title: titleMap[params.region] ?? (params.locale === "vi" ? "Khu vực" : "Region"),
  };
}

export default function RegionPage({ params }: Params) {
  const regionKey = params.region as RegionKey;
  const list = getProvincesForRegion(regionKey);
  const heading = getRegionLabel(params.locale as LocaleOption, regionKey);
  return (
    <>
      <Navbar />
      <main className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-8">{heading}</h1>
          {regionKey === 'packages' && (
            <p className="mb-6 text-muted-foreground">{params.locale === 'vi' ? 'Chọn gói theo 3 khu vực: Miền Bắc, Miền Trung, Miền Nam.' : 'Choose packages by North, Central, South.'}</p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {list.map((p) => {
              const display = getProvinceDisplayName(params.locale as LocaleOption, p);
              const slug = slugify(display);
              return (
                <Link key={display} href={`/regions/${params.region}/${slug}`} className="block group">
                  <div className="relative h-40 md:h-48 overflow-hidden rounded-lg border">
                    <Image src={p.image} alt={p.alt} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width:768px) 50vw, 25vw" />
                    <div className="absolute inset-x-0 bottom-0 bg-black/40 text-white px-3 py-2 text-sm md:text-base">{display}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


