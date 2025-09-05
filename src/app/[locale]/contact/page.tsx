import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import ContactForm from "@/components/site/ContactForm";
import { getTranslations } from "next-intl/server";

export default async function ContactPage() {
  const t = await getTranslations("contact");
  return (
    <>
      <Navbar />
      <main className="py-12">
        <div className="mx-auto max-w-[1440px] px-6">
          <h1 className="text-2xl md:text-3xl font-bold">{t("title")}</h1>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact Roving Vietnam Travel"
      })}} />
    </>
  );
}


