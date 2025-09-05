import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { getPackageGroups } from "@/lib/regions";
import PackagesList from "@/components/site/PackagesList";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getProvincesForRegion, getProvinceDisplayName, slugify } from "@/lib/regions";
// Removed framer-motion to keep this server component pure
import { MapPin, Star, Compass, Package } from "lucide-react";

type Params = { params: { locale: "vi" | "en" }; searchParams?: { q?: string } };

export const metadata: Metadata = {
  title: "Travel Packages by Region - Roving Vietnam Travel",
  description: "Discover amazing travel packages across Northern, Central, and Southern Vietnam. Find your perfect adventure today.",
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
      <main className="py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="mx-auto max-w-[1440px] px-6">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Package className="h-4 w-4" />
              Travel Packages
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {params.locale === 'vi' ? 'Gói Du Lịch Theo Khu Vực' : 'Travel Packages by Region'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {params.locale === 'vi' 
                ? 'Khám phá những gói du lịch tuyệt vời tại miền Bắc, miền Trung và miền Nam Việt Nam'
                : 'Discover amazing travel packages across Northern, Central, and Southern Vietnam'
              }
            </p>
          </div>

          {/* Province Matches Section */}
          {q.trim() !== "" && provinceMatches.length > 0 && (
            <section className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {params.locale === 'vi' ? 'Tỉnh/Thành Phù Hợp' : 'Matching Provinces'}
                </h2>
                <p className="text-gray-600">
                  {params.locale === 'vi' 
                    ? `Tìm thấy ${provinceMatches.length} tỉnh/thành phù hợp với "${q}"`
                    : `Found ${provinceMatches.length} provinces matching "${q}"`
                  }
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {provinceMatches.map((m, index) => (
                  <div key={`${m.region}-${m.slug}`} className="group">
                    <Link href={`/regions/${m.region}/${m.slug}`} className="block">
                      <div className="relative h-48 md:h-56 overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm">
                        <Image 
                          src={m.image} 
                          alt={m.alt} 
                          fill 
                          className="object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        
                        {/* Region Badge */}
                        <div className="absolute top-4 left-4">
                          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                            <MapPin className="h-3 w-3 text-blue-600" />
                            {m.region === 'north' ? 'Miền Bắc' : m.region === 'central' ? 'Miền Trung' : 'Miền Nam'}
                          </div>
                        </div>
                        
                        {/* Province Name */}
                        <div className="absolute inset-0 flex items-end p-4">
                          <div className="text-center w-full">
                            <span className="text-white drop-shadow-2xl text-xl md:text-2xl font-bold leading-tight block">
                              {m.name}
                            </span>
                            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full border border-white/30">
                                Click to explore →
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Packages List */}
          <div>
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

          {/* Call to Action */}
          <div className="text-center mt-20">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {params.locale === 'vi' ? 'Sẵn sàng khám phá Việt Nam?' : 'Ready to Explore Vietnam?'}
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                {params.locale === 'vi'
                  ? 'Liên hệ với chúng tôi để được tư vấn và đặt gói du lịch phù hợp nhất'
                  : 'Contact us for personalized travel advice and to book your perfect package'
                }
              </p>
              <Link 
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-full font-medium hover:bg-blue-50 transition-colors duration-200"
              >
                <Compass className="h-5 w-5" />
                {params.locale === 'vi' ? 'Liên hệ ngay' : 'Contact Us'}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


