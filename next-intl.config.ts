const intlConfig = {
  locales: ["vi", "en"],
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "vi",
  localePrefix: "always" as const,
};

export default intlConfig;


