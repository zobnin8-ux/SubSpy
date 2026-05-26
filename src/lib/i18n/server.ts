import { cookies } from "next/headers";
import { getDictionary, isLocale } from "./index";
import { DEFAULT_LOCALE, LOCALE_COOKIE, type Locale } from "./types";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getServerT() {
  const locale = await getLocale();
  return { locale, t: getDictionary(locale) };
}
