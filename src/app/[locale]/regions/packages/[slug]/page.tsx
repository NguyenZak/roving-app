import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

type Params = { params: { locale: string; slug: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return {
    title: decodeURIComponent(params.slug).replace(/-/g, " "),
  };
}

export default function PackageDetailPage({ params }: Params) {
  const title = decodeURIComponent(params.slug).replace(/-/g, " ");
  return (
    <>
      <Navbar />
      <main className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-2xl md:text-3xl text-center font-bold mb-6">{title}</h1>
          <p className="text-muted-foreground">Nội dung chi tiết cho gói: {title} sẽ được bổ sung sau.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}


