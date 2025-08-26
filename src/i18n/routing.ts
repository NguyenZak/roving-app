import { createNavigation } from "next-intl/navigation";

export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as Locale) || "vi";
export const localePrefix = "always" as const;

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  localePrefix,
});


