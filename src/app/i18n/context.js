import { createContext } from "react";
import { makeTranslator } from "./translator.js";

export const I18nContext = createContext(makeTranslator("tr"));
