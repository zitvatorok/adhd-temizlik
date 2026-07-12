# Piling Up iOS App Store Sürümü — Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline)
> to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Onaylı "sıcak editoryal" tasarımla, Capacitor tabanlı, TR+EN, App Store'a
gönderilmeye hazır Piling Up 1.0.

**Architecture:** Mevcut `state.js`/`data.js` çekirdeği dokunulmadan korunur; UI katmanı
`src/app/` altında modülerleştirilir ve mockup'taki tasarım sistemine geçirilir; Capacitor
kabuğu + native katman (haptik, bildirim, Preferences) en sona eklenir.

**Tech Stack:** React 19, Vite 7, Capacitor 7 (+ preferences, haptics, status-bar,
splash-screen, local-notifications), Fraunces variable font (repoda), vanilla CSS.

**Spec:** `docs/superpowers/specs/2026-07-12-appstore-ios-redesign-design.md`
**Görsel referans:** `docs/design/mockup.html` — ekran/bileşen CSS'i buradan birebir alınır.

## Global Kısıtlar

- `state.js`, `data.js`, `state.test.js` **davranışsal olarak değişmez**; test dosyası hiç değişmez.
- Her görev sonunda üçlü kontrol yeşil: `npm run lint` · `node src/state.test.js` · `npm run build`.
- Dosya başına 200–400 satır hedefi, 800 üstü yasak.
- Palet/tipografi değerleri spec §4'teki tablodan aynen; yeni renk icat edilmez.
- Türkçe büyük harf etiketlerde CSS `text-transform: uppercase` kullanılmaz (İ hatası) —
  metin elle büyük yazılır.
- CDN'den hiçbir kaynak yüklenmez (Google Fonts linkleri kaldırılır).
- Commit'ler Conventional Commits; her görev kendi commit'i.
- localStorage anahtarı mevcut adıyla kalır (mevcut web kullanıcı verisi korunur).

---

### Task 0: Taban çizgisi

**Files:** yok (yalnız doğrulama)

- [ ] `npm run lint && node src/state.test.js && npm run build` → üçü de yeşil olmalı.
      Kırmızıysa ÖNCE düzelt (ayrı commit), plana öyle devam et.
- [ ] `git log --oneline -1` not al (geri dönüş noktası).

### Task 1: Ölü kodu sil

**Files:**
- Delete: `src/components/`, `src/context/`, `src/hooks/`, `src/data/`, `src/utils/`,
  `src/App.css`, `src/index.css`, `src/styles/global.css`, `src/assets/react.svg`
- Modify: `eslint.config.js` (globalIgnores → sadece `['dist']`)

