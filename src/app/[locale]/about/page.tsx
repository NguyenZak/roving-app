import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function AboutPage() {
  const t = await getTranslations("about");
  return (
    <>
      <Navbar />
      <main className="py-12">
        <div className="mx-auto max-w-5xl px-4 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{t("title")}</h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">{t("desc")}</p>
          </div>
          <div className="relative h-72">
            <Image src="/window.svg" alt="About Fresh Travel" fill className="object-cover rounded-lg border" />
          </div>
        </div>
      </main>
      <Footer />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Fresh Travel",
        url: "https://www.fresh-travel.example"
      })}} />
    </>
  );
}


