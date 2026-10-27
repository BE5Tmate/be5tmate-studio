export const RATIOS = {
  '3:4': { w: 900, h: 1200, label: '3:4', hint: '小红书首选' },
  '16:9': { w: 1280, h: 720, label: '16:9', hint: '视频号 / 公众号' },
  '1:1': { w: 1000, h: 1000, label: '1:1', hint: '通用方图' },
};

export const PLATFORMS = ['小红书', '微信贴图', '视频号', '抖音号', '微信公众号'];

export const THEMES = {
  swiss: {
    name: '瑞士风格',
    en: 'SWISS',
    bg: '#eeeae1',
    ink: '#141414',
    muted: '#6e6b64',
    accent: '#e8ff47',
    accentInk: '#151515',
    surface: '#f8f6f0',
    font: 'Arial, sans-serif',
    radius: 0,
    pattern: 'grid',
  },
  y2k: {
    name: 'Y2K',
    en: 'Y2K',
    bg: '#d9d5ff',
    ink: '#171321',
    muted: '#625b77',
    accent: '#ff5cc8',
    accentInk: '#ffffff',
    surface: '#f0edff',
    font: 'Arial, sans-serif',
    radius: 28,
    pattern: 'dots',
  },
  bauhaus: {
    name: '包豪斯',
    en: 'BAUHAUS',
    bg: '#f1e8d5',
    ink: '#17263a',
    muted: '#6b675f',
    accent: '#ee5038',
    accentInk: '#ffffff',
    surface: '#faf4e8',
    font: 'Arial, sans-serif',
    radius: 0,
    pattern: 'bauhaus',
  },
  brutal: {
    name: '新野兽派',
    en: 'BRUTAL',
    bg: '#f4f1e8',
    ink: '#0a0a0a',
    muted: '#4c4a45',
    accent: '#7c5cff',
    accentInk: '#ffffff',
    surface: '#ffffff',
    font: 'Arial Black, Arial, sans-serif',
    radius: 0,
    pattern: 'cross',
  },
  memphis: {
    name: '孟菲斯',
    en: 'MEMPHIS',
    bg: '#fff4df',
    ink: '#242038',
    muted: '#746e7c',
    accent: '#18c8b8',
    accentInk: '#102928',
    surface: '#ffffff',
    font: 'Arial, sans-serif',
    radius: 18,
    pattern: 'memphis',
  },
  deco: {
    name: '装饰艺术',
    en: 'ART DECO',
    bg: '#122c2a',
    ink: '#f4e7c5',
    muted: '#a89f8b',
    accent: '#d7b56d',
    accentInk: '#152927',
    surface: '#1a3935',
    font: 'Georgia, serif',
    radius: 0,
    pattern: 'deco',
  },
  cassette: {
    name: '卡带未来主义',
    en: 'CASSETTE',
    bg: '#202126',
    ink: '#eff1e8',
    muted: '#9fa09b',
    accent: '#ff794d',
    accentInk: '#211d1b',
    surface: '#2c2e34',
    font: 'Courier New, monospace',
    radius: 6,
    pattern: 'scan',
  },
  vapor: {
    name: '蒸汽波',
    en: 'VAPORWAVE',
    bg: '#241b46',
    ink: '#fdf2ff',
    muted: '#baadd0',
    accent: '#68f6e6',
    accentInk: '#1c3340',
    surface: '#33265b',
    font: 'Arial, sans-serif',
    radius: 16,
    pattern: 'vapor',
  },
};

export const TEMPLATES = [
  { id: 'player', name: '球员数据卡', en: 'PLAYER PROFILE', icon: 'UserRound' },
  { id: 'match', name: '比赛战报卡', en: 'MATCH REPORT', icon: 'Trophy' },
  { id: 'lineup', name: '首发阵容卡', en: 'STARTING SIX', icon: 'UsersRound' },
  { id: 'stats', name: '技术统计卡', en: 'MATCH STATS', icon: 'ChartNoAxesColumn' },
  { id: 'mvp', name: '赛后 MVP 卡', en: 'MVP OF THE MATCH', icon: 'Medal' },
  { id: 'compare', name: '球员对比卡', en: 'HEAD TO HEAD', icon: 'Columns2' },
  { id: 'cover', name: '赛事封面卡', en: 'CLUB & EVENT', icon: 'GalleryVerticalEnd' },
  { id: 'carousel', name: '图文轮播卡', en: 'EDITORIAL STORY', icon: 'PanelsTopLeft' },
  { id: 'collage', name: '多卡拼贴卡', en: 'VISUAL COLLAGE', icon: 'LayoutGrid' },
];

