import { getRequestConfig, type GetRequestConfigParams } from "next-intl/server";

export default getRequestConfig(async ({ locale }: GetRequestConfigParams) => {
  const lang = locale ?? "en";
  return {
    locale: lang,
    messages: (await import(`@/messages/${lang}.json`)).default,
  };
});


