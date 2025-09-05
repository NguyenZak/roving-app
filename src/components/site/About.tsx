"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function AboutSection() {
  const t = useTranslations("about");
  return (
    <section id="about" className="py-16 scroll-mt-16">
      <div className="mx-auto max-w-[1440px] px-6 grid md:grid-cols-2 gap-8 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <Image src="/next.svg" alt="About Roving Vietnam Travel" width={640} height={400} className="rounded-lg border" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
          <h2 className="text-2xl md:text-3xl font-bold">{t("title")}</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {t("descShort")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}


