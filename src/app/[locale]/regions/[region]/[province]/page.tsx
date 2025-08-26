import type { Metadata } from "next";
import Image from "next/image";
import Footer from "@/components/site/Footer";
import Navbar from "@/components/site/Navbar";
import { Link } from "@/i18n/routing";
import { tours } from "@/lib/sampleData";
import { slugify } from "@/lib/regions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Params = { params: { locale: string; region: string; province: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return {
    title: `${params.province.replace(/-/g, " ")}`,
  };
}

export default function ProvincePage({ params }: Params) {
  const pretty = params.province.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  const provinceSlug = params.province;
  const normalizeSlug = (s: string) =>
    s
      .replace(/-(province|city)$/i, "")
      .replace(/^thanh-pho-/i, "")
      .replace(/^tinh-/i, "");
  const normalizedProvinceSlug = normalizeSlug(provinceSlug);
  const provinceTours = tours.filter((t) => {
    const loc = (t.location || "").split(",")[0];
    const locSlug = slugify(loc);
    return normalizeSlug(locSlug) === normalizedProvinceSlug;
  });
  return (
    <>
      <Navbar />
      <main className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-4xl md:text-5xl font-fs-playlist mb-6">{pretty}</h1>
          <p className="text-muted-foreground mb-8">{provinceTours.length > 0 ? ("") : (<>Hiện chưa có tour cho {pretty}. Vui lòng quay lại sau.</>)}</p>
          {provinceTours.length > 0 && (
            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">{params.locale === 'vi' ? 'Các tour tại' : 'Tours in'} {pretty}</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {provinceTours.map((tour) => (
                  <Card key={tour.slug} className="group overflow-hidden border rounded-lg">
                    <Link href={`/tours/${tour.slug}`} className="relative h-40 block">
                      <Image src={tour.image} alt={tour.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    </Link>
                    <div className="p-4 space-y-2">
                      <div className="font-semibold">{tour.title}</div>
                      <div className="text-sm text-muted-foreground">{tour.location}</div>
                      <div className="text-sm">{params.locale === 'vi' ? `Giá: $${tour.price}` : `Price: $${tour.price}`}</div>
                      <div className="pt-2">
                        <Button asChild size="sm">
                          <Link href={`/tours/${tour.slug}`}>{params.locale === 'vi' ? 'Xem chi tiết' : 'View details'}</Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}


