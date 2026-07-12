# App Store Metadata — Piling Up 1.0

App Store Connect'e girilecek tüm metinler. TR birincil, EN ikincil lokalizasyon.

## Kimlik

| Alan | Değer |
|---|---|
| Bundle ID | `com.dilarayabul.pilingup` |
| Ad (TR ve EN) | Piling Up |
| Kategori | Productivity (Üretkenlik) |
| İkincil kategori | Lifestyle (Yaşam Tarzı) — isteğe bağlı |
| Yaş sınıfı | 4+ |
| Fiyat | Ücretsiz |
| Telif | © 2026 Dilara Yabul |
| Gizlilik politikası URL | `https://<vercel-domain>/privacy.html` ← **deploy sonrası gerçek domainle doldur** |
| Destek URL | `https://<vercel-domain>` ← **doldur** |

## Alt başlık (30 karakter sınırı)

- TR: `Küçük adımlarla ev düzeni` (25)
- EN: `Tidy home in tiny steps` (23)

## Anahtar kelimeler (100 karakter sınırı, virgülle)

- TR: `adhd,temizlik,ev,rutin,odak,dopamin,ev işi,düzen,pomodoro,alışkanlık,motivasyon`
- EN: `adhd,cleaning,chores,routine,focus,dopamine,housework,tidy,pomodoro,habit,motivation`

## Açıklama — TR

```
Ev işleri bazen tek büyük bir yığın gibi görünür. Piling Up o yığını
tek tek kaldırılabilir küçük parçalara böler.

BUGÜN — Güne sadece 3 adımla başla. Enerjin yoksa Kriz modu yalnızca
güvenli alanı hedefler; Çocukla birlikte modu toparlamayı oyuna çevirir.

ODALAR — Her oda, 2-10 dakikalık küçük görevlere bölünmüş. Nereden
başlayacağını düşünmek yok; listeden bir tanesini seç, yap, işaretle.

RUTİNLER — Günlük ve haftalık tekrarlar tek yerde. Zihinde tutma,
uygulamaya bırak.

ODAK — Bir görevi seç, zamanlayıcıyı başlat. Kısa ve net çalışma
blokları; süre bitince dur.

DOPAMİN — 5 dakikan mı var? Hızlı kazanç listesinden birini kap,
mührünü al. Her tamamlanan görev elle basılmış bir mühürle ödüllenir.

Neden Piling Up?
• Hesap yok, kayıt yok, reklam yok.
• Tüm veriler yalnızca cihazında; hiçbir şey sunucuya gitmez.
• Tamamen çevrimdışı çalışır.
• İstersen günde bir kez, seçtiğin saatte nazik bir hatırlatma.
• Türkçe ve İngilizce.

ADHD ile yaşayanlar düşünülerek tasarlandı; ertelemeyle boğuşan
herkes için çalışır.
```

## Açıklama — EN

```
Housework can look like one big impossible pile. Piling Up breaks
that pile into pieces small enough to actually pick up.

TODAY — Start the day with just 3 steps. Low energy? Crisis mode
targets only the essentials; Together-with-kid mode turns tidying
into a game.

ROOMS — Every room is split into 2-10 minute micro-tasks. No
deciding where to start; pick one from the list, do it, tick it.

ROUTINES — Daily and weekly repeats in one place. Stop holding
them in your head.

FOCUS — Pick a task, start the timer. Short, clear work blocks;
when time is up, you stop.

DOPAMINE — Got 5 minutes? Grab a quick win and collect your stamp.
Every finished task is rewarded with a hand-pressed seal.

Why Piling Up?
• No account, no sign-up, no ads.
• All data stays on your device; nothing is sent to any server.
• Works fully offline.
• Optional gentle reminder, once a day at the time you choose.
• Available in Turkish and English.

Designed with ADHD in mind; works for anyone who wrestles with
getting started.
```

## Yeni sürüm notları (1.0)

- TR: `İlk sürüm. Küçük adımlar, mühürler ve düzenli bir ev.`
- EN: `First release. Tiny steps, stamps, and a tidier home.`

## Ekran görüntüleri

Gerekli setler: **6.9"** (1320×2868) ve **6.5"** (1284×2778 veya 1242×2688). Her sette aynı 4 kare:

1. Bugün sekmesi — açık tema, TR (3 adım görünür)
2. Odak sekmesi — koyu tema (zamanlayıcı çalışırken)
3. Odalar sekmesi — açık tema (oda kartları)
4. Dopamin sekmesi — açık tema (mühür animasyonu/kazanılmış mühürler)

EN lokalizasyonu için aynı 4 kare dil EN'e çekilerek tekrarlanır.

## App Store Connect gizlilik beyanı ("App Privacy")

- Data Not Collected — hiçbir veri türü toplanmıyor.
- Tracking: No.
- (Uygulama içi `PrivacyInfo.xcprivacy`: UserDefaults erişimi CA92.1 gerekçesiyle beyan edildi.)

## Bildirim izni açıklaması

İzin istemi Ayarlar'da hatırlatma açılınca tetiklenir; sistem diyaloğu yeterlidir,
ek `NSUserNotificationUsageDescription` anahtarı iOS'ta gerekmiyor.
