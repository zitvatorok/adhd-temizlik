// Recovered from the currently deployed Piling Up bundle so existing task ids stay compatible.
const bl={KITCHEN:"kitchen",LIVING:"living",BEDROOM:"bedroom",GUEST_BATHROOM:"guest-bathroom",PARENT_BATHROOM:"parent-bathroom",KIDS:"kids",ENTREE:"entree",STUDY:"study"},bf={[bl.KITCHEN]:{id:bl.KITCHEN,name:"Mutfak",tasks:[{id:"k-counter",title:"Tezgâhı hızlıca toparla",level:"light",done:!1},{id:"k-dishes",title:"Bulaşıkları makineye yerleştir",level:"medium",done:!1},{id:"k-trash",title:"Çöpü kontrol et ve gerekiyorsa çıkar",level:"light",done:!1},{id:"k-table",title:"Masayı sil",level:"medium",done:!1},{id:"k-sink",title:"Lavabodaki bulaşıkları sıcak suyla çalkala",level:"light",done:!1},{id:"k-stove",title:"Ocak üstünü kabaca sil",level:"medium",done:!1},{id:"k-closet-1",title:"Dolap içi düzenleme - bir rafı seç ve düzelt",level:"deep",done:!1},{id:"k-closet-2",title:"Çekmece boşaltma - bir çekmeceyi seç, içindekileri çıkar ve düzenle",level:"deep",done:!1},{id:"k-closet-3",title:"Buzdolabı derin temizlik - bir rafı boşalt, sil ve yeniden yerleştir",level:"deep",done:!1},{id:"k-closet-4",title:"Dondurucu ayıklama - tarih geçmiş veya kullanılmayan şeyleri çıkar",level:"deep",done:!1},{id:"k-closet-5",title:"Tezgâh altı dolapları - bir dolabı boşalt, temizle ve düzenle",level:"deep",done:!1},{id:"k-closet-6",title:"Mutfak eşyalarını ayıklama - kırık, kullanılmayan veya fazla eşyaları ayır",level:"deep",done:!1},{id:"k-closet-7",title:"Rafları silme - üst dolapların raflarını nemli bezle sil",level:"deep",done:!1}]},[bl.LIVING]:{id:bl.LIVING,name:"Salon",tasks:[{id:"l-desk-reset",title:"Masa üstü 2 dk sıfırla",level:"light",done:!1},{id:"l-couch-items",title:"Koltuk üzerindeki eşyaları yerine koy",level:"light",done:!1},{id:"l-desk-wipe",title:"Masa üstünü hızlı sil",level:"light",done:!1},{id:"l-bookshelf-top",title:"Kitaplık üstündeki eşyaları kaldır",level:"light",done:!1},{id:"l-activity-desk",title:"Aktivite masası düzenle, sil (10 dk)",level:"medium",done:!1},{id:"l-floor-tidy",title:"Ortalık toparlama (10 dk timer)",level:"medium",done:!1},{id:"l-shelf-section",title:"Rafları 1 bölüm düzenle (tam raf değil)",level:"medium",done:!1},{id:"l-drawer-organize",title:"1 çekmece düzenle",level:"deep",done:!1},{id:"l-shelf-organize",title:"1 raf düzenle",level:"deep",done:!1},{id:"l-vacuum-mop",title:"Süpürme + silme",level:"deep",done:!1},{id:"l-dusting",title:"Toz alma",level:"deep",done:!1}]},[bl.BEDROOM]:{id:bl.BEDROOM,name:"Yatak odası",tasks:[{id:"b-bed",title:"Yatağı düzelt",level:"light",done:!1},{id:"b-clothes",title:"Giyilmiş kıyafetleri sepete at",level:"light",done:!1},{id:"b-surfaces",title:"Komodin üstünü sadeleştir",level:"medium",done:!1},{id:"b-floor",title:"Yerdeki 5 eşyayı seçip kaldır",level:"medium",done:!1},{id:"b-wardrobe",title:"Dolabın önünde görünen 3 kıyafeti düzelt",level:"medium",done:!1},{id:"b-closet-1",title:"Dolap içi düzenleme - bir rafı seç ve kıyafetleri düzenle",level:"deep",done:!1},{id:"b-closet-2",title:"Çekmece boşaltma - komodin veya dolap çekmecelerinden birini düzenle",level:"deep",done:!1},{id:"b-closet-3",title:"Kıyafet ayıklama - giyilmeyen, küçük veya yırtık kıyafetleri ayır",level:"deep",done:!1},{id:"b-closet-4",title:"Raf silme - dolap raflarını nemli bezle sil ve düzenle",level:"deep",done:!1},{id:"b-closet-5",title:"Yatak altı temizlik - yatağın altını süpür ve eşyaları çıkar",level:"deep",done:!1},{id:"b-closet-6",title:"Makyaj masası/komodin derin temizlik - üstünü boşalt, sil ve düzenle",level:"deep",done:!1},{id:"b-closet-7",title:"Aksesuar düzenleme - takı, kemer, çanta gibi eşyaları düzenle",level:"deep",done:!1}]},[bl.GUEST_BATHROOM]:{id:bl.GUEST_BATHROOM,name:"Misafir Banyosu",tasks:[{id:"gb-sink",title:"Lavaboyu hızlıca çalkala/sil",level:"light",done:!1},{id:"gb-trash",title:"Çöpü kontrol et",level:"light",done:!1},{id:"gb-towels",title:"Havluları as ve düzelt",level:"light",done:!1},{id:"gb-mirror",title:"Aynayı peçete/bezle kabaca sil",level:"medium",done:!1},{id:"gb-floor",title:"Yerleri gözle kontrol et, görünen kirleri sil",level:"medium",done:!1},{id:"gb-closet-1",title:"Dolap içi düzenleme - banyo dolabını boşalt, temizle ve düzenle",level:"deep",done:!1},{id:"gb-closet-2",title:"Çekmece boşaltma - banyo çekmecelerinden birini düzenle",level:"deep",done:!1},{id:"gb-closet-3",title:"Raf silme - duş veya lavabo üstü rafları temizle",level:"deep",done:!1},{id:"gb-closet-4",title:"Eşya ayıklama - tarih geçmiş, boş veya kullanılmayan ürünleri ayır",level:"deep",done:!1},{id:"gb-closet-5",title:"Duş kabini derin temizlik - köşeleri ve camları iyice temizle",level:"deep",done:!1},{id:"gb-closet-6",title:"Klozet çevresi derin temizlik - klozetin etrafını ve arkasını temizle",level:"deep",done:!1},{id:"gb-closet-7",title:"Duşakabin/küvet kenarları - silikon ve köşeleri temizle",level:"deep",done:!1}]},[bl.PARENT_BATHROOM]:{id:bl.PARENT_BATHROOM,name:"Ebeveyn Banyosu",tasks:[{id:"pb-sink",title:"Lavaboyu hızlıca çalkala/sil",level:"light",done:!1},{id:"pb-trash",title:"Çöpü kontrol et",level:"light",done:!1},{id:"pb-towels",title:"Havluları as ve düzelt",level:"light",done:!1},{id:"pb-mirror",title:"Aynayı peçete/bezle kabaca sil",level:"medium",done:!1},{id:"pb-floor",title:"Yerleri gözle kontrol et, görünen kirleri sil",level:"medium",done:!1},{id:"pb-closet-1",title:"Dolap içi düzenleme - banyo dolabını boşalt, temizle ve düzenle",level:"deep",done:!1},{id:"pb-closet-2",title:"Çekmece boşaltma - makyaj veya banyo çekmecelerinden birini düzenle",level:"deep",done:!1},{id:"pb-closet-3",title:"Raf silme - duş, lavabo üstü veya duvar raflarını temizle",level:"deep",done:!1},{id:"pb-closet-4",title:"Kozmetik/kişisel bakım ürünleri ayıklama - tarih geçmiş veya boş ürünleri ayır",level:"deep",done:!1},{id:"pb-closet-5",title:"Duş kabini derin temizlik - köşeleri, camları ve zeminini iyice temizle",level:"deep",done:!1},{id:"pb-closet-6",title:"Klozet çevresi derin temizlik - klozetin etrafını, arkasını ve altını temizle",level:"deep",done:!1},{id:"pb-closet-7",title:"Duşakabin/küvet kenarları ve silikon - köşeleri ve silikonları temizle",level:"deep",done:!1}]},[bl.KIDS]:{id:bl.KIDS,name:"Çocuk odası",tasks:[{id:"ktoys",title:"En sevdikleri oyuncakları sepete koy",level:"light",done:!1},{id:"kbed",title:"Yatağı mümkün olduğunca düzelt",level:"light",done:!1},{id:"kfloor",title:"Yerdeki 5 eşyayı yerine kaldır",level:"medium",done:!1},{id:"k-desk",title:"Çalışma masasının üstündeki kağıtları tek bir deste yap",level:"light",done:!1},{id:"k-shelf",title:"Raflardan bir göz seç ve sadece onu düzelt",level:"medium",done:!1},{id:"k-closet-1",title:"Dolap içi düzenleme - bir rafı seç ve oyuncakları/kıyafetleri düzenle",level:"deep",done:!1},{id:"k-closet-2",title:"Çekmece boşaltma - masanın veya dolabın çekmecelerinden birini düzenle",level:"deep",done:!1},{id:"k-closet-3",title:"Oyuncak ayıklama - kırık, eksik parçalı veya kullanılmayan oyuncakları ayır",level:"deep",done:!1},{id:"k-closet-4",title:"Raf silme - kitaplık veya oyuncak raflarını nemli bezle sil",level:"deep",done:!1},{id:"k-closet-5",title:"Yatak altı temizlik - yatağın altını süpür ve saklanan eşyaları çıkar",level:"deep",done:!1},{id:"k-closet-6",title:"Masa üstü derin temizlik - çalışma masasını boşalt, sil ve düzenle",level:"deep",done:!1},{id:"k-closet-7",title:"Kıyafet düzenleme - küçük, yırtık veya giyilmeyen kıyafetleri ayır",level:"deep",done:!1}]},[bl.STUDY]:{id:bl.STUDY,name:"Çalışma Odası",tasks:[{id:"s-desk-surface",title:"Çalışma masası üstünü boşalt",level:"light",done:!1},{id:"s-papers",title:"Kağıtları tek bir desteye topla",level:"light",done:!1},{id:"s-pens",title:"Kalemleri kalemliğe düzenle",level:"light",done:!1},{id:"s-chair",title:"Sandalyeyi masaya doğru it",level:"light",done:!1},{id:"s-computer",title:"Bilgisayar ekranını ve klavyeyi sil",level:"medium",done:!1},{id:"s-cables",title:"Kabloları düzenle ve topla",level:"medium",done:!1},{id:"s-closet-1",title:"Çalışma dolabı içi düzenleme - bir rafı seç ve düzenle",level:"deep",done:!1},{id:"s-closet-2",title:"Çekmece boşaltma - masanın veya dolabın çekmecelerinden birini düzenle",level:"deep",done:!1},{id:"s-closet-3",title:"Kitaplık düzenleme - bir rafı seç ve kitapları düzenle",level:"deep",done:!1},{id:"s-closet-4",title:"Ofis malzemeleri ayıklama - boş, kırık veya kullanılmayan eşyaları ayır",level:"deep",done:!1},{id:"s-closet-5",title:"Raf silme - kitaplık veya dolap raflarını nemli bezle sil",level:"deep",done:!1},{id:"s-closet-6",title:"Masa altı temizlik - masanın altını süpür ve kabloları düzenle",level:"deep",done:!1},{id:"s-closet-7",title:"Dosya düzenleme - dosyaları tasnif et ve gereksizleri ayır",level:"deep",done:!1}]},[bl.ENTREE]:{id:bl.ENTREE,name:"Antre",tasks:[{id:"e-shoe-rack",title:"Ayakkabılığın üstünü boşalt (3 dk)",level:"light",done:!1},{id:"e-floor-check",title:"Koridor zeminini kontrol et",level:"light",done:!1},{id:"e-surfaces",title:"Giriş yüzeylerini (konsol, raf) boşalt",level:"light",done:!1},{id:"e-door-items",title:"Kapı arkasındaki eşyaları (şemsiye, çanta vb.) düzenle",level:"light",done:!1},{id:"e-coat-rack",title:"Portmanto altını hızlı toparla (5 dk)",level:"medium",done:!1},{id:"e-closet-reset",title:"Koridor gömme dolap: 15 dk mini reset",level:"medium",done:!1},{id:"e-table-review",title:"Ertelenen tablo setini gözden geçir",level:"medium",done:!1},{id:"e-zamazingo",title:"Zamazingo kutusunu düzenle (15 dk)",level:"medium",done:!1},{id:"e-shelves-organize",title:"En üstten başlayarak dolap raflarını düzenle",level:"deep",done:!1},{id:"e-medicine-check",title:"İlaçları süresi kontrol et + yerleştir",level:"deep",done:!1},{id:"e-closet-organize",title:"Dolap içi düzenleme - giriş dolabını veya bir rafı seç",level:"deep",done:!1},{id:"e-shoe-clean",title:"Ayakkabılık temizliği - ayakkabıları çıkar, tabanı süpür",level:"deep",done:!1},{id:"e-drawer-organize",title:"Çekmece boşaltma - giriş çekmecelerinden birini düzenle",level:"deep",done:!1},{id:"e-item-culling",title:"Eşya ayıklama - kullanılmayan, fazla veya kırık eşyaları ayır",level:"deep",done:!1}]}},xr={daily:[{id:"d-dishes",title:"Bulaşık makinesini çalıştır ya da boşalt",level:"medium",done:!1},{id:"d-surfaces",title:"Bir yüzeyi 5 dakika toparla",level:"medium",done:!1},{id:"d-trash",title:"Evdeki bir çöpü kontrol et",level:"light",done:!1},{id:"d-bed",title:"En az bir yatağı düzelt",level:"light",done:!1},{id:"d-laundry",title:"Kirli sepetini kontrol et, gerekiyorsa makineye bir şeyler at",level:"medium",done:!1},{id:"d-mail",title:"Gelen posta/kutu birikintisini 5 dakika kontrol et",level:"light",done:!1},{id:"d-antre-shoe-rack",title:"Ayakkabılığın üstünü boşalt (3 dk)",level:"light",done:!1},{id:"d-antre-floor",title:"Koridor zeminini kontrol et",level:"light",done:!1},{id:"d-antre-coat-rack",title:"Portmanto altını hızlı toparla (5 dk)",level:"medium",done:!1}],weekly:[{id:"w-sheets",title:"Yatak çarşaflarını değiştir",level:"deep",done:!1},{id:"w-bath",title:"Banyo lavabosu ve klozeti iyice temizle",level:"deep",done:!1},{id:"w-fridge",title:"Buzdolabında tarih geçmişleri kontrol et",level:"medium",done:!1},{id:"w-dust",title:"Evdeki yüzeylerden en az bir odayı toz al",level:"medium",done:!1},{id:"w-vacuum",title:"Evin bir bölümünü (ör: salon) süpür ya da süpürgeyle gez",level:"medium",done:!1},{id:"w-paperwork",title:"Masa/kağıt yığını için 10 dakika ayır",level:"deep",done:!1},{id:"w-antre-shelves",title:"En üstten başlayarak dolap raflarını düzenle",level:"deep",done:!1},{id:"w-antre-closet",title:"Koridor gömme dolap: 15 dk mini reset",level:"medium",done:!1},{id:"w-antre-table",title:"Ertelenen tablo setini gözden geçir",level:"medium",done:!1},{id:"w-antre-medicine",title:"İlaçları süresi kontrol et + yerleştir",level:"deep",done:!1},{id:"w-antre-zamazingo",title:"Zamazingo kutusunu düzenle (15 dk)",level:"medium",done:!1}]};