const athleteSvg = (accent = '#e8ff47', bg = '#20211f') =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 780">
<defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="${bg}"/><stop offset="1" stop-color="#494b43"/></linearGradient><filter id="s"><feDropShadow dx="0" dy="16" stdDeviation="12" flood-opacity=".28"/></filter></defs>
<rect width="600" height="780" fill="url(#g)"/>
<circle cx="460" cy="150" r="210" fill="${accent}" opacity=".92"/>
<path d="M-40 670L640 330M-40 740L640 400" stroke="#fff" stroke-opacity=".08" stroke-width="1"/>
<g filter="url(#s)" transform="translate(20 10)">
<ellipse cx="310" cy="724" rx="170" ry="22" fill="#000" opacity=".22"/>
<path d="M308 196c-46 0-72 37-67 82 4 39 26 62 63 62 43 0 66-33 63-78-3-42-21-66-59-66z" fill="#ad7657"/>
<path d="M244 252c2-72 100-102 132-32 10 20 6 49 1 63-8-34-15-46-33-60-26 26-57 31-100 29z" fill="#171817"/>
<path d="M251 316c33-24 86-19 111 12l42 106-47 102-126-12-39-103z" fill="#f4f1e8"/>
<path d="M245 323c22-17 42-22 60-22l-8 226-66-3-39-103z" fill="${accent}"/>
<path d="M238 329c-23 7-37 26-49 47L90 502l37 25 113-104z" fill="#ad7657"/>
<path d="M365 329c24 9 32 31 46 52l77 97-34 30-105-87z" fill="#ad7657"/>
<path d="M86 496c-20 15-27 31-18 41 12 12 38 4 60-16zM490 472c23 10 37 24 30 36-9 15-37 11-65 0z" fill="#ad7657"/>
<path d="M231 520l126 10 30 91-67 15-19-66-4 70-75-3z" fill="#1b1c1b"/>
<path d="M225 624l73 5-28 105-63-3zM323 624l62-14 48 100-57 22z" fill="#ad7657"/>
<path d="M207 717l66 3 4 28-96 1c-8-17 5-28 26-32zM373 714l58-20 18 25-76 47c-16-6-16-30 0-52z" fill="#f2f0e8"/>
<path d="M274 347h63v94h-63z" fill="#151515" opacity=".92"/>
<text x="306" y="420" text-anchor="middle" font-family="Arial" font-weight="900" font-size="72" fill="${accent}">08</text>
</g>
<g transform="translate(468 78) rotate(18)"><circle r="43" fill="#f8f6ed"/><path d="M-35-24C-4-24 9-7 9 40M-4-42C17-20 34-14 42-12M-42 6C-14 0 7 8 25 29" fill="none" stroke="#a4a399" stroke-width="3"/></g>
<text x="32" y="54" font-family="Arial" font-size="13" letter-spacing="4" fill="#fff" opacity=".65">BE5TMATE / ORIGINAL ATHLETE</text>
</svg>`)}`;

