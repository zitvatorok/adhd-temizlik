# Task Plan: Piling Up → App Store iOS 1.0

## Goal
Onaylı "sıcak editoryal" tasarımla, Capacitor tabanlı, TR+EN, App Store'a gönderilmeye
hazır Piling Up 1.0 (ayrıntı: docs/superpowers/plans/2026-07-12-appstore-ios-redesign.md).

## Phases
- [x] Faz A: Kararlar (Capacitor · sıcak editoryal · TR+EN · bildirim v1) — kullanıcı onayladı
- [x] Faz B: Görsel yön mockup'ı — kullanıcı onayladı (docs/design/mockup.html)
- [x] Faz C: Spec + uygulama planı yazıldı ve commit'lendi
- [x] Task 0: Taban çizgisi (lint/test/build yeşil)
- [x] Task 1: Ölü kod silme (70913b8)
- [x] Task 2: App.jsx modülerleştirme (88a2c0a)
- [x] Task 3: i18n TR/EN — EN'de UI + tüm görev/oda içerik çevirileri; oda görevleri
      "roomId:taskId" kapsamlı anahtarla (mutfak/çocuk k-closet-* çakışması)
- [x] Task 4: Tasarım sistemi tabanı (tokens/font/kabuk) (1074237)
- [x] Task 5: Ekranlar (5a–5f) (1074237)
- [x] Task 6: Preferences kalıcılık adaptörü (869718c)
- [x] Task 7: Capacitor iOS kabuğu + haptik/statusbar/splash (869718c)
- [x] Task 8: Günlük hatırlatma bildirimi (869718c)
- [x] Task 9: İkon + splash + PWA görselleri (0688bda) — 48px okunabilirlik OK
- [x] Task 10: Mağaza paketi (297d41c) — privacy.html, metadata.md, PrivacyInfo
      (pbxproj'a kayıtlı), ITSAppUsesNonExemptEncryption=false, README yeniden yazıldı
- [x] Task 11: Son doğrulama + code review — üçlü kontrol yeşil, cap sync temiz,
      JS ~84KB gzip (<350 hedef), 6'lı tarayıcı matrisi çekildi, bildirim şeması
      plugin Swift kaynağından doğrulandı; reviewer bulgu 1-2 (storage hydration
      guard + .catch) ve 8 (time parse guard) düzeltildi, version 1.0.0

## 1.0.1 Backlog (reviewer bulguları, bloklamayan)
- Bulgu 3: dil değişince zamanlanmış bildirim metni eski dilde kalıyor —
  language değişiminde reminder.enabled ise syncReminder tekrar çağrılmalı
- Bulgu 4: components.css 777 satır — concern bazında bölünebilir
- Bulgu 5: taskCards.js'te ölü hardcoded TR kaynak etiketleri (satır 133-138)
- Bulgu 6: --ink-mute açık temada ~3.16:1 kontrast (meta metin için AA altı)

## Decisions Made
- Capacitor (rewrite değil): mevcut React kodu + web sürümü korunur.
- İçerik i18n'i id-lookup ile (stored state şeması değişmez).
- Ayarlar tab bar'dan çıktı → başlık dişlisi; 5 sekme.
- Konfeti yerine mühür animasyonu; kil rengi yalnız mühür + Dopamin.
- Kalıcılık: native'de Capacitor Preferences (WKWebView localStorage silinme riski).

## Errors Encountered
- 2026-07-12: /private/tmp geçici ENOSPC (scratchpad yazılamadı) — kendiliğinden çözüldü,
  disk şu an ~20GB boş. Xcode kurulumu için yer açılması gerekebilir (~40GB).
- CSS text-transform:uppercase Türkçe İ'yi bozuyor — etiketler elle büyük yazılıyor.
- Browser pane screenshot'ı scroll sonrası boş dönüyor — tam sayfa kontrol için
  viewport'u sayfa boyuna resize et (1440×4400 işe yaradı).

## Status
**Plan tamamlandı (2026-07-12)** — Task 0-11 bitti, RC 1.0.0 commit'lendi.
Bundle id `com.pilingup.app` (5aacdbd); dal push'landı, PR açık:
https://github.com/zitvatorok/adhd-temizlik/pull/1
Kalanlar kullanıcıda: Xcode ile cihaz testi + arşiv/upload, Vercel deploy,
metadata'daki `<vercel-domain>` doldurma, mağaza ekran görüntüleri.
1.0.1 backlog'u yukarıda.
