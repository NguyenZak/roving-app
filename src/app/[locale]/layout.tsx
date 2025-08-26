import type { Metadata } from "next";
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata(): Metadata {
  return {
    alternates: {
      languages: {
        en: "/en",
        vi: "/vi",
      },
    },
  };
}

type Params = { locale: string } | Promise<{ locale: string }>;

function isThenable(value: unknown): value is Promise<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "then" in (value as Record<string, unknown>) &&
    typeof (value as Record<string, unknown>).then === "function"
  );
}

export default async function LocaleLayout(props: { params: Params; children: ReactNode }) {
  const maybe = props.params as unknown;
  let localeStr: string;
  if (isThenable(maybe)) {
    const resolved = (await maybe) as { locale: string };
    localeStr = resolved.locale;
  } else {
    localeStr = (maybe as { locale: string }).locale;
  }
  const locale = localeStr as Locale;
  if (!locales.includes(locale)) notFound();
  const messages = (await import(`@/messages/${locale}.json`)).default;
  return <NextIntlClientProvider locale={locale} messages={messages}>{props.children}</NextIntlClientProvider>;
}


