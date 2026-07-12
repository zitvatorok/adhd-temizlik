# Piling Up

ADHD dostu ev düzeni uygulaması: ev işlerini 2–10 dakikalık küçük adımlara böler,
her tamamlanan görevi mühürle ödüllendirir. React 19 + Vite 7 web uygulaması,
Capacitor 7 ile iOS'a paketlenir. TR + EN, tamamen çevrimdışı, veri yalnız cihazda.

- Sekmeler: Bugün · Odalar · Rutinler · Odak · Dopamin (+ Ayarlar, başlıktaki dişli)
- Tasarım: "sıcak editoryal" — Fraunces (repoda, CDN yok), kâğıt/yosun/kil paleti
- Kalıcılık: web'de `localStorage`, native'de Capacitor Preferences (aynı anahtar)
- Bildirim: isteğe bağlı, günde bir, yerel zamanlanır (`@capacitor/local-notifications`)

## Geliştirme

```bash
npm install
npm run dev          # Vite dev server
npm run lint         # ESLint
npm run test:state   # state cekirdegi testleri (node src/state.test.js)
npm run build        # dist/ uretimi
```

Kod haritası: `src/state.js` + `src/data.js` davranışsal çekirdek (değiştirme!),
`src/app/` UI katmanı (shell/views/components/i18n/native), `src/styles/` tasarım
token'ları. `src/app/native/` altındaki modüller web'de sessizce no-op'a düşer.

## Görsel üretimi (ikon / splash / PWA)

Kaynaklar `assets/*.svg`; PNG'ler üretilir, commit'lenmez (`.gitignore`):

```bash
node scripts/render-assets.mjs                          # sharp: png'ler (assets/ + public/)
npx @capacitor/assets generate --ios --assetPath assets # ios/ AppIcon + Splash setleri
```

## iOS build

Gereksinim: macOS + Xcode (App Store hedefi için tam Xcode, ~40GB alan).

```bash
npm run build
npx cap sync ios       # dist/ -> ios/, SPM bagimliliklarini gunceller
npx cap open ios       # Xcode'da App workspace'i acar
```

Xcode'da: Signing & Capabilities → kendi Team'ini seç (bundle id
`com.pilingup.app`). Simülatörde çalıştır; gerçek cihazda haptik,
bildirim zamanlaması ve safe-area mutlaka test edilmeli — bunlar simülatör/web'de
tam doğrulanamaz.

## App Store yayın adımları

Repo tarafı hazır olanlar:

- [x] `ios/App/App/PrivacyInfo.xcprivacy` (veri toplanmıyor; UserDefaults CA92.1)
- [x] `Info.plist`: `ITSAppUsesNonExemptEncryption=false`, display name "Piling Up"
- [x] AppIcon + Splash setleri (`Assets.xcassets`)
- [x] Gizlilik politikası sayfası: `public/privacy.html` (web deploy'uyla yayınlanır)
- [x] Mağaza metinleri: [store/metadata.md](store/metadata.md)

Kullanıcının yapacakları (sırayla):

1. Apple Developer Program üyeliği (yıllık, developer.apple.com).
2. Uygulama için destek e-postası aç (ör. pilingup@gmail.com) →
   `public/privacy.html` içindeki iki `[destek-eposta]` placeholder'ını doldur.
3. Web'i deploy et (Vercel) → `store/metadata.md` içindeki iki `<vercel-domain>`
   placeholder'ını gerçek URL ile doldur.
4. App Store Connect'te yeni uygulama oluştur (bundle id yukarıdaki).
5. Metadata'yı `store/metadata.md`'den kopyala (TR birincil, EN lokalizasyon);
   App Privacy bölümünde "Data Not Collected" beyan et.
6. Gerçek cihaz/simülatörde 6.9" ve 6.5" ekran görüntülerini çek
   (kare listesi `store/metadata.md`'de).
7. Xcode: Product → Archive → Distribute App → App Store Connect'e yükle.
8. TestFlight'ta gerçek cihazda dene (özellikle bildirim + haptik), sonra
   incelemeye gönder.

## Web deploy

`vercel.json` hazır: `npm run build` → `dist/`. `index.html` no-store,
hash'li asset'ler immutable cache. `privacy.html` statik olarak yayınlanır.
