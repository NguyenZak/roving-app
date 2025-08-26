import { getRequestConfig, type GetRequestConfigParams } from "next-intl/server";

export default getRequestConfig(async ({ locale }: GetRequestConfigParams) => {
  const lang = locale ?? (process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "vi");
  return {
    locale: lang,
    messages: (await import(`@/messages/${lang}.json`)).default,
  };
});


