# Task Plan: Piling Up → App Store iOS 1.0

## Goal
Onaylı "sıcak editoryal" tasarımla, Capacitor tabanlı, TR+EN, App Store'a gönderilmeye
hazır Piling Up 1.0 (ayrıntı: docs/superpowers/plans/2026-07-12-appstore-ios-redesign.md).

## Phases
- [x] Faz A: Kararlar (Capacitor · sıcak editoryal · TR+EN · bildirim v1) — kullanıcı onayladı
- [x] Faz B: Görsel yön mockup'ı — kullanıcı onayladı (docs/design/mockup.html)
- [x] Faz C: Spec + uygulama planı yazıldı ve commit'lendi
- [ ] Task 0: Taban çizgisi (lint/test/build yeşil)
- [ ] Task 1: Ölü kod silme
- [ ] Task 2: App.jsx modülerleştirme (görsel değişiklik yok)
- [ ] Task 3: i18n (TR/EN)
- [ ] Task 4: Tasarım sistemi tabanı (tokens/font/kabuk)
- [ ] Task 5: Ekranlar (5a–5f)
- [ ] Task 6: Preferences kalıcılık adaptörü
- [ ] Task 7: Capacitor iOS kabuğu + haptik/statusbar/splash
- [ ] Task 8: Günlük hatırlatma bildirimi
- [ ] Task 9: İkon + splash + PWA görselleri
- [ ] Task 10: Mağaza paketi (privacy, metadata, PrivacyInfo, README)
- [ ] Task 11: Son doğrulama + code review

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
**Faz C bitti** — Kullanıcıdan implementasyon başlangıç onayı ve yürütme modu bekleniyor.
