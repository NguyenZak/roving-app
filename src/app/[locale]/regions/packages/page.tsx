import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { getPackageGroups } from "@/lib/regions";
import PackagesList from "@/components/site/PackagesList";

type Params = { params: { locale: "vi" | "en" } };

export const metadata: Metadata = {
  title: "Packages",
};

export default function PackagesPage({ params }: Params) {
  const groups = getPackageGroups(params.locale);
  return (
    <>
      <Navbar />
      <main className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">{params.locale === 'vi' ? 'Gói theo khu vực' : 'Packages by Region'}</h1>
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