- [ ] Silmeden önce doğrula: `grep -rn "components/\|context/\|hooks/\|data/default\|utils/dopamin\|App.css\|index.css\|styles/global" src/main.jsx src/App.jsx src/state.js src/data.js` → çıktı boş olmalı (2026-07-12'de doğrulandı).
- [ ] Sil + eslint ignore listesini `globalIgnores(['dist'])` yap.
- [ ] Üçlü kontrol + tarayıcıda uygulamanın aynen çalıştığını gör.
- [ ] Commit: `refactor: remove dead legacy modules and assets`

### Task 2: App.jsx'i modülerleştir (görsel değişiklik SIFIR)

**Files:**
- Create: `src/app/shell/AppShell.jsx`, `src/app/shell/useAppState.js`,
  `src/app/lib/taskCards.js`,
  `src/app/views/{TodayView,RoomsView,RoutinesView,FocusView,DopamineView,SettingsView}.jsx`,
  `src/app/components/{TabBar,TopBar,TaskListPanel,PomodoroPanel,ui}.jsx`
- Modify: `src/main.jsx` (import `./app/shell/AppShell.jsx`)
- Delete: `src/App.jsx`

**Interfaces (sonraki görevler bunlara dayanır):**
- `useAppState()` → `{ state, stats, actions }` — actions: mevcut App.jsx'teki setActiveTab,
  setTodayMode, setTimeBudget, setCareMode, setSelectedRoom, setEnergy, toggleRoomTask,
  toggleRoutineTask, setTaskStatus, bindPomodoroToTask, clearToday (imzalar aynen).
- `taskCards.js` exports: `getTaskStatus(task)`, `withTaskStatus(task,status)`,
  `getTaskKey(source,groupId,taskId)`, `updateTaskByKey(state,key,updater)`,
  `inferMinutes(task)`, `inferTags(task,ctx)`, `makeTaskCard(...)`, `getAllTaskCards(state)`,
  `matchesCareMode(card,mode)`, `getRecommendedTasks(state)`, `getTodayTasks(state)` —
  gövdeler App.jsx 97–285. satırlarından aynen taşınır.
- Sabitler (`TABS`, `LEVELS`, `TIME_OPTIONS`, `CARE_MODES`, `TODAY_MODES`, `TAG_LABELS`,
  `STATUS_LABELS`) şimdilik `src/app/constants.js`'e taşınır (Task 3'te i18n'e devrolur).

- [ ] Taşı; class adları ve markup birebir kalsın (styles.css hâlâ geçerli).
- [ ] Üçlü kontrol + tarayıcı smoke: 6 sekme de tıklanıyor, görevler tiklenebiliyor,
      localStorage'daki mevcut state okunuyor.
- [ ] Commit: `refactor: split App.jsx into app/ modules (no visual change)`

### Task 3: i18n altyapısı

**Files:**
- Create: `src/app/i18n/index.jsx`, `src/app/i18n/tr.js`, `src/app/i18n/en.js`
- Modify: tüm view/component'ler (string'ler sözlüğe), `src/app/shell/useAppState.js`
  (`setLanguage` action; `state.ui.language`: `"system" | "tr" | "en"`)

