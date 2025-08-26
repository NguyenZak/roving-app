import type { Metadata } from "next";
import Image from "next/image";
import Footer from "@/components/site/Footer";
import Navbar from "@/components/site/Navbar";

type Params = { params: { locale: string; region: string; province: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return {
    title: `${params.province.replace(/-/g, " ")}`,
  };
}

export default function ProvincePage({ params }: Params) {
  const pretty = params.province.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  return (
    <>
      <Navbar />
      <main className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-4xl md:text-5xl font-fs-playlist mb-6">{pretty}</h1>
          <p className="text-muted-foreground mb-8">Nội dung chi tiết cho {pretty} sẽ hiển thị tại đây.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative h-64 rounded-lg overflow-hidden border">
              <Image src="https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop" alt={pretty} fill className="object-cover" />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden border">
              <Image src="https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1200&auto=format&fit=crop" alt={pretty} fill className="object-cover" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