export function createTemplate(templateId = 'player', ratio = '3:4', themeId = 'swiss') {
  const theme = THEMES[themeId];
  const landscape = ratio === '16:9';
  const square = ratio === '1:1';
  const template = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
  const name =
    templateId === 'mvp'
      ? 'MVP · ZHU'
      : templateId === 'match'
        ? 'VICTORY'
        : templateId === 'lineup'
          ? 'STARTING SIX'
          : templateId === 'stats'
            ? 'BY THE NUMBERS'
            : templateId === 'compare'
              ? 'HEAD TO HEAD'
              : templateId === 'cover'
                ? 'GAME DAY'
                : templateId === 'carousel'
                  ? 'THE NEXT POINT'
                  : templateId === 'collage'
                    ? 'MATCH IN FRAMES'
                    : 'ZHU TING';
  const subtitle =
    templateId === 'match'
      ? '3 — 1  /  FULL TIME'
      : templateId === 'stats'
        ? 'TEAM PERFORMANCE'
        : templateId === 'compare'
          ? 'TWO PLAYERS. ONE COURT.'
          : template.en;
  const img = athleteSvg(theme.accent, theme.bg === '#eeeae1' ? '#252622' : theme.surface);
  const titleLength = name.replace(/\s/g, '').length;
  const titleSize = landscape
    ? titleLength > 12
      ? 44
      : titleLength > 9
        ? 52
        : 64
    : titleLength > 12
      ? 60
      : titleLength > 9
        ? 74
        : 92;
  const elements = [
    {
      id: 'brand-line',
      type: 'line',
      x: 6,
      y: 11,
      w: 88,
      h: 0,
      role: 'ink',
      opacity: 24,
      locked: true,
    },
    {
      id: 'brand',
      type: 'text',
      x: 12,
      y: 6.8,
      w: 36,
      h: 4,
      text: 'BE5Tmate',
      fontSize: 28,
      weight: 800,
      role: 'ink',
      letterSpacing: -1,
    },
    {
      id: 'avatar',
      type: 'image',
      x: 6,
      y: 4.6,
      w: 4.6,
      h: 4.6 * (landscape ? 1280 / 720 : square ? 1 : 900 / 1200),
      src: athleteSvg(theme.accent, theme.bg),
      shape: 'circle',
      name: '账户头像',
      isAvatar: true,
    },
    {
      id: 'issue',
      type: 'text',
      x: 70,
      y: 7,
      w: 24,
      h: 3,
      text: 'VOL. 026  /  2026',
      fontSize: 13,
      weight: 600,
      align: 'right',
      role: 'muted',
      letterSpacing: 1.6,
    },
    {
      id: 'eyebrow',
      type: 'text',
      x: 6,
      y: landscape ? 17 : 15,
      w: 44,
      h: 3,
      text: subtitle,
      fontSize: 15,
      weight: 700,
      role: 'ink',
      letterSpacing: 2.4,
    },
    {
      id: 'title',
      type: 'text',
      x: 6,
      y: landscape ? 23 : 20,
      w: landscape ? 50 : 70,
      h: 12,
      text: name,
      fontSize: titleSize,
      weight: 900,
      role: 'ink',
      letterSpacing: -4,
      name: '主标题',
    },
    {
      id: 'subcopy',
      type: 'text',
      x: 6,
      y: landscape ? 38.5 : 29,
      w: landscape ? 35 : 48,
      h: 5,
      text: 'OUTSIDE HITTER  ·  NO. 08',
      fontSize: 16,
      weight: 600,
      role: 'muted',
      letterSpacing: 1.4,
    },
    {
      id: 'hero',
      type: 'image',
      x: landscape ? 64 : 46,
      y: landscape ? 17 : 32,
      w: landscape ? 27 : 48,
      h: landscape ? 47 : 38,
      src: img,
      shape: 'round',
      name: '球员主体图',
    },
    {
      id: 'number',
      type: 'text',
      x: landscape ? 66 : 72,
      y: landscape ? 10 : 26,
      w: 22,
      h: 10,
      text: '08',
      fontSize: landscape ? 88 : 124,
      weight: 900,
      role: 'accent',
      stroke: 'ink',
      align: 'right',
      letterSpacing: -8,
      opacity: 95,
    },
    {
      id: 'accent-block',
      type: 'rect',
      x: 6,
      y: landscape ? 47 : 57,
      w: landscape ? 44 : 27,
      h: landscape ? 6 : 4,
      role: 'accent',
    },
    {
      id: 'quote',
      type: 'text',
      x: 7.5,
      y: landscape ? 48 : 57.7,
      w: landscape ? 42 : 29,
      h: 5,
      text:
        templateId === 'match'
          ? '25 / 21 / 25 / 22'
          : templateId === 'stats'
            ? 'ATTACK  48%   ·   BLOCK  12'
            : 'POWER IN EVERY POINT.',
      fontSize: 17,
      weight: 800,
      role: 'accentInk',
      letterSpacing: 0.4,
    },
    {
      id: 'metric1',
      type: 'metric',
      x: 6,
      y: landscape ? 65 : 72,
      w: landscape ? 20 : 27,
      h: 13,
      label: templateId === 'match' ? 'TOTAL POINTS' : 'POINTS / 得分',
      value: templateId === 'stats' ? '98' : '24',
      suffix: 'PTS',
      role: 'ink',
      name: '核心数据 1',
    },
    {
      id: 'metric2',
      type: 'metric',
      x: landscape ? 29 : 36,
      y: landscape ? 65 : 72,
      w: landscape ? 20 : 27,
      h: 13,
      label: 'ATTACK / 扣球成功率',
      value: '48',
      suffix: '%',
      role: 'ink',
      name: '核心数据 2',
    },
    {
      id: 'metric3',
      type: 'metric',
      x: landscape ? 52 : 66,
      y: landscape ? 65 : 72,
      w: landscape ? 20 : 27,
      h: 13,
      label: 'BLOCKS / 拦网',
      value: '06',
      suffix: 'BLK',
      role: 'ink',
      name: '核心数据 3',
    },
    {
      id: 'chart-bg',
      type: 'rect',
      x: 6,
      y: landscape ? 78 : 88,
      w: 88,
      h: 0.2,
      role: 'ink',
      opacity: 0.18,
    },
    {
      id: 'matchinfo',
      type: 'text',
      x: 6,
      y: landscape ? 82 : 91,
      w: 60,
      h: 4,
      text: 'ITALY SERIE A1   ·   2026/27 SEASON   ·   ROUND 08',
      fontSize: 13,
      weight: 700,
      role: 'muted',
      letterSpacing: 1.1,
    },
    {
      id: 'footer',
      type: 'text',
      x: 6,
      y: landscape ? 92 : 96,
      w: 50,
      h: 3,
      text: '@//be5tmate/ 出品',
      fontSize: 15,
      weight: 700,
      role: 'ink',
      locked: true,
      name: '品牌落款',
    },
    {
      id: 'page',
      type: 'text',
      x: 82,
      y: landscape ? 92 : 96,
      w: 12,
      h: 3,
      text: '01 / 05',
      fontSize: 13,
      weight: 600,
      role: 'muted',
      align: 'right',
    },
  ];
  if (templateId === 'compare') {
    elements.find(e => e.id === 'hero').w = landscape ? 38 : 55;
    elements.push({
      id: 'versus',
      type: 'text',
      x: 7,
      y: landscape ? 41 : 42,
      w: 28,
      h: 8,
      text: 'VS',
      fontSize: 68,
      weight: 900,
      role: 'accent',
    });
  }
  if (templateId === 'collage') {
    elements.push({
      id: 'hero2',
      type: 'image',
      x: landscape ? 56 : 39,
      y: landscape ? 49 : 57,
      w: landscape ? 18 : 26,
      h: landscape ? 34 : 23,
      src: img,
      shape: 'round',
      name: '拼贴图片 2',
      rotation: -3,
    });
    elements.push({
      id: 'hero3',
      type: 'image',
      x: landscape ? 76 : 68,
      y: landscape ? 49 : 57,
      w: landscape ? 18 : 26,
      h: landscape ? 34 : 23,
      src: img,
      shape: 'round',
      name: '拼贴图片 3',
      rotation: 3,
    });
  }
  if (square) {
    elements.find(e => e.id === 'hero').x = 50;
    elements.find(e => e.id === 'hero').y = 31;
    elements.find(e => e.id === 'hero').w = 44;
    elements.find(e => e.id === 'hero').h = 41;
    elements.find(e => e.id === 'subcopy').y = 31;
    elements.find(e => e.id === 'quote').y = 60;
    elements.find(e => e.id === 'accent-block').y = 59;
  }
  if (templateId === 'collage') {
    const hero = elements.find(e => e.id === 'hero');
    const hero2 = elements.find(e => e.id === 'hero2');
    const hero3 = elements.find(e => e.id === 'hero3');
    if (landscape) {
      Object.assign(hero, { x: 64, y: 16, w: 27, h: 30 });
      Object.assign(hero2, { x: 64, y: 47.5, w: 12.5, h: 15.5 });
      Object.assign(hero3, { x: 78.5, y: 47.5, w: 12.5, h: 15.5 });
    } else if (square) {
      Object.assign(hero, { x: 50, y: 31, w: 44, h: 23 });
      Object.assign(hero2, { x: 50, y: 55.5, w: 21, h: 15.5 });
      Object.assign(hero3, { x: 73, y: 55.5, w: 21, h: 15.5 });
    } else {
      Object.assign(hero, { x: 46, y: 31, w: 48, h: 24.5 });
      Object.assign(hero2, { x: 46, y: 56.5, w: 23, h: 13 });
      Object.assign(hero3, { x: 71, y: 56.5, w: 23, h: 13 });
    }
  }
  return {
    id: `project-${Date.now()}`,
    name: template.name.replace('卡', ''),
    templateId,
    ratio,
    platform: '小红书',
    themeId,
    background: theme.bg,
    groupOpacity: 100,
    groupBlur: 0,
    elements,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createAthlete(accent, bg) {
  return athleteSvg(accent, bg);
}
