import type { Metadata } from "next";
import Hero from "@/components/site/Hero";
import AboutSection from "@/components/site/About";
import { InstagramSection } from "@/components/site/HomeSections";
import MustSee from "@/components/site/MustSee";
import LiveFully from "@/components/site/LiveFully";

import TravelTips from "@/components/site/TravelTips";
import ContactForm from "@/components/site/ContactForm";
import Footer from "@/components/site/Footer";
import Testimonials from "@/components/site/Testimonials";

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
        <MustSee />
        <TravelTips />
        <Testimonials />
        <InstagramSection />
        <section id="contact" className="py-16 scroll-mt-16">
          <div className="mx-auto max-w-[1440px] px-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Contact Us</h2>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}


