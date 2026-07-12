import { tr } from "./tr.js";
import { en } from "./en.js";

export const DICTS = { tr, en };

export function resolveLanguage(setting) {
  if (setting === "tr" || setting === "en") return setting;
  const device = (typeof navigator !== "undefined" && navigator.language) || "";
  return device.toLowerCase().startsWith("tr") ? "tr" : "en";
}

/**
 * Builds the translate function used across the app:
 *   t("today.title")            → UI string (falls back to TR, then the key)
 *   t("quick.count", { n: 3 })  → "{n}" placeholders replaced
 *   t.lang / t.locale           → "tr" | "en" / "tr-TR" | "en-US"
 *   t.task(scopedId, fallback)  → content lookup; room tasks use "roomId:taskId"
 *   t.room(roomId, fallback), t.quick(index, fallback)
 */
export function makeTranslator(language) {
  const lang = resolveLanguage(language);
  const dict = DICTS[lang] || tr;

  const translate = (key, vars) => {
    let text = dict.ui[key] ?? tr.ui[key] ?? key;
    if (vars) {
      for (const [name, value] of Object.entries(vars)) {
        text = text.replaceAll(`{${name}}`, String(value));
      }
    }
    return text;
  };

  return Object.assign(translate, {
    lang,
    locale: lang === "tr" ? "tr-TR" : "en-US",
    task: (scopedId, fallback) => dict.tasks[scopedId] ?? fallback,
    room: (roomId, fallback) => dict.rooms[roomId] ?? fallback,
    quick: (index, fallback) => dict.quick[index] ?? fallback,
  });
}
