import type { Metadata } from "next";
import Hero from "@/components/site/Hero";
import { AboutSection, MustSeeSection, InstagramSection } from "@/components/site/HomeSections";
import LiveFully from "@/components/site/LiveFully";
import ContactForm from "@/components/site/ContactForm";
import Footer from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "Discover Vietnam – Live Fully in Every Journey",
};

export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <AboutSection />
        <LiveFully />
        <MustSeeSection />
        <InstagramSection />
        <section id="contact" className="py-16 scroll-mt-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Contact Us</h2>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}


