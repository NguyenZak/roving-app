import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { getPackageGroups } from "@/lib/regions";
import PackagesList from "@/components/site/PackagesList";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getProvincesForRegion, getProvinceDisplayName, slugify } from "@/lib/regions";

type Params = { params: { locale: "vi" | "en" }; searchParams?: { q?: string } };

export const metadata: Metadata = {
  title: "Packages",
};

export default function PackagesPage({ params, searchParams }: Params) {
  const groups = getPackageGroups(params.locale);
  const q = (searchParams?.q ?? "").toString();
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const nq = norm(q);
  const provinceMatches = q
    ? (["north", "central", "south"] as const).flatMap((key) =>
        getProvincesForRegion(key).map((p) => {
          const name = getProvinceDisplayName(params.locale, p);
          return { region: key, name, slug: slugify(name), image: p.image, alt: p.alt, match: norm(name).includes(nq) };
        })
      ).filter((p) => p.match)
    : [];
  return (
    <>
      <Navbar />
      <main className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">{params.locale === 'vi' ? 'Gói theo khu vực' : 'Packages by Region'}</h1>
          {q.trim() !== "" && provinceMatches.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">{params.locale === 'vi' ? 'Tỉnh/Thành phù hợp' : 'Matching provinces'}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {provinceMatches.map((m) => (
                  <Link key={`${m.region}-${m.slug}`} href={`/regions/${m.region}/${m.slug}`} className="block group">
                    <div className="relative h-36 md:h-48 overflow-hidden rounded-lg border">
                      <Image src={m.image} alt={m.alt} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/25" />
                      <div className="absolute inset-0 flex items-center justify-center p-3 text-center">
                        <span className="text-white drop-shadow-md font-fs-playlist text-2xl md:text-3xl">{m.name}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
          <PackagesList
            locale={params.locale}
            groups={groups.map((g) => ({
              key: g.key,
              label: g.label,
              items: g.items.map((p) => ({
                title: (params.locale === 'vi' ? p.titleVi : p.titleEn),
                image: p.image,
                duration: p.duration,
                slug: encodeURIComponent((params.locale === 'vi' ? p.titleVi : p.titleEn).toLowerCase().replace(/\s+/g, '-')),
              })),
            }))}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}


