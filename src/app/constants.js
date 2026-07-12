export const TABS = [
  { id: "today", label: "Bugün", icon: "◌" },
  { id: "rooms", label: "Odalar", icon: "⌂" },
  { id: "routines", label: "Rutinler", icon: "✓" },
  { id: "focus", label: "Odak", icon: "◷" },
  { id: "quick", label: "Dopamin", icon: "✦" },
  { id: "settings", label: "Ayarlar", icon: "⚙" },
];

export const LEVELS = [
  { id: "light", label: "Hafif", tone: "low" },
  { id: "medium", label: "Orta", tone: "mid" },
  { id: "deep", label: "Derin", tone: "high" },
];

export const LEVEL_LABELS = Object.fromEntries(LEVELS.map((level) => [level.id, level.label]));

export const TIME_OPTIONS = [
  { value: "2", label: "2 dk" },
  { value: "5", label: "5 dk" },
  { value: "10", label: "10 dk" },
];

export const CARE_MODES = [
  { value: "normal", label: "Normal" },
  { value: "baby-awake", label: "Bebek uyanık" },
  { value: "baby-sleeping", label: "Bebek uyuyor" },
  { value: "one-hand", label: "Tek el" },
  { value: "kid", label: "Çocukla" },
];

export const TODAY_MODES = [
  { value: "daily", label: "3 adım" },
  { value: "crisis", label: "Kriz" },
  { value: "kid", label: "Çocukla" },
];

export const TAG_LABELS = {
  "baby-awake": "bebek uyanık",
  "baby-sleeping": "sessiz",
  "one-hand": "tek el",
  kid: "çocukla",
  crisis: "kriz",
  quiet: "sessiz",
};

export const STATUS_LABELS = {
  todo: "hazır",
  started: "başlandı",
  paused: "yarım kaldı",
  done: "bitti",
};
