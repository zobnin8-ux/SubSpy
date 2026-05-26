import type { en } from "./en";

export type Locale = "en" | "ru";

type NestedStrings<T> = {
  [K in keyof T]: T[K] extends string ? string : NestedStrings<T[K]>;
};

export type Dictionary = NestedStrings<typeof en>;

export const LOCALE_COOKIE = "subspy-locale";
export const DEFAULT_LOCALE: Locale = "en";
