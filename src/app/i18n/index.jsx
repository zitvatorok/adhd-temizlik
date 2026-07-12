import { useMemo } from "react";
import { I18nContext } from "./context.js";
import { makeTranslator } from "./translator.js";

export function I18nProvider({ language, children }) {
  const translator = useMemo(() => makeTranslator(language), [language]);
  return <I18nContext.Provider value={translator}>{children}</I18nContext.Provider>;
}