**Interfaces:**
```jsx
// src/app/i18n/index.jsx
export function I18nProvider({ language, children }) {...} // "system"→navigator.language çözümü
export function useT() {
  // t("today.title") → string ; t.task("k-counter", storedTitle) → çeviri yoksa storedTitle
  // t.room("kitchen", storedName) aynı mantık
}
export function resolveLanguage(setting) {...} // "system" → "tr" | "en"
```
- Sözlük şekli: `{ ui: {"today.title": "Bugün", ...}, tasks: {"k-counter": "...", ...}, rooms: {"kitchen": "Mutfak", ...} }`
- `en.js` içerik çevirileri: `data.js`'teki TÜM görev id'leri (8 oda + daily + weekly +
  QUICK_TASKS dizisi index'le) İngilizceye çevrilir. QUICK_TASKS çevirisi dizi sırasına
  göre `quick[i]` anahtarıyla.
- Stored state şeması DEĞİŞMEZ; çeviri yalnız render'da id lookup.

- [ ] Modülü yaz; tr.js önce (mevcut string'ler), en.js tam çeviri.
- [ ] Tüm görünür UI metinlerini `t()`'ye geçir (tarama: `grep -n '"[A-ZÇĞİÖŞÜa-zçğıöşü]' src/app --include=*.jsx -r` ile kalan hardcoded metin avı).
- [ ] Üçlü kontrol + tarayıcıda dil değişimi (geçici olarak Settings'e ham select eklenebilir).
- [ ] Commit: `feat: add lightweight TR/EN i18n with id-based content lookup`

### Task 4: Tasarım sistemi tabanı (tokens + fontlar + kabuk)

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/components.css`,
  `src/app/components/icons.jsx`
- Modify: `index.html` (Google Fonts linklerini SİL; `viewport-fit=cover`;
  `theme-color` #F3EFE4 / dark #1B1812 media'lı iki meta), `src/main.jsx` (yeni css importları)

**İçerik kuralları:**
- `tokens.css`: spec §4 paletinin tamamı `--bg, --surface, --inset, --ink, --ink-soft,
  --ink-mute, --line, --line-2, --moss, --moss-deep, --moss-soft, --clay, --clay-soft,
  --on-moss, --on-clay` olarak; `@media (prefers-color-scheme: dark)` + `[data-theme="dark"]`
  ve `[data-theme="light"]` override'ları (mockup'taki desen).
- `base.css`: @font-face (iki Fraunces dosyası, `font-weight: 300 700`), grain overlay
  (mockup'taki data-URI), tip rolleri (`.t-display, .t-label, .t-num`), reduced-motion bloğu.
- `icons.jsx`: `export function Icon({ name, size=22 })` — path'ler mockup'taki set;
  `gear` yeniden çizilir (çark: dış çember + 6 diş + iç delik, güneşle karışmasın).
- AppShell: `<html>`'e `data-theme` uygular (`state.ui.theme: "system"|"light"|"dark"`,
  `setTheme` action'ı eklenir); SideNav kaldırılır, `TabBar` 5 sekme + Header'a dişli.

- [ ] Üçlü kontrol + tarayıcıda: fontlar yükleniyor (Network'te CDN isteği YOK),
      tema geçişi çalışıyor, 5 sekme + dişli görünüyor.
- [ ] Commit: `feat: design tokens, bundled Fraunces, 5-tab shell with settings gear`

### Task 5: Ekranları tasarıma geçir (mockup birebir referans)

Her alt görev ayrı commit. Class isimleri ve CSS değerleri `docs/design/mockup.html`'den
alınır; ölçüler telefon-330px mockup'tan gerçek 390px'e oranlanmaz — mockup'taki px
değerleri **aynen** kullanılır (zaten gerçek boyut hedefiyle çizildi).

- [ ] **5a Header + Bugün:** tarih etiketi (elle büyük TR/EN), Fraunces başlık, PileMeter
      (3 çubuk), segmented (zaman), chip satırı (bakım modu), mod seçimi, görev satırları:
      `Stamp` bileşeni (todo=kesikli daire, started=dolu nokta, done=kil mühür; dönüş açısı
      `(hash(taskId) % 13) - 7` derece deterministik), noktalı ayraçlar, durum butonları.
      Mühür animasyonu: `transform: scale(0.6)→1.06→1 rotate(...)` ~200ms
      `cubic-bezier(0.34, 1.56, 0.64, 1)`; `@media (prefers-reduced-motion: reduce)` → yok.
      Commit: `feat: today view in warm editorial design with stamp interaction`
- [ ] **5b Odalar:** oda hapları (yatay kaydırmalı), enerji segmented, panel+satırlar,
      seviye etiketi (elle büyük: HAFİF/ORTA/DERİN).
      Commit: `feat: rooms view redesign`
- [ ] **5c Rutinler:** Günlük/Haftalık segmented + liste + son 7 gün (history satırları
      ince bar'la, mockup panel stili). Commit: `feat: routines view redesign`
- [ ] **5d Odak:** faz rozeti, Fraunces sayaç (`font-variation-settings:"opsz" 144`,
      `tabular-nums`), ince ilerleme çubuğu, görev bağlama select'i (yeni stil),
      Duraklat/Sıfırla. Commit: `feat: focus view with editorial timer`
- [ ] **5e Dopamin:** "ZAR ATILDI" etiketi, Fraunces italik görev metni, kil `Bitirdim` +
      hayalet `Değiştir`, mini mühür geçmişi (gün içi sayaç `state`e taşınmaz, mevcut
      lokal davranış korunur). Commit: `feat: dopamine view redesign`
- [ ] **5f Ayarlar:** dişliden açılan tam ekran görünüm (activeTab="settings" korunur,
      TabBar'da görünmez): dil, tema, varsayılan oda, bugünü temizle, gizlilik linki
      (Task 10'daki URL), sürüm satırı. Eski `styles.css` içinde kullanılmayan kural
      kalmayacak şekilde `styles.css` SİLİNİR (tamamı tokens/base/components'e taşınmış
      olmalı). Commit: `feat: settings view; retire legacy stylesheet`
- [ ] Her alt görevde: üçlü kontrol + 390px tarayıcıda açık/koyu + TR/EN ekran kontrolü.

### Task 6: Kalıcılık adaptörü (Preferences)

**Files:**
- Create: `src/app/lib/storage.js`
- Modify: `src/main.jsx` (async bootstrap), `src/app/shell/useAppState.js`

**Interface + çekirdek kod:**
```js
// storage.js — state.js'in beklediği senkron storage-benzeri yüzey
import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";

const KEY = /* mevcut localStorage anahtarı state.js'ten aynen */;
let cache = null;

export async function initStorage() {
  if (!Capacitor.isNativePlatform()) return;               // web: localStorage kalır
  const { value } = await Preferences.get({ key: KEY });
  if (value == null) {
    const legacy = window.localStorage.getItem(KEY);       // tek seferlik migrasyon
    if (legacy != null) await Preferences.set({ key: KEY, value: legacy });
    cache = legacy;
  } else cache = value;
}

export function getStorageLike() {
  if (!Capacitor.isNativePlatform()) return window.localStorage;
  return {
    getItem: () => cache,
    setItem: (_k, v) => { cache = v; Preferences.set({ key: KEY, value: v }); },
    removeItem: () => { cache = null; Preferences.remove({ key: KEY }); },
  };
}
```
- `main.jsx`: `initStorage().then(() => createRoot(...).render(...))`.
- NOT: Bu görev Task 7'deki bağımlılık kurulumundan SONRA da çalışabilir; Capacitor
  paketleri Task 7'de kurulacaksa bu görev Task 7'nin ardına alınabilir — sıra
  uygulayıcıya bırakılmıştır, ikisi aynı oturumda yapılmalıdır.
- [ ] `node src/state.test.js` DEĞİŞMEDEN yeşil; web build çalışıyor (dinamik import
      gerekmiyor çünkü web'de Preferences çağrılmıyor ama paket bundle'a girer — sorun değil).
- [ ] Commit: `feat: durable storage adapter with Preferences migration`

### Task 7: Capacitor kabuğu

- [ ] `npm i @capacitor/core @capacitor/cli @capacitor/ios @capacitor/preferences @capacitor/haptics @capacitor/status-bar @capacitor/splash-screen @capacitor/local-notifications @capacitor/app`
- [ ] `npx cap init "Piling Up" com.dilarayabul.pilingup --web-dir dist`
- [ ] `capacitor.config.ts`: splash `backgroundColor:"#F3EFE4"`, `launchAutoHide:false`
      (AppShell mount'ta `SplashScreen.hide()`); iOS `contentInset:"never"`.
- [ ] Safe-area: `base.css`'e `padding-top: env(safe-area-inset-top)` (header) ve
      TabBar'a `padding-bottom: calc(9px + env(safe-area-inset-bottom))`.
- [ ] `src/app/native/haptics.js`: `stampTap()` → `Haptics.impact({style:"light"})`,
      `dayComplete()` → `Haptics.notification({type:"success"})`; web'de try/catch no-op.
      Stamp onClick + 3/3 anına bağla.
- [ ] StatusBar: tema değişiminde `StatusBar.setStyle` (dark tema → Style.Dark).
- [ ] `npm run build && npx cap add ios && npx cap sync ios` — CocoaPods hatasında:
      önce `npx cap add ios --packagemanager SPM` dene; o da olmazsa README'ye
      `brew install cocoapods` talimatı yaz ve kullanıcıya bırak.
- [ ] `ios/` git'e eklenir. Üçlü kontrol. Commit: `feat: capacitor ios shell with native layer`

### Task 8: Günlük hatırlatma bildirimi

**Files:**
- Create: `src/app/native/notifications.js`
- Modify: `SettingsView.jsx`, `useAppState.js` (`state.ui.reminder = { enabled:false, hour:19, minute:0 }`)

```js
// notifications.js arayüzü
export async function syncReminder(reminder, t) {
  // enabled=false → cancel(id:1); true → izin iste, izin yoksa false döndür (UI toggle'ı geri alır)
  // LocalNotifications.schedule({ notifications: [{ id:1, title:t("reminder.title"),
  //   body:t("reminder.body"), schedule:{ on:{ hour, minute }, repeats:true } }] })
}
export function isNotificationSupported() // Capacitor.isNativePlatform()
```
- [ ] Settings: toggle + saat seçici (native `<input type="time">`, iOS'ta yerel picker);
      web'de bu blok gizli (`isNotificationSupported()`).
- [ ] Metinler tr/en sözlüğe: ör. TR başlık "Bugünün 3 adımından biri?", gövde
      "5 dakikan var mı? Küçük bir mühür at."
- [ ] Üçlü kontrol; native test kullanıcı Xcode'unda. Commit: `feat: optional daily reminder notification`

### Task 9: Uygulama ikonu + splash + PWA görselleri

**Files:**
- Create: `assets/icon.svg` (1024 viewBox; mockup'taki kompozisyonun temiz yeniden çizimi),
  `assets/splash.svg` (2732², kâğıt zemin + ortada ikon küçük), `scripts/render-assets.mjs`
- Modify: `public/` ikonları, `public/manifest.webmanifest` (theme #F3EFE4), `index.html` favicon

- [ ] `npm i -D sharp @capacitor/assets`; script: sharp ile svg→png (icon-1024, splash-2732,
      icon-192/512, apple-touch-icon-180).
- [ ] `npx @capacitor/assets generate --ios --assetPath assets` (üretilenler ios/'a).
- [ ] Görsel kontrol: 1024 png'yi tarayıcıda aç, 48px'e küçültülmüş halini de bak
      (mühür hâlâ okunuyor mu). Commit: `feat: brand icon, splash and PWA assets`

### Task 10: Mağaza paketi + gizlilik + dokümantasyon

**Files:**
- Create: `public/privacy.html` (TR üstte, EN altta; veri cihazda, üçüncü taraf yok,
  bildirim izni yalnız hatırlatma için), `store/metadata.md`,
  `ios/App/App/PrivacyInfo.xcprivacy`
- Modify: `ios/App/App/Info.plist` (`CFBundleDisplayName` Piling Up,
  `ITSAppUsesNonExemptEncryption` false), `README.md` (tam yeniden yazım: geliştirme,
  build, iOS yayın adımları, kullanıcı yapılacakları), `vercel.json` (privacy.html no-store gerekmez; dokunma)

**PrivacyInfo.xcprivacy içeriği:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>NSPrivacyTracking</key><false/>
  <key>NSPrivacyTrackingDomains</key><array/>
  <key>NSPrivacyCollectedDataTypes</key><array/>
  <key>NSPrivacyAccessedAPITypes</key><array>
    <dict>
      <key>NSPrivacyAccessedAPIType</key><string>NSPrivacyAccessedAPICategoryUserDefaults</string>
      <key>NSPrivacyAccessedAPITypeReasons</key><array><string>CA92.1</string></array>
    </dict>
  </array>
</dict></plist>
```
- `store/metadata.md`: TR+EN ad ("Piling Up"), alt başlık (TR "Küçük adımlarla ev düzeni" /
  EN "Tidy home in tiny steps"), tam açıklamalar, anahtar kelimeler (adhd, temizlik, ev,
  rutin, odak / adhd, cleaning, chores, routine, focus), kategori Productivity,
  yaş 4+, ekran görüntüsü listesi (6.9" ve 6.5": Bugün-açık, Odak-koyu, Odalar, Dopamin).
- [ ] Commit: `docs: store metadata, privacy policy and release guide`

### Task 11: Son doğrulama + kod incelemesi

- [ ] Üçlü kontrol + `npx cap sync` temiz.
- [ ] Tarayıcı matrisi: 390px × {açık, koyu} × {TR, EN} — 6 görünümün ekran görüntüsü
      kullanıcıya gösterilir.
- [ ] Bundle boyutu: `npm run build` çıktısında JS < 350KB gzip hedefi (React 19 + app).
- [ ] code-reviewer ajanı ile inceleme; bulgular düzeltilir.
- [ ] Commit: `chore: release candidate 1.0.0` (+ package.json version 1.0.0)

## Plan Self-Review Notu

Spec §3'teki her madde Task 4–8'de karşılanıyor; §6 → Task 9–10; kalıcılık riski → Task 6;
4.2 savunması → Task 7–8. Bilinen açık uç: CocoaPods/SPM seçimi runtime'da netleşir
(Task 7 fallback'li) ve gerçek cihaz doğrulaması kullanıcı Xcode kurulumuna bağlı.
