import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { STORAGE_KEY } from "../../state.js";

/* iOS, WKWebView localStorage'ını yer açmak için silebilir. Native'de kalıcılık
   Capacitor Preferences'a (UserDefaults) taşınır: açılışta async hydrate, sonra
   bellekte senkron cache + her yazımda write-through. Web'de localStorage kalır. */

let cache = null;
/* Okuma başarısızsa Preferences'taki veri hâlâ yerinde olabilir; o durumda
   yazmayı keserek varsayılan state'in gerçek veriyi ezmesini önlüyoruz. */
let hydrationFailed = false;

export async function initStorage() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { value } = await Preferences.get({ key: STORAGE_KEY });
    if (value == null) {
      const legacy = window.localStorage.getItem(STORAGE_KEY);
      if (legacy != null) {
        await Preferences.set({ key: STORAGE_KEY, value: legacy });
      }
      cache = legacy;
    } else {
      cache = value;
    }
  } catch {
    cache = null;
    hydrationFailed = true;
  }
}

export function getStorageLike() {
  if (!Capacitor.isNativePlatform()) return window.localStorage;

  return {
    getItem: () => cache,
    setItem: (_key, value) => {
      cache = value;
      if (hydrationFailed) return;
      Preferences.set({ key: STORAGE_KEY, value }).catch(() => {});
    },
    removeItem: () => {
      cache = null;
      if (hydrationFailed) return;
      Preferences.remove({ key: STORAGE_KEY }).catch(() => {});
    },
  };
}
