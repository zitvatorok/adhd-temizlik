// Dilara'nın Temizlik Asistanı – Dopamin odaklı 5 dakikalık görevler

import { useState, useCallback } from 'react'
import { CelebrationConfetti } from '../Tasks/CelebrationConfetti.jsx'

const GOREVLER_5_DAKIKA = [
  'Bulaşık makinesini boşalt',
  'Çöpü çıkar',
  'Bir dolabın bir rafını topla',
  'Masanın üstünü sil',
  'Yerdeki eşyaları yerine koy',
  'Bir pencereyi sil',
  'Lavaboyu parlat',
  'Tezgahı sil',
  'Yatağı topla',
  'Küçük bir alanı süpür',
  'Kitaplığın bir rafını düzelt',
  'Banyo aynasını sil',
  'Bir çekmeceyi topla',
  'Süpürgeyle bir odayı süpür',
  'Çiçekleri sulayıp yaprakları sil',
  'Kapı kollarını sil',
  "Buzdolabının bir rafını kontrol et ve sil",
  'Mutfak tezgahındaki eşyaları düzenle',
  'Bir sepet dolusu çamaşırı katla',
  'Tuvalet ve lavaboyu hızlıca temizle',
]

function rastgeleGorev() {
  return GOREVLER_5_DAKIKA[Math.floor(Math.random() * GOREVLER_5_DAKIKA.length)]
}

export function DopaminTemizlik() {
  const [gorev, setGorev] = useState(null)
  const [celebrationKey, setCelebrationKey] = useState(null)
  const [kutlamaGoster, setKutlamaGoster] = useState(false)

  const yeniGorev = useCallback(() => {
    setKutlamaGoster(false)
    setGorev(rastgeleGorev())
  }, [])

  const goreviBitirdim = useCallback(() => {
    setCelebrationKey((k) => (k ?? 0) + 1)
    setKutlamaGoster(true)
  }, [])

  const gorevYok = gorev === null && !kutlamaGoster
  const gorevVar = gorev !== null && !kutlamaGoster
  const kutlamaVar = kutlamaGoster

  return (
    <div className="dopamin-temizlik card-elevated">
      {/* Başlangıç: kullanıcıdan "Görev al" girdisi */}
      {gorevYok && (
        <div className="dopamin-start">
          <p className="dopamin-intro">
            Rastgele 5 dakikalık bir görev. Bitirince butona bas, kutlama senin.
          </p>
          <button
            type="button"
            className="dopamin-btn dopamin-btn--primary tap-target"
            onClick={yeniGorev}
          >
            Görev al
          </button>
        </div>
      )}

      {/* Görev gösterildi: kullanıcıdan "Görevi bitirdim" girdisi */}
      {gorevVar && (
        <div className="dopamin-task">
          <p className="dopamin-label">5 dakikalık görevin</p>
          <p className="dopamin-gorev">{gorev}</p>
          <button
            type="button"
            className="dopamin-btn dopamin-btn--done tap-target"
            onClick={goreviBitirdim}
          >
            Görevi bitirdim
          </button>
        </div>
      )}

      {/* Kutlama: konfeti + mesaj, sonra "Yeni görev" girdisi */}
      {kutlamaVar && (
        <div className="dopamin-celebration">
          <CelebrationConfetti triggerKey={celebrationKey} />
          <p className="dopamin-celebration-title">Harika! Tebrikler!</p>
          <p className="dopamin-celebration-text">Dopamin kazandın.</p>
          <button
            type="button"
            className="dopamin-btn dopamin-btn--primary tap-target"
            onClick={yeniGorev}
          >
            Yeni görev al
          </button>
        </div>
      )}
    </div>
  )
}
