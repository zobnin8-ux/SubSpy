import { en } from "./en";
import { ru } from "./ru";
import type { Dictionary, Locale } from "./types";
import { DEFAULT_LOCALE } from "./types";

export { DEFAULT_LOCALE, LOCALE_COOKIE } from "./types";
export type { Dictionary, Locale };

const dictionaries: Record<Locale, Dictionary> = { en, ru };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "ru";
}

/** Replace `{key}` placeholders in a string. */
export function fmt(
  template: string,
  vars: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(vars[key] ?? "")
  );
}

export function planLabel(
  plan: keyof Dictionary["plan"],
  t: Dictionary
): string {
  return t.plan[plan] ?? plan;
}
