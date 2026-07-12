# Notes: Piling Up iOS dönüşümü

## Doğrulanmış ortam gerçekleri (2026-07-12)
- node v24.13.1; Xcode YOK (yalnız CommandLineTools: `xcode-select -p` →
  /Library/Developer/CommandLineTools); CocoaPods YOK; disk ~20GB boş.
- git: main dalı temizdi; çalışma dalı `feat/ios-appstore`.
- Canlı kod: main.jsx → App.jsx (996 satır) + state.js + data.js + styles.css.
  index.css/App.css/styles/global.css/components/context/hooks/data/utils İMPORT EDİLMİYOR.
- state.test.js: node ile koşuyor (`npm run test:state`), state.js + data.js'e bağlı.
- data.js: 8 oda (entree, living, kitchen, guest-bathroom, study, kids, bedroom,
  parent-bathroom), daily 9 + weekly 11 rutin, QUICK_TASKS dizisi. Minified tek satır —
  düzenlerken dikkat; id'ler canlı kullanıcı verisiyle uyumlu kalmalı ("Recovered from
  the currently deployed Piling Up bundle" notu var).

## Tasarım kaynakları
- Onaylı mockup: docs/design/mockup.html (fontlar base64 gömülü; ayrıca
  src/assets/fonts/fraunces-var.woff2 + fraunces-italic-var.woff2 repoda).
- Fraunces indirilen dosyaları TAM set (unicode-range'siz tek @font-face) — Türkçe
  ğşıİ tarayıcıda doğrulandı.
- Artifact URL: https://claude.ai/code/artifact/259777d0-b278-4567-aea7-087e2e1e4734

## Dikkat noktaları
- Mockup'taki dişli ikonu güneşe benziyor → icons.jsx'te gerçek çark çizilecek.
- QuickPage doneCount lokal state; gün içi kalıcılık v1'de gerekmiyor (mevcut davranış).
- vercel.json cache kuralları mevcut; privacy.html assets dışı olduğundan ekstra kural gerekmez.
- Apple gereksinimleri: PrivacyInfo.xcprivacy (CA92.1), ITSAppUsesNonExemptEncryption,
  Guideline 4.2 için native değer (haptik+bildirim+offline+splash).
