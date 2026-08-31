const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "..", "source", "in-class", "images", "vocab", "hsk3-l01");
fs.mkdirSync(outDir, { recursive: true });

function svg(body, accent = "#2f7d28") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f8fbff"/>
      <stop offset="0.55" stop-color="#fffdf7"/>
      <stop offset="1" stop-color="#eef7ee"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#dff2ff" stop-opacity=".9"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity=".55"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#203421" flood-opacity=".16"/>
    </filter>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)"/>
  <rect x="70" y="70" width="1140" height="520" rx="34" fill="#fff" opacity=".82" filter="url(#shadow)"/>
  <rect x="95" y="95" width="1090" height="250" rx="24" fill="url(#glass)"/>
  <path d="M120 430 C300 388 420 465 585 423 C735 385 875 405 1160 360 L1160 590 L120 590 Z" fill="#eef4e8"/>
  <g stroke="#c9d8dc" stroke-width="5" opacity=".55">
    <path d="M250 95v250M430 95v250M610 95v250M790 95v250M970 95v250"/>
    <path d="M95 220h1090"/>
  </g>
  <rect x="95" y="590" width="1090" height="22" rx="11" fill="${accent}" opacity=".18"/>
  ${body}
</svg>`;
}

function person(x, y, scale = 1, shirt = "#496b9f", pants = "#263246", hair = "#2b241f") {
  return `<g transform="translate(${x} ${y}) scale(${scale})">
    <circle cx="0" cy="-118" r="38" fill="#f0c7aa"/>
    <path d="M-38-120c12-44 66-48 82-12 0-38-34-58-67-49-30 8-44 31-45 61z" fill="${hair}"/>
    <path d="M-43-72h86l26 170h-138z" fill="${shirt}"/>
    <path d="M-38 98h35v142h-44zM3 98h35l12 142h-44z" fill="${pants}"/>
    <path d="M-54-55l-34 110M54-55l38 105" stroke="#f0c7aa" stroke-width="18" stroke-linecap="round"/>
    <path d="M-45 240h45M0 240h48" stroke="#1f2937" stroke-width="14" stroke-linecap="round"/>
  </g>`;
}

function suitcase(x, y, color = "#32425f") {
  return `<g transform="translate(${x} ${y})">
    <rect x="-55" y="-105" width="110" height="150" rx="18" fill="${color}"/>
    <rect x="-18" y="-136" width="36" height="34" rx="10" fill="none" stroke="#344054" stroke-width="9"/>
    <path d="M-32-82h64M-32-48h64M-32-14h64" stroke="#ffffff" stroke-opacity=".18" stroke-width="5"/>
    <circle cx="-30" cy="55" r="11" fill="#1f2937"/><circle cx="30" cy="55" r="11" fill="#1f2937"/>
  </g>`;
}

function passport(x, y) {
  return `<g transform="translate(${x} ${y}) rotate(-8)">
    <rect x="-70" y="-95" width="140" height="190" rx="14" fill="#203a70"/>
    <circle cx="0" cy="-12" r="28" fill="none" stroke="#f5d36b" stroke-width="8"/>
    <path d="M-32-12h64M0-40v56" stroke="#f5d36b" stroke-width="6"/>
    <rect x="-42" y="48" width="84" height="10" rx="5" fill="#f5d36b"/>
  </g>`;
}

function receipt(x, y) {
  return `<g transform="translate(${x} ${y}) rotate(5)">
    <path d="M-62-112h124v224l-18-12-18 12-18-12-18 12-18-12-18 12-18-12z" fill="#fff" stroke="#d0d5dd" stroke-width="5"/>
    <circle cx="-28" cy="-48" r="12" fill="#b85c2d"/><circle cx="28" cy="-48" r="12" fill="#b85c2d"/>
    <rect x="-38" y="-4" width="76" height="12" rx="6" fill="#98a2b3"/>
    <rect x="-38" y="28" width="76" height="12" rx="6" fill="#98a2b3"/>
  </g>`;
}

function photoCard(x, y) {
  return `<g transform="translate(${x} ${y}) rotate(-5)">
    <rect x="-95" y="-120" width="190" height="240" rx="18" fill="#fff" stroke="#d0d5dd" stroke-width="5"/>
    <rect x="-75" y="-98" width="150" height="142" rx="12" fill="#dff2ff"/>
    ${person(0, 30, .42, "#567c52", "#263246")}
    <rect x="-52" y="68" width="104" height="14" rx="7" fill="#98a2b3"/>
  </g>`;
}

const scenes = {
  "shengao.svg": svg(`${person(430, 420, 1.22, "#567c52")}<path d="M610 170v360" stroke="#2f7d28" stroke-width="10" stroke-linecap="round"/><path d="M570 170h80M570 530h80" stroke="#2f7d28" stroke-width="10" stroke-linecap="round"/><g fill="#2f7d28" opacity=".18"><circle cx="610" cy="220" r="18"/><circle cx="610" cy="315" r="18"/><circle cx="610" cy="410" r="18"/></g>${person(820, 455, .85, "#7895c8")}`, "#2f7d28"),
  "shou.svg": svg(`${person(500, 430, .92, "#4f6f52")}<ellipse cx="500" cy="340" rx="72" ry="205" fill="none" stroke="#d47b54" stroke-width="10" opacity=".55"/>${person(780, 445, 1.05, "#7b8b9e")}<ellipse cx="780" cy="348" rx="118" ry="210" fill="none" stroke="#98a2b3" stroke-width="8" opacity=".4"/>`, "#d47b54"),
  "xingli.svg": svg(`${suitcase(420, 450, "#344054")}${suitcase(585, 455, "#5f6f52")}${suitcase(750, 448, "#9a5f4d")}${person(925, 430, .9, "#496b9f")}`, "#5f6f52"),
  "xiangzi.svg": svg(`${suitcase(520, 440, "#344054")}<g transform="translate(760 430)">${suitcase(0, 0, "#b85c2d")}</g><path d="M428 285h184v40H428z" fill="#ffffff" stroke="#d0d5dd" stroke-width="5"/>`, "#b85c2d"),
  "haoma.svg": svg(`${receipt(475, 390)}<g transform="translate(755 390)"><rect x="-95" y="-80" width="190" height="160" rx="22" fill="#fff" stroke="#98a2b3" stroke-width="6"/><circle cx="-45" cy="-12" r="18" fill="#2f7d28"/><circle cx="0" cy="-12" r="18" fill="#2f7d28"/><circle cx="45" cy="-12" r="18" fill="#2f7d28"/><rect x="-58" y="38" width="116" height="12" rx="6" fill="#98a2b3"/></g>`, "#2f7d28"),
  "huzhao.svg": svg(`${passport(510, 382)}${suitcase(735, 470, "#344054")}<path d="M610 400c48 36 88 46 136 34" fill="none" stroke="#2f7d28" stroke-width="10" stroke-linecap="round"/>`, "#203a70"),
  "zhongjian.svg": svg(`${person(425, 440, .85, "#7895c8")}${person(640, 410, 1.05, "#b85c2d")}${person(855, 440, .85, "#567c52")}<ellipse cx="640" cy="350" rx="120" ry="245" fill="none" stroke="#b85c2d" stroke-width="12" opacity=".45"/>`, "#b85c2d"),
  "duan.svg": svg(`${person(520, 430, 1.0, "#567c52", "#263246", "#1f2937")}<path d="M484 298c26-55 87-45 111 0" stroke="#b85c2d" stroke-width="12" fill="none" stroke-linecap="round"/><g transform="translate(795 410) scale(.95)"><circle cx="0" cy="-118" r="38" fill="#f0c7aa"/><path d="M-62-115c16-74 108-78 127 2 0 70-29 106-65 114-38-7-62-46-62-116z" fill="#594037"/><path d="M-43-72h86l26 170h-138z" fill="#7895c8"/><path d="M-38 98h35v142h-44zM3 98h35l12 142h-44z" fill="#263246"/></g>`, "#b85c2d"),
  "toufa.svg": svg(`${person(455, 430, 1.0, "#496b9f", "#263246", "#1f2937")}<g transform="translate(720 415) scale(1.02)"><circle cx="0" cy="-118" r="38" fill="#f0c7aa"/><path d="M-58-112c18-78 113-76 130 2-4 68-33 108-72 118-42-8-65-48-58-120z" fill="#5a3c2d"/><path d="M-43-72h86l26 170h-138z" fill="#567c52"/><path d="M-38 98h35v142h-44zM3 98h35l12 142h-44z" fill="#263246"/></g><path d="M405 290c58-48 105-46 151 0M660 262c62-70 128-70 186 2" stroke="#b85c2d" stroke-width="10" fill="none" opacity=".7"/>`, "#5a3c2d"),
  "nianqing.svg": svg(`${person(470, 430, .86, "#7895c8")}<g transform="translate(780 430) scale(1.06)"><circle cx="0" cy="-118" r="38" fill="#f0c7aa"/><path d="M-39-122c10-38 58-49 83-15-2-34-32-52-66-45-31 7-48 30-49 60z" fill="#2b241f"/><path d="M-43-72h86l26 170h-138z" fill="#567c52"/><path d="M-38 98h35v142h-44zM3 98h35l12 142h-44z" fill="#263246"/></g><circle cx="780" cy="310" r="92" fill="none" stroke="#2f7d28" stroke-width="10" opacity=".35"/>`, "#2f7d28"),
  "bujian.svg": svg(`${suitcase(430, 450, "#344054")}<g opacity=".24">${suitcase(735, 450, "#344054")}</g><path d="M670 342l130 150M800 342L670 492" stroke="#b85c2d" stroke-width="15" stroke-linecap="round"/>${person(940, 430, .82, "#7895c8")}`, "#b85c2d"),
  "dai.svg": svg(`${person(430, 430, .92, "#496b9f")}${person(730, 430, .92, "#567c52")}${suitcase(610, 470, "#344054")}<path d="M520 360c52 42 105 42 158 0" stroke="#2f7d28" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M666 338l24 24-31 9" fill="none" stroke="#2f7d28" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`, "#2f7d28"),
  "zhaopian.svg": svg(`${photoCard(520, 370)}<g transform="translate(780 380) rotate(6)">${photoCard(0,0)}</g><path d="M648 250c48-20 98-18 145 4" stroke="#2f7d28" stroke-width="10" fill="none" stroke-linecap="round"/>`, "#2f7d28")
};

for (const [name, content] of Object.entries(scenes)) {
  fs.writeFileSync(path.join(outDir, name), content, "utf8");
}

console.log(`Wrote ${Object.keys(scenes).length} HSK3-L01 vocabulary SVGs to ${outDir}`);