export const ROOM_IDS = bl;
export const DEFAULT_ROOMS = bf;
export const DEFAULT_ROUTINES = xr;

export const ROOM_ORDER = [
  bl.ENTREE,
  bl.LIVING,
  bl.KITCHEN,
  bl.GUEST_BATHROOM,
  bl.STUDY,
  bl.KIDS,
  bl.BEDROOM,
  bl.PARENT_BATHROOM,
];

export const QUICK_TASKS = [
  "Bulaşık makinesini boşalt",
  "Çöpü çıkar",
  "Bir dolabın bir rafını topla",
  "Masanın üstünü sil",
  "Yerdeki eşyaları yerine koy",
  "Bir pencereyi sil",
  "Lavaboyu parlat",
  "Tezgahı sil",
  "Yatağı topla",
  "Küçük bir alanı süpür",
  "Kitaplığın bir rafını düzelt",
  "Banyo aynasını sil",
  "Bir çekmeceyi topla",
  "Süpürgeyle bir odayı süpür",
  "Çiçekleri sulayıp yaprakları sil",
  "Kapı kollarını sil",
  "Buzdolabının bir rafını kontrol et ve sil",
  "Mutfak tezgahındaki eşyaları düzenle",
  "Bir sepet dolusu çamaşırı katla",
  "Tuvalet ve lavaboyu hızlıca temizle",
];

