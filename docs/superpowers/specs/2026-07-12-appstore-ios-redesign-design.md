# Piling Up — App Store iOS Sürümü Tasarım Spesifikasyonu

**Tarih:** 2026-07-12 · **Durum:** Kullanıcı onaylı (görsel yön mockup'ı onaylandı)
**Mockup:** `docs/design/mockup.html` (repoya işlendi) · Artifact: https://claude.ai/code/artifact/259777d0-b278-4567-aea7-087e2e1e4734

## 1. Amaç

Mevcut React + Vite PWA'yı ("Piling Up", ADHD dostu ev toparlama uygulaması) App Store'da
yayımlanabilir, görsel olarak sofistike bir iOS uygulamasına dönüştürmek. Web/Vercel sürümü
aynı kod tabanından yaşamaya devam eder.

## 2. Onaylanmış Kararlar

| Karar | Seçim |
|---|---|
| Teknoloji | Capacitor 7 (mevcut React kodu korunur, native kabuk) |
| Görsel yön | "Sıcak editoryal — kâğıt, mürekkep, mühür" |
| Dil | Türkçe + İngilizce (cihaz dilinden otomatik + ayarlardan elle) |
| Bildirim | Günlük hatırlatma v1'e girer (varsayılan kapalı, saat seçilebilir) |
| Bundle ID | `com.dilarayabul.pilingup` (Apple hesabına göre değiştirilebilir) |
| Sürüm | 1.0.0 |

## 3. Ürün Kapsamı (v1)

Özellik seti mevcut uygulamayla birebir aynıdır; tek ekleme günlük hatırlatma bildirimi.

- **Sekmeler 6 → 5:** Bugün · Odalar · Rutinler · Odak · Dopamin. Ayarlar, başlıktaki
  dişli ikonuna taşınır (iOS HIG).
- **Bugün:** 3 adım önerisi; zaman bütçesi (2/5/10 dk), bakım modu (Normal/Bebek uyanık/
  Bebek uyuyor/Tek el/Çocukla), gün modu (3 adım/Kriz/Çocukla); görev durumları
  (hazır/başlandı/yarım kaldı/bitti).
- **Odalar:** 8 oda (data.js'teki mevcut set), enerji filtresi (Hafif/Orta/Derin).
- **Rutinler:** Günlük/Haftalık + son 7 gün geçmişi.
- **Odak:** 25/5 pomodoro, göreve bağlanabilir; sayaç Fraunces opsz-144 ile dizilir.
- **Dopamin:** Rastgele kısa görev; kil vurgu rengi yalnız burada ve mühürlerde.
- **Ayarlar (dişli):** dil, tema (sistem/açık/koyu), varsayılan oda, günlük hatırlatma
  (aç-kapa + saat), bugünü temizle, gizlilik politikası bağlantısı, sürüm.
- **Günlük sıfırlama:** mevcut `state.js` mantığı aynen korunur (test kapsamında).

**Kapsam dışı (v1):** Android, widget, iCloud sync, kullanıcı tanımlı görev ekleme,
konfeti (yerini mühür animasyonu alır), hesap/oturum.

## 4. Görsel Sistem (mockup'ta onaylandı)

### Palet
| Rol | Gündüz kâğıdı | Gece kâğıdı |
|---|---|---|
| Zemin | `#F3EFE4` | `#1B1812` |
| Yüzey (kart) | `#FCFAF3` | `#252017` |
| İç zemin (inset) | `#EAE3D2` | `#2E2819` |
| Mürekkep (metin) | `#29261E` | `#EDE6D5` |
| Yumuşak metin | `#5C5748` | `#C6BEAA` |
| Sessiz metin | `#8D8678` | `#8F8874` |
| Çizgi / çizgi-koyu | `#DED5C1` / `#CFC4AB` | `#383223` / `#4A432E` |
| Yosun (birincil) | `#2E5D45` (koyu: `#234A36`, yumuşak: `#E2EADF`) | `#8FBC9F` (yumuşak: `#2A382D`) |
| Kil (mühür/kutlama) | `#BC5C2B` (yumuşak: `#F4E3D4`) | `#D9834C` (yumuşak: `#3A2B1C`) |
| Yosun üstü metin | `#F3EFE4` | `#17251C` |
| Kil üstü metin | `#FBF3EA` | `#2A1A0F` |

Koyu tema saf siyah değildir; tersine çevirme yok, iki tema ayrı tasarlandı.

### Tipografi
- **Display:** Fraunces variable (repoda: `src/assets/fonts/fraunces-var.woff2` +
  italic). Ağırlık 560–600, `font-optical-sizing: auto`; pomodoro sayacında
  `font-variation-settings: "opsz" 144`. CDN yok; font pakete gömülü.
- **Metin/UI:** Sistem fontu (SF Pro üzerinden `-apple-system`).
- **Etiket:** 11pt, 700, büyük harf, 0.13em aralık. Türkçe İ için `text-transform`
  yerine metinler elle büyük yazılır (CSS `uppercase` i→I hatası).
- **Rakamlar:** sayaç ve istatistiklerde `font-variant-numeric: tabular-nums`.

### İmza öğeler
1. **Mühür:** Onay kutusu yerine tamamlanan görev, hafif dönük (-7°/+5° arası
   deterministik) kil renkli yuvarlatılmış-kare mühürle damgalanır; haptik "tak" ile.
2. **Yığın sayacı:** İlerleme halkası yerine üst üste binen yatay çubuklar (Bugün
   başlığında 3 çubuk = günün 3 adımı).
3. **Defter çizgisi:** Liste ayraçları 1px noktalı (`dotted`) çizgi.

### Doku, hareket, ikonlar
- Kâğıt greni: %4 opaklıkta SVG `feTurbulence` overlay, iki temada da.
- Hareket: 150–250ms ease; mühür basışı ~200ms yay eğrisi (implementasyonda hisse göre
  ayarlanır); `prefers-reduced-motion` açıkken animasyonlar kapalı.
- İkonlar: mockup'taki 24×24, 1.6–1.7pt stroke, yuvarlak uçlu özel SVG set
  (Bugün=doğan güneş, Odalar=kat planı, Rutinler=döngü, Odak=kronometre,
  Dopamin=kıvılcım, Ayarlar=çark — mockup'takinden daha belirgin dişli çizilecek).
- Yasaklar: glassmorphism, mor-mavi/neon gradyan, emoji-ikon, konfeti yağmuru,
  Inter/generic font.

## 5. Mimari

### Kod yapısı (mevcut 996 satırlık App.jsx bölünür; kural: dosya başına 200–400 satır)
```
src/
  app/
    shell/AppShell.jsx      # kabuk: tab bar, header, tema uygulama
    shell/useAppState.js    # state boot + commit + actions
    lib/taskCards.js        # kart/etiket/öneri saf fonksiyonları (App.jsx'ten)
    lib/storage.js          # kalıcılık adaptörü (aşağıda)
    i18n/                   # index.jsx (context+hook), tr.js, en.js
    native/haptics.js       # web'de no-op
    native/notifications.js # günlük hatırlatma
    views/                  # TodayView, RoomsView, RoutinesView, FocusView,
                            # DopamineView, SettingsView
    components/             # TabBar, Header, TaskRow, Stamp, PileMeter,
                            # SegmentedControl, icons.jsx, ...
  styles/                   # tokens.css, base.css, components.css (styles.css emekli olur)
  state.js, data.js         # DOKUNULMAZ çekirdek (test kapsamında), yerinde kalır
```
Ölü kod silinir: `src/components/`, `src/context/`, `src/hooks/`, `src/data/`,
`src/utils/`, `src/App.css`, `src/index.css`, `src/styles/global.css`, `src/assets/react.svg`.
(Doğrulandı: canlı kod bunları import etmiyor.)

### Kalıcılık (kritik düzeltme)
iOS, WKWebView localStorage'ını silebilir → veri kaybı. Çözüm: `@capacitor/preferences`
tabanlı adaptör. Native'de: açılışta Preferences'tan hydrate (async) → bellekte senkron
cache → her yazımda write-through; ilk açılışta localStorage'dan tek seferlik migrasyon.
Web'de: doğrudan localStorage. `state.js` senkron API'sini korur; adaptör ona
storage-benzeri nesne sunar. Test dosyası değişmeden yeşil kalmalıdır.

### i18n
Kütüphanesiz hafif modül. UI metinleri `tr.js`/`en.js` sözlüklerinden; **içerik**
(görev başlıkları, oda adları) stored state içinde gömülü olduğundan şema değiştirilmez:
çeviri, görev/oda **id'si üzerinden** sözlükte aranır, bulunamazsa stored başlık
gösterilir. Dil: `state.ui.language` ("system" varsayılan) → cihaz dilinden çözülür.

### Native katman (Guideline 4.2 savunması)
Haptics (mühürde impact-light, 3/3'te success), StatusBar (temaya göre), SplashScreen,
LocalNotifications (günlük hatırlatma), Preferences, tam offline çalışma, safe-area
(`viewport-fit=cover` + `env(safe-area-inset-*)`), 44pt dokunma hedefleri.

## 6. App Store Uyumluluğu

- `PrivacyInfo.xcprivacy`: UserDefaults erişim gerekçesi CA92.1; veri toplama YOK.
- Info.plist: `CFBundleDisplayName` "Piling Up", `ITSAppUsesNonExemptEncryption` false.
- Gizlilik politikası: `public/privacy.html` (TR/EN; "verileriniz cihazınızda kalır") —
  Vercel'de yayımlanır, Ayarlar'dan bağlanır.
- İkon: mockup'taki "yığılan kâğıtlar + kil mühür" kompozisyonu; 1024px kaynaktan
  `@capacitor/assets` ile tüm boyutlar + splash; PWA ikonları/favicon da yenilenir.
- Mağaza metinleri: `store/metadata.md` (TR+EN ad/alt başlık/açıklama/anahtar kelime,
  kategori: Productivity/Lifestyle, ekran görüntüsü çekim listesi).

## 7. Doğrulama Stratejisi

Her görev sonunda: `npm run lint` + `node src/state.test.js` + `npm run build` yeşil.
Görsel işler tarayıcıda 390px genişlikte, açık+koyu ve TR+EN olarak kontrol edilir.
Capacitor sonrası: `npx cap sync` temiz; simülatör/gerçek cihaz derlemesi kullanıcının
Xcode kurulumuyla yapılır. Kod tamamlanınca code-reviewer ajanıyla gözden geçirme.

## 8. Riskler ve Sınırlar

- **Guideline 4.2:** native katman + tam offline + bildirimle savunulur; yine de takdir
  Apple'ındır.
- **Xcode yok:** makinede yalnız CommandLineTools var (`xcode-select -p` doğrulandı),
  CocoaPods kurulu değil. `ios/` projesi üretilir; derleme/imza için kullanıcı Xcode
  kurar (App Store'dan, ~40GB alan ister; şu an diskte ~20GB boş — açılması gerekebilir).
  Capacitor'da SPM tercih edilir, olmazsa CocoaPods kurulum talimatı verilir.
- **"Piling Up" adı** App Store'da müsait olmayabilir; alternatif alt başlıkla çözülür.
- **Kullanıcının yapacakları:** Apple Developer kaydı ($99/yıl), imzalama, App Store
  Connect kaydı, ekran görüntüsü çekimi (çekim listesi hazır verilecek), TestFlight/yükleme.
