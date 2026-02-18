// Dilara'nın Temizlik Asistanı – M4 için optimize: tek referans, ek allocation yok.

/** 5 dakikalık temizlik görevleri (modül yüklemede bir kez, değişmez) */
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
  'Buzdolabının bir rafını kontrol et ve sil',
  'Mutfak tezgahındaki eşyaları düzenle',
  'Bir sepet dolusu çamaşırı katla',
  'Tuvalet ve lavaboyu hızlıca temizle',
]

const LEN = GOREVLER_5_DAKIKA.length

/**
 * Rastgele bir 5 dakikalık temizlik görevi döndürür.
 * M4: tek random, tek index, yeni dizi/obje yok.
 * @returns {string}
 */
export function dopamin_odakli_gorev() {
  return GOREVLER_5_DAKIKA[(Math.random() * LEN) << 0]
}

export { GOREVLER_5_DAKIKA }
