export const defaultRoutines = {
  daily: [
    {
      id: 'd-dishes',
      title: 'Bulaşık makinesini çalıştır ya da boşalt',
      level: 'medium',
      done: false,
    },
    { id: 'd-surfaces', title: 'Bir yüzeyi 5 dakika toparla', level: 'medium', done: false },
    { id: 'd-trash', title: 'Evdeki bir çöpü kontrol et', level: 'light', done: false },
    { id: 'd-bed', title: 'En az bir yatağı düzelt', level: 'light', done: false },
    {
      id: 'd-laundry',
      title: 'Kirli sepetini kontrol et, gerekiyorsa makineye bir şeyler at',
      level: 'medium',
      done: false,
    },
    {
      id: 'd-reset-entry',
      title: 'Girişteki ayakkabılardan 3 tanesini düzelt',
      level: 'light',
      done: false,
    },
  ],
  weekly: [
    { id: 'w-sheets', title: 'Yatak çarşaflarını değiştir', level: 'deep', done: false },
    {
      id: 'w-bath',
      title: 'Banyo lavabosu ve klozeti iyice temizle',
      level: 'deep',
      done: false,
    },
    {
      id: 'w-fridge',
      title: 'Buzdolabında tarih geçmişleri kontrol et',
      level: 'medium',
      done: false,
    },
    {
      id: 'w-dust',
      title: 'Evdeki yüzeylerden en az bir odayı toz al',
      level: 'medium',
      done: false,
    },
    {
      id: 'w-vacuum',
      title: 'Evin bir bölümünü (ör: salon) süpür ya da süpürgeyle gez',
      level: 'medium',
      done: false,
    },
    {
      id: 'w-paperwork',
      title: 'Masa/kağıt yığını için 10 dakika ayır',
      level: 'deep',
      done: false,
    },
  ],
}

