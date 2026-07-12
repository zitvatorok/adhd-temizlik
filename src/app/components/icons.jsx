/* Özel stroke ikon seti — 24×24, 1.7pt, yuvarlak uç. Kaynak: docs/design/mockup.html.
   Çark, mockup'taki güneşe benzeyen versiyonun yerine gerçek dişli olarak çizildi. */

const PATHS = {
  today: (
    <>
      <circle cx="12" cy="13.5" r="4.3" />
      <path d="M12 3.8v2.4M5 6.6l1.7 1.7M19 6.6l-1.7 1.7" />
    </>
  ),
  rooms: (
    <>
      <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="2.6" />
      <path d="M12 4.2V11h7.8" />
    </>
  ),
  routines: (
    <>
      <path d="M6.2 13.5a6 6 0 0 1 9.8-6.2" />
      <path d="M17.8 10.5a6 6 0 0 1-9.8 6.2" />
      <path d="M15.6 4.6l.6 2.9-2.9.6" />
      <path d="M8.4 19.4l-.6-2.9 2.9-.6" />
    </>
  ),
  focus: (
    <>
      <circle cx="12" cy="13.2" r="7" />
      <path d="M12 13.2V9M10 2.8h4" />
    </>
  ),
  quick: (
    <path d="M12 4c.75 3.7 2.55 5.5 6.25 6.25C14.55 11 12.75 12.8 12 16.5c-.75-3.7-2.55-5.5-6.25-6.25C9.45 9.5 11.25 7.7 12 4zM18.5 15.5c.35 1.7 1.2 2.55 2.9 2.9-1.7.35-2.55 1.2-2.9 2.9-.35-1.7-1.2-2.55-2.9-2.9 1.7-.35 2.55-1.2 2.9-2.9z" />
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="2.9" />
      <path d="M12 3.2v2.1m0 13.4v2.1M3.2 12h2.1m13.4 0h2.1M5.8 5.8l1.5 1.5m9.4 9.4 1.5 1.5m0-12.4-1.5 1.5m-9.4 9.4-1.5 1.5" />
      <circle cx="12" cy="12" r="7.2" strokeDasharray="2.4 3.35" />
    </>
  ),
  back: <path d="M14.5 5.5 8 12l6.5 6.5" />,
  check: <path d="M5 13l4.5 4.5L19 7.5" />,
};

export function Icon({ name, size = 22, strokeWidth = 1.7 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name] || null}
    </svg>
  );
}