export const SUPPORT_TASKS = {
  crisis: [
    {
      id: "crisis-trash",
      title: "Görünen çöpleri tek poşete topla",
      level: "light",
      minutes: 2,
      tags: ["crisis", "one-hand", "baby-awake"],
      done: false,
    },
    {
      id: "crisis-dishes",
      title: "Bulaşıkları sadece lavaboya veya makineye taşı",
      level: "light",
      minutes: 5,
      tags: ["crisis", "baby-awake"],
      done: false,
    },
    {
      id: "crisis-counter",
      title: "Tezgahın bir küçük bölümünü aç",
      level: "light",
      minutes: 5,
      tags: ["crisis", "one-hand", "baby-awake"],
      done: false,
    },
    {
      id: "crisis-floor",
      title: "Yerdeki tehlikeli 5 şeyi kaldır",
      level: "light",
      minutes: 2,
      tags: ["crisis", "one-hand", "baby-awake", "kid"],
      done: false,
    },
    {
      id: "crisis-kids-zone",
      title: "Bebek/çocuk alanında bir güvenli boşluk aç",
      level: "medium",
      minutes: 10,
      tags: ["crisis", "baby-awake", "kid"],
      done: false,
    },
  ],
  kid: [
    {
      id: "kid-toys-basket",
      title: "Oyuncakları sepete atma yarışı",
      level: "light",
      minutes: 5,
      tags: ["kid", "baby-awake"],
      done: false,
    },
    {
      id: "kid-socks",
      title: "Çorap eşleştirme görevi",
      level: "light",
      minutes: 5,
      tags: ["kid", "quiet", "baby-awake"],
      done: false,
    },
    {
      id: "kid-table",
      title: "Masadan kendi eşyalarını toplama",
      level: "light",
      minutes: 5,
      tags: ["kid", "baby-awake"],
      done: false,
    },
    {
      id: "kid-books",
      title: "Kitapları aynı yöne bakacak şekilde dizme",
      level: "light",
      minutes: 5,
      tags: ["kid", "quiet", "baby-sleeping"],
      done: false,
    },
    {
      id: "kid-laundry",
      title: "Temiz kıyafetleri sahibine göre ayırma",
      level: "medium",
      minutes: 10,
      tags: ["kid", "quiet", "baby-awake"],
      done: false,
    },
  ],
};
