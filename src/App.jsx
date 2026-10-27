import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlignLeft, Archive, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, BarChart3,
  Check, ChevronDown, ChevronLeft, ChevronRight, Circle, CircleHelp, Clock3,
  Cloud, Columns2, Copy, Download, Eye, EyeOff, FileImage, FlipHorizontal2,
  FolderOpen, GalleryVerticalEnd, Grid2X2, GripVertical, Image as ImageIcon,
  Images, Layers3, LayoutGrid, LayoutTemplate, Lock, Medal, Menu, Minus,
  MoreHorizontal, MousePointer2, PanelLeftClose, PanelsTopLeft, Plus, Redo2,
  RotateCcw, RotateCw, Search, Settings2, Shapes, SlidersHorizontal, Sparkles,
  Square, Star, Trash2, Trophy, Type, Undo2, Unlock, Upload, UserRound,
  UsersRound, X, Zap, ChartNoAxesColumn, Maximize2, Blend, BoxSelect,
} from 'lucide-react';
import { createAthlete, createTemplate, PLATFORMS, RATIOS, TEMPLATES, THEMES } from './data.js';
import { exportArtboard, makeThumbnail } from './export.js';

const iconMap = { UserRound, Trophy, UsersRound, ChartNoAxesColumn, Medal, Columns2, GalleryVerticalEnd, PanelsTopLeft, LayoutGrid };
const uid = () => `el-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const deepCopy = value => JSON.parse(JSON.stringify(value));

function readStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}

const initialProject = () => {
  const draft = readStorage('be5tmate-draft', null);
  return draft?.elements?.length ? draft : createTemplate();
};

function IconButton({ children, title, active, className = '', ...props }) {
  return <button className={`icon-button ${active ? 'active' : ''} ${className}`} title={title} aria-label={title} {...props}>{children}</button>;
}

function RangeField({ label, value, min = 0, max = 100, step = 1, unit = '', onChange }) {
  return <label className="range-field"><span><b>{label}</b><output>{value}{unit}</output></span><input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} /></label>;
}

function Field({ label, children, className = '' }) {
  return <label className={`field ${className}`}><span>{label}</span>{children}</label>;
}

function SectionTitle({ children, action }) {
  return <div className="section-title"><span>{children}</span>{action}</div>;
}

function BackgroundDecor({ theme, w, h }) {
  const line = theme.ink;
  if (theme.pattern === 'grid') return <g opacity=".055" stroke={line} strokeWidth="1">{[25, 50, 75].map(v => <line key={`v${v}`} x1={w * v / 100} y1="0" x2={w * v / 100} y2={h} />)}{[25, 50, 75].map(v => <line key={`h${v}`} x1="0" y1={h * v / 100} x2={w} y2={h * v / 100} />)}</g>;
  if (theme.pattern === 'dots') return <g fill={theme.ink} opacity=".1">{Array.from({ length: 70 }, (_, i) => <circle key={i} cx={(i % 10) * w / 9} cy={Math.floor(i / 10) * h / 6} r="2" />)}</g>;
  if (theme.pattern === 'bauhaus') return <g opacity=".14"><circle cx={w * .92} cy={h * .72} r={w * .15} fill={theme.accent} /><path d={`M0 ${h * .45}L${w * .23} ${h * .68}L0 ${h * .68}Z`} fill={theme.ink} /></g>;
  if (theme.pattern === 'cross') return <g stroke={theme.ink} strokeWidth="2" opacity=".1">{[12, 88].map(x => <g key={x}><line x1={w * x / 100 - 12} y1={h * .15} x2={w * x / 100 + 12} y2={h * .15} /><line x1={w * x / 100} y1={h * .15 - 12} x2={w * x / 100} y2={h * .15 + 12} /></g>)}</g>;
  if (theme.pattern === 'memphis') return <g fill="none" stroke={theme.ink} opacity=".13" strokeWidth="3"><path d={`M${w * .82} ${h * .12}q30-30 60 0t60 0`} /><path d={`M${w * .04} ${h * .77}l20-20 20 20 20-20 20 20`} /><circle cx={w * .88} cy={h * .83} r="24" /></g>;
  if (theme.pattern === 'deco') return <g fill="none" stroke={theme.accent} opacity=".22"><path d={`M${w * .78} 0V${h * .13}L${w} ${h * .25}M${w * .85} 0V${h * .1}L${w} ${h * .18}`} /><path d={`M0 ${h * .78}L${w * .16} ${h}M0 ${h * .86}L${w * .08} ${h}`} /></g>;
  if (theme.pattern === 'scan') return <g stroke={theme.ink} opacity=".035">{Array.from({ length: 32 }, (_, i) => <line key={i} x1="0" y1={i * h / 32} x2={w} y2={i * h / 32} />)}</g>;
  if (theme.pattern === 'vapor') return <g fill="none" stroke={theme.accent} opacity=".12"><circle cx={w * .82} cy={h * .2} r={w * .13} /><path d={`M0 ${h * .75}Q${w * .25} ${h * .55} ${w * .5} ${h * .75}T${w} ${h * .75}`} /></g>;
  return null;
}

function SvgElement({ el, project, theme, w, h, selected, onPointerDown, onDoubleClick }) {
  const x = el.x * w / 100;
  const y = el.y * h / 100;
  const width = el.w * w / 100;
  const height = el.h * h / 100;
  const color = role => el.fill || theme[role] || role || theme.ink;
  const fs = (el.fontSize || 20) * w / 900;
  const opacity = clamp((el.opacity ?? 100) / 100, 0, 1);
  const transform = `rotate(${el.rotation || 0} ${x + width / 2} ${y + height / 2})`;
  const common = { opacity, transform, onPointerDown: e => onPointerDown(e, el), onDoubleClick: e => onDoubleClick(e, el), className: `svg-element ${el.locked ? 'locked' : ''}`, 'data-id': el.id };
  if (el.hidden) return null;
  let content;
  if (el.type === 'text') {
    const anchor = el.align === 'right' ? 'end' : el.align === 'center' ? 'middle' : 'start';
    const tx = el.align === 'right' ? x + width : el.align === 'center' ? x + width / 2 : x;
    content = <text {...common} x={tx} y={y + fs * .82} fill={color(el.role || 'ink')} stroke={el.stroke ? color(el.stroke) : undefined} strokeWidth={el.stroke ? Math.max(1.2, fs * .018) : undefined} paintOrder="stroke" strokeLinejoin="round" fontFamily={theme.font} fontSize={fs} fontWeight={el.weight || 500} letterSpacing={(el.letterSpacing || 0) * w / 900} textAnchor={anchor} style={{ userSelect: 'none' }}>{el.text}</text>;
  } else if (el.type === 'image') {
    const filter = `brightness(${el.brightness ?? 100}%) contrast(${el.contrast ?? 100}%) saturate(${el.saturation ?? 100}%) blur(${el.blur || 0}px)`;
    const clipId = `clip-${el.id}`;
    const rx = el.shape === 'round' ? (el.radius ?? theme.radius) * w / 900 : 0;
    content = <g {...common} style={{ filter }}><defs><clipPath id={clipId}>{el.shape === 'circle' ? <ellipse cx={x + width / 2} cy={y + height / 2} rx={width / 2} ry={height / 2} /> : <rect x={x} y={y} width={width} height={height} rx={rx} />}</clipPath></defs><g clipPath={`url(#${clipId})`} transform={el.flip ? `translate(${2 * x + width} 0) scale(-1 1)` : undefined}><image href={el.src} x={x} y={y} width={width} height={height} preserveAspectRatio="xMidYMid slice" /></g>{el.border > 0 && <rect x={x} y={y} width={width} height={height} rx={rx} fill="none" stroke={el.borderColor || theme.ink} strokeWidth={el.border} />}</g>;
  } else if (el.type === 'rect') {
    content = <rect {...common} x={x} y={y} width={width} height={height} rx={(el.radius ?? theme.radius) * w / 900} fill={color(el.role || 'accent')} />;
  } else if (el.type === 'circle') {
    content = <ellipse {...common} cx={x + width / 2} cy={y + height / 2} rx={width / 2} ry={height / 2} fill={color(el.role || 'accent')} />;
  } else if (el.type === 'line') {
    content = <line {...common} x1={x} y1={y} x2={x + width} y2={y} stroke={color(el.role || 'ink')} strokeWidth={el.strokeWidth || 1} />;
  } else if (el.type === 'metric') {
    const numericValue = parseFloat(el.value) || 0;
    const chartType = el.chartType || 'number';
    const radarCenter = { x: x + height * .31, y: y + height * .37 };
    const radarRadius = height * .28;
    const radarPoints = Array.from({ length: 5 }, (_, index) => {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / 5;
      const factor = [.55, .8, .62, .9, .7][index];
      return [radarCenter.x + Math.cos(angle) * radarRadius * factor, radarCenter.y + Math.sin(angle) * radarRadius * factor];
    });
    const trendValues = [.3, .48, .4, .72, .66, .92];
    const trendPoints = trendValues.map((value, index) => [x + width * .05 + index * width * .15, y + height * .68 - value * height * .42]);
    content = <g {...common}>
      {chartType === 'ring' ? <>
        <circle cx={x + height * .31} cy={y + height * .36} r={height * .27} fill={color('surface')} fillOpacity=".6" />
        <circle cx={x + height * .31} cy={y + height * .36} r={height * .27} fill="none" stroke={color('ink')} strokeOpacity=".16" strokeWidth={9 * w / 900} />
        <circle cx={x + height * .31} cy={y + height * .36} r={height * .27} fill="none" stroke={color('accent')} strokeWidth={9 * w / 900} strokeLinecap="round" strokeDasharray={`${clamp(numericValue, 0, 100) / 100 * 2 * Math.PI * height * .27} ${2 * Math.PI * height * .27}`} transform={`rotate(-90 ${x + height * .31} ${y + height * .36})`} />
        <text x={x + height * .31} y={y + height * .44} textAnchor="middle" fill={color(el.role || 'ink')} fontFamily={theme.font} fontSize={26 * w / 900} fontWeight="900">{el.value}<tspan fontSize={9 * w / 900}>{el.suffix}</tspan></text>
      </> : chartType === 'radar' ? <>
        {[.45, .7, 1].map((size, index) => <polygon key={index} points={Array.from({ length: 5 }, (_, i) => { const angle = -Math.PI / 2 + i * Math.PI * 2 / 5; return `${radarCenter.x + Math.cos(angle) * radarRadius * size},${radarCenter.y + Math.sin(angle) * radarRadius * size}`; }).join(' ')} fill="none" stroke={color('ink')} strokeOpacity=".13" strokeWidth={1.2 * w / 900} />)}
        {Array.from({ length: 5 }, (_, i) => { const angle = -Math.PI / 2 + i * Math.PI * 2 / 5; return <line key={i} x1={radarCenter.x} y1={radarCenter.y} x2={radarCenter.x + Math.cos(angle) * radarRadius} y2={radarCenter.y + Math.sin(angle) * radarRadius} stroke={color('ink')} strokeOpacity=".1" strokeWidth={1 * w / 900} />; })}
        <polygon points={radarPoints.map(point => point.join(',')).join(' ')} fill={color('accent')} fillOpacity=".32" stroke={color('ink')} strokeWidth={2 * w / 900} strokeLinejoin="round" />
      </> : chartType === 'trend' ? <>
        {[.25, .5, .75].map((position, index) => <line key={index} x1={x + width * .05} y1={y + position * height * .7} x2={x + width * .9} y2={y + position * height * .7} stroke={color('ink')} strokeOpacity=".09" strokeWidth={1 * w / 900} />)}
        <polyline points={trendPoints.map(point => point.join(',')).join(' ')} fill="none" stroke={color('accent')} strokeWidth={5 * w / 900} strokeLinejoin="round" strokeLinecap="round" />
        <polyline points={`${x + width * .05},${y + height * .68} ${trendPoints.map(point => point.join(',')).join(' ')} ${x + width * .8},${y + height * .68}`} fill={color('accent')} fillOpacity=".14" stroke="none" />
        {trendPoints.map((point, index) => <circle key={index} cx={point[0]} cy={point[1]} r={3 * w / 900} fill={color('surface')} stroke={color('ink')} strokeWidth={1.5 * w / 900} />)}
      </> : chartType === 'bars' ? <>
        <rect x={x} y={y + height * .42} width={width * .82} height={height * .15} rx={3 * w / 900} fill={color('muted')} opacity=".2" />
        <rect x={x} y={y + height * .42} width={width * .82 * clamp(numericValue, 0, 100) / 100} height={height * .15} rx={3 * w / 900} fill={color('accent')} />
        <text x={x} y={y + height * .29} fill={color(el.role || 'ink')} fontFamily={theme.font} fontSize={38 * w / 900} fontWeight="900">{el.value}<tspan fontSize={12 * w / 900} dx="4" fill={color('muted')}>{el.suffix}</tspan></text>
      </> : <>
        <text x={x} y={y + height * .58} fill={color(el.role || 'ink')} fontFamily={theme.font} fontSize={76 * w / 900} fontWeight="900" letterSpacing={-4 * w / 900}>{el.value}<tspan fontSize={19 * w / 900} letterSpacing="0" dx={7 * w / 900} fill={color('muted')}>{el.suffix}</tspan></text>
        <line x1={x} y1={y + height * .72} x2={x + width * .76} y2={y + height * .72} stroke={color('accent')} strokeWidth={4 * w / 900} />
      </>}
      <text x={x} y={y + height * .98} fill={color('muted')} fontFamily={theme.font} fontSize={12.5 * w / 900} fontWeight="700" letterSpacing={.9 * w / 900}>{el.label}</text>
    </g>;
  }
  return <>{content}{selected && <g className="selection-layer" pointerEvents="none"><rect x={x - 4} y={y - 4} width={Math.max(width + 8, 8)} height={Math.max(height + 8, 8)} fill="none" stroke="#7257ff" strokeWidth={1.5 * 900 / w} strokeDasharray={`${5 * 900 / w} ${3 * 900 / w}`} transform={transform} /><circle cx={x + width + 4} cy={y + height + 4} r={4 * 900 / w} fill="#7257ff" /></g>}</>;
}

function App() {
  const [project, setProject] = useState(initialProject);
  const [selectedId, setSelectedId] = useState('title');
  const [leftTab, setLeftTab] = useState('templates');
  const [rightTab, setRightTab] = useState('design');
  const [assets, setAssets] = useState([]);
  const [versions, setVersions] = useState(() => readStorage('be5tmate-versions', []));
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const [zoom, setZoom] = useState(100);
  const [showSafe, setShowSafe] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [fusionOpen, setFusionOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportFormats, setExportFormats] = useState(['png']);
  const [exportScale, setExportScale] = useState(2);
  const [transparent, setTransparent] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [historyView, setHistoryView] = useState('versions');
  const [toast, setToast] = useState(null);
  const [projectName, setProjectName] = useState(project.name);
  const [platformOpen, setPlatformOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState(null);
  const svgRef = useRef(null);
  const uploadRef = useRef(null);
  const avatarRef = useRef(null);
  const dragRef = useRef(null);
  const toastTimer = useRef(null);
  const theme = THEMES[project.themeId] || THEMES.swiss;
  const dimensions = RATIOS[project.ratio];
  const selected = project.elements.find(el => el.id === selectedId);
  const images = project.elements.filter(el => el.type === 'image' && !el.isAvatar);

  const notify = useCallback((message, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const snapshot = useCallback(() => {
    setPast(prev => [...prev.slice(-39), deepCopy(project)]);
    setFuture([]);
  }, [project]);

  const patchProject = useCallback((patch, record = true) => {
    if (record) snapshot();
    setProject(prev => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch), updatedAt: new Date().toISOString() }));
  }, [snapshot]);

  const updateElement = (id, patch, record = true) => {
    if (record) snapshot();
    setProject(prev => ({ ...prev, elements: prev.elements.map(el => el.id === id ? { ...el, ...(typeof patch === 'function' ? patch(el) : patch) } : el), updatedAt: new Date().toISOString() }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try { localStorage.setItem('be5tmate-draft', JSON.stringify(project)); } catch { /* storage quota: current session remains available */ }
    }, 500);
    return () => clearTimeout(timer);
  }, [project]);

  useEffect(() => { setProjectName(project.name); }, [project.name]);

  const undo = () => {
    if (!past.length) return;
    const previous = past[past.length - 1];
    setFuture(prev => [deepCopy(project), ...prev]);
    setPast(prev => prev.slice(0, -1));
    setProject(previous);
    notify('已撤销上一步');
  };

  const redo = () => {
    if (!future.length) return;
    setPast(prev => [...prev, deepCopy(project)]);
    setProject(future[0]);
    setFuture(prev => prev.slice(1));
    notify('已重做');
  };

  useEffect(() => {
    const handler = e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); saveVersion(); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selected && !selected.locked && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) deleteElement(selected.id);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const switchTemplate = id => {
    snapshot();
    setProject(createTemplate(id, project.ratio, project.themeId));
    setSelectedId('title');
    notify(`已应用「${TEMPLATES.find(t => t.id === id).name}」`);
  };

  const switchRatio = ratio => {
    if (ratio === project.ratio) return;
    snapshot();
    const fresh = createTemplate(project.templateId, ratio, project.themeId);
    const merged = fresh.elements.map(el => {
      const old = project.elements.find(item => item.id === el.id);
      if (!old) return el;
      const { x, y, w, h } = el;
      return { ...old, x, y, w, h };
    });
    const extras = project.elements.filter(old => !fresh.elements.some(el => el.id === old.id));
    setProject({ ...project, ratio, name: project.name, elements: [...merged, ...extras] });
    notify(`已切换为 ${ratio}，版式已自适应`);
  };

  const switchTheme = themeId => {
    snapshot();
    const nextTheme = THEMES[themeId];
    setProject(prev => ({
      ...prev, themeId, background: nextTheme.bg,
      elements: prev.elements.map(el => el.type === 'image' && !el.isAvatar && el.src?.startsWith('data:image/svg') ? { ...el, src: createAthlete(nextTheme.accent, nextTheme.surface) } : el),
    }));
    notify(`已切换「${nextTheme.name}」风格包`);
  };

  const addElement = type => {
    snapshot();
    const base = { id: uid(), x: 12, y: 45, w: 28, h: 10, rotation: 0, opacity: 100 };
    const el = type === 'text'
      ? { ...base, type, text: '双击编辑文字', fontSize: 34, weight: 800, role: 'ink', name: '新建文字' }
      : type === 'metric'
        ? { ...base, type, value: '18', suffix: 'PTS', label: 'NEW METRIC / 新数据', role: 'ink', name: '新建数据' }
        : type === 'circle'
          ? { ...base, type, w: 12, h: 9, role: 'accent', name: '圆形装饰' }
          : { ...base, type: 'rect', h: 5, role: 'accent', name: '几何色块' };
    setProject(prev => ({ ...prev, elements: [...prev.elements, el] }));
    setSelectedId(el.id);
    setRightTab('design');
  };

  const deleteElement = id => {
    const el = project.elements.find(item => item.id === id);
    if (!el || el.locked || el.isAvatar) return;
    snapshot();
    setProject(prev => ({ ...prev, elements: prev.elements.filter(item => item.id !== id) }));
    setSelectedId(null);
    notify('图层已删除');
  };

  const duplicateElement = id => {
    const source = project.elements.find(el => el.id === id);
    if (!source) return;
    snapshot();
    const copy = { ...deepCopy(source), id: uid(), x: source.x + 2, y: source.y + 2, locked: false, isAvatar: false, name: `${source.name || '图层'} 副本` };
    setProject(prev => ({ ...prev, elements: [...prev.elements, copy] }));
    setSelectedId(copy.id);
  };

  const moveLayer = (id, direction) => {
    snapshot();
    setProject(prev => {
      const index = prev.elements.findIndex(el => el.id === id);
      const target = clamp(index + direction, 0, prev.elements.length - 1);
      const elements = [...prev.elements];
      const [item] = elements.splice(index, 1);
      elements.splice(target, 0, item);
      return { ...prev, elements };
    });
  };

  const handleFiles = async (event, avatar = false) => {
    const files = Array.from(event.target.files || []).filter(file => file.type.startsWith('image/'));
    if (!files.length) return;
    const loaded = await Promise.all(files.map(file => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name, src: reader.result });
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    })));
    const valid = loaded.filter(Boolean);
    if (avatar) {
      updateElement(project.elements.find(el => el.isAvatar)?.id, { src: valid[0].src });
      notify('账户头像已替换');
    } else {
      snapshot();
      const additions = valid.map((file, index) => ({ id: uid(), type: 'image', name: file.name, src: file.src, x: 42 + index * 3, y: 36 + index * 3, w: 45, h: 35, shape: 'round', opacity: 100, rotation: 0 }));
      setAssets(prev => [...valid, ...prev]);
      setProject(prev => ({ ...prev, elements: [...prev.elements, ...additions] }));
      setSelectedId(additions[0].id);
      setLeftTab('assets');
      notify(`已添加 ${valid.length} 张图片，可继续排序与融合`);
    }
    event.target.value = '';
  };

  const onElementPointerDown = (e, el) => {
    e.stopPropagation();
    setSelectedId(el.id);
    if (el.locked || e.button !== 0) return;
    snapshot();
    const rect = svgRef.current.getBoundingClientRect();
    dragRef.current = { id: el.id, startX: e.clientX, startY: e.clientY, x: el.x, y: el.y, rect };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = e => {
    const drag = dragRef.current;
    if (!drag) return;
    const x = clamp(drag.x + (e.clientX - drag.startX) / drag.rect.width * 100, -10, 100);
    const y = clamp(drag.y + (e.clientY - drag.startY) / drag.rect.height * 100, -5, 100);
    updateElement(drag.id, { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }, false);
  };

  const onPointerUp = () => { dragRef.current = null; };

  const onDoubleClick = (e, el) => {
    e.stopPropagation();
    setSelectedId(el.id);
    setRightTab(el.type === 'metric' ? 'data' : 'design');
    setMobilePanel('right');
  };

  const saveVersion = async () => {
    let thumbnail = versions[0]?.project?.updatedAt === project.updatedAt ? versions[0].thumbnail : null;
    try { thumbnail = await makeThumbnail(svgRef.current); } catch { /* save vector state even if thumbnail fails */ }
    const entry = { id: uid(), name: projectName || project.name, date: new Date().toISOString(), thumbnail, favorite: false, archived: false, project: deepCopy({ ...project, name: projectName || project.name }) };
    const next = [entry, ...versions].slice(0, 30);
    setVersions(next);
    try { localStorage.setItem('be5tmate-versions', JSON.stringify(next)); } catch { notify('版本已保留在本次会话，本地空间不足', 'warning'); return; }
    notify('版本已保存，可随时回溯');
  };

  const restoreVersion = version => {
    snapshot();
    setProject(deepCopy(version.project));
    setHistoryOpen(false);
    notify(`已恢复「${version.name}」`);
  };

  const patchVersion = (id, patch) => {
    const next = versions.map(item => item.id === id ? { ...item, ...patch } : item);
    setVersions(next);
    try { localStorage.setItem('be5tmate-versions', JSON.stringify(next)); } catch { /* no-op */ }
  };

  const doExport = async () => {
    if (!exportFormats.length) return notify('请至少选择一种导出格式', 'warning');
    setExporting(true);
    try {
      for (const format of exportFormats) {
        await exportArtboard(svgRef.current, { format, scale: exportScale, transparent: transparent && format === 'png', name: projectName || 'BE5Tmate-card' });
      }
      notify(`已导出 ${exportFormats.length} 种格式 · ${exportScale}× 高清`);
      setExportOpen(false);
      saveVersion();
    } catch (error) {
      console.error(error);
      notify('导出失败，请检查图片素材后重试', 'warning');
    } finally { setExporting(false); }
  };

  const applyFusion = mode => {
    if (!images.length) return notify('请先上传至少一张球员或比赛图片', 'warning');
    snapshot();
    const landscape = project.ratio === '16:9';
    const area = landscape ? { x: 52, y: 18, w: 42, h: 62 } : { x: 37, y: 34, w: 57, h: 46 };
    const count = images.length;
    const patches = images.map((el, index) => {
      let patch = {};
      if (mode === 'grid') {
        const cols = count > 1 ? 2 : 1;
        const rows = Math.ceil(count / cols);
        patch = { x: area.x + (index % cols) * area.w / cols, y: area.y + Math.floor(index / cols) * area.h / rows, w: area.w / cols - .8, h: area.h / rows - .8, rotation: 0, opacity: 100 };
      } else if (mode === 'collage') {
        patch = { x: area.x + (index % 2) * area.w * .38, y: area.y + (index % 3) * area.h * .18, w: area.w * .62, h: area.h * .65, rotation: [-6, 4, -2, 7][index % 4], opacity: 100 };
      } else if (mode === 'stack') {
        patch = { x: area.x + index * 1.4, y: area.y + index * 1.2, w: area.w * .82, h: area.h * .9, rotation: 0, opacity: 100 - index * 5 };
      } else {
        patch = { x: area.x, y: area.y, w: area.w, h: area.h, rotation: 0, opacity: Math.round(100 / Math.max(1, count - index * .3)) };
      }
      return { id: el.id, patch };
    });
    setProject(prev => ({ ...prev, elements: prev.elements.map(el => patches.find(p => p.id === el.id) ? { ...el, ...patches.find(p => p.id === el.id).patch } : el) }));
    setFusionOpen(false);
    notify(`已应用${{ grid: '网格融合', collage: '拼贴融合', stack: '叠层融合', unified: '统一背景融合' }[mode]}，图片仍可分组编辑`);
  };

  const renderInspector = () => {
    if (!selected) return <div className="empty-inspector"><MousePointer2 size={28} /><h3>选择一个图层</h3><p>点击画布中的文字、图片或数据模块，在这里精确调整。</p></div>;
    return <>
      <div className="inspector-heading"><div><span className="eyebrow">SELECTED LAYER</span><h3>{selected.name || ({ text: '文字', image: '图片', metric: '数据模块', rect: '矩形', circle: '圆形', line: '线条' }[selected.type])}</h3></div><MoreHorizontal size={18} /></div>
      {(selected.type === 'text' || selected.type === 'metric') && <div className="property-section">
        <SectionTitle>内容</SectionTitle>
        {selected.type === 'text' ? <textarea className="text-editor" value={selected.text} onChange={e => updateElement(selected.id, { text: e.target.value })} rows="3" /> : <div className="field-grid"><Field label="数值"><input value={selected.value} onChange={e => updateElement(selected.id, { value: e.target.value })} /></Field><Field label="单位"><input value={selected.suffix} onChange={e => updateElement(selected.id, { suffix: e.target.value })} /></Field><Field label="数据标签" className="span-2"><input value={selected.label} onChange={e => updateElement(selected.id, { label: e.target.value })} /></Field></div>}
      </div>}
      {selected.type === 'text' && <div className="property-section"><SectionTitle>字体排版</SectionTitle><div className="field-grid"><Field label="字号"><div className="number-input"><input type="number" min="8" max="240" value={selected.fontSize} onChange={e => updateElement(selected.id, { fontSize: Number(e.target.value) })} /><span>px</span></div></Field><Field label="字重"><select value={selected.weight} onChange={e => updateElement(selected.id, { weight: Number(e.target.value) })}><option value="400">Regular</option><option value="600">Semibold</option><option value="700">Bold</option><option value="800">Extrabold</option><option value="900">Black</option></select></Field><Field label="字距"><input type="number" value={selected.letterSpacing || 0} onChange={e => updateElement(selected.id, { letterSpacing: Number(e.target.value) })} /></Field><Field label="对齐"><select value={selected.align || 'left'} onChange={e => updateElement(selected.id, { align: e.target.value })}><option value="left">左对齐</option><option value="center">居中</option><option value="right">右对齐</option></select></Field></div></div>}
      {selected.type === 'image' && <div className="property-section"><SectionTitle>图像调整</SectionTitle><RangeField label="不透明度" value={Math.round((selected.opacity ?? 100))} onChange={value => updateElement(selected.id, { opacity: value })} unit="%" /><RangeField label="模糊" value={selected.blur || 0} max={30} onChange={value => updateElement(selected.id, { blur: value })} unit="px" /><RangeField label="亮度" value={selected.brightness ?? 100} max={200} onChange={value => updateElement(selected.id, { brightness: value })} unit="%" /><RangeField label="对比度" value={selected.contrast ?? 100} max={200} onChange={value => updateElement(selected.id, { contrast: value })} unit="%" /><RangeField label="饱和度" value={selected.saturation ?? 100} max={200} onChange={value => updateElement(selected.id, { saturation: value })} unit="%" /><div className="field-grid"><Field label="裁切形状"><select value={selected.shape || 'round'} onChange={e => updateElement(selected.id, { shape: e.target.value })}><option value="round">圆角矩形</option><option value="square">直角矩形</option><option value="circle">圆形 / 椭圆</option></select></Field><Field label="圆角"><input type="number" min="0" max="100" value={selected.radius ?? theme.radius} onChange={e => updateElement(selected.id, { radius: Number(e.target.value) })} /></Field></div><button className="secondary-button full" onClick={() => updateElement(selected.id, { flip: !selected.flip })}><FlipHorizontal2 size={15} />水平翻转</button></div>}
      <div className="property-section"><SectionTitle>位置与变换</SectionTitle><div className="field-grid four"><Field label="X"><input type="number" value={selected.x} onChange={e => updateElement(selected.id, { x: Number(e.target.value) })} /></Field><Field label="Y"><input type="number" value={selected.y} onChange={e => updateElement(selected.id, { y: Number(e.target.value) })} /></Field><Field label="宽"><input type="number" value={selected.w} onChange={e => updateElement(selected.id, { w: Number(e.target.value) })} /></Field><Field label="高"><input type="number" value={selected.h} onChange={e => updateElement(selected.id, { h: Number(e.target.value) })} /></Field></div><RangeField label="旋转" min={-180} max={180} value={selected.rotation || 0} onChange={value => updateElement(selected.id, { rotation: value })} unit="°" /><RangeField label="图层不透明度" value={selected.opacity ?? 100} onChange={value => updateElement(selected.id, { opacity: value })} unit="%" /></div>
      <div className="property-section"><SectionTitle>图层操作</SectionTitle><div className="button-row"><button className="secondary-button" onClick={() => duplicateElement(selected.id)}><Copy size={14} />复制</button><button className="secondary-button danger" disabled={selected.locked || selected.isAvatar} onClick={() => deleteElement(selected.id)}><Trash2 size={14} />删除</button></div></div>
    </>;
  };

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand-lockup"><div className="brand-mark"><span>B5</span><Zap size={13} fill="currentColor" /></div><div><strong>BE5Tmate</strong><span>VISUAL STUDIO</span></div></div>
      <div className="top-divider" />
      <div className="project-title"><input value={projectName} onChange={e => setProjectName(e.target.value)} onBlur={() => patchProject({ name: projectName || '未命名项目' })} aria-label="项目名称" /><span><Cloud size={12} />已自动保存</span></div>
      <div className="history-controls"><IconButton title="撤销 Ctrl+Z" onClick={undo} disabled={!past.length}><Undo2 size={17} /></IconButton><IconButton title="重做 Ctrl+Shift+Z" onClick={redo} disabled={!future.length}><Redo2 size={17} /></IconButton></div>
      <div className="top-actions"><button className="text-button save-button" onClick={saveVersion}><Clock3 size={15} />保存版本</button><button className="export-button" onClick={() => setExportOpen(true)}><Download size={16} />导出作品<ChevronDown size={14} /></button><IconButton title="帮助"><CircleHelp size={18} /></IconButton><div className="user-avatar">B</div></div>
    </header>

    <div className="formatbar">
      <button className="mobile-menu" onClick={() => setMobilePanel(mobilePanel === 'left' ? null : 'left')}><Menu size={18} /></button>
      <div className="format-group"><span className="toolbar-label">画布比例</span><div className="segmented">{Object.keys(RATIOS).map(ratio => <button key={ratio} className={project.ratio === ratio ? 'active' : ''} onClick={() => switchRatio(ratio)}>{ratio}</button>)}</div></div>
      <div className="toolbar-separator" />
      <div className="platform-select"><span className="toolbar-label">发布平台</span><button onClick={() => setPlatformOpen(!platformOpen)}><span className="platform-dot" />{project.platform}<ChevronDown size={14} /></button>{platformOpen && <div className="dropdown">{PLATFORMS.map(platform => <button key={platform} onClick={() => { patchProject({ platform }); setPlatformOpen(false); }}>{platform}{project.platform === platform && <Check size={14} />}</button>)}</div>}</div>
      <div className="formatbar-center"><span className="preset-pill">{dimensions.w} × {dimensions.h}</span><span className="preset-label">{RATIOS[project.ratio].hint}</span></div>
      <div className="canvas-tools"><IconButton title="显示安全区" active={showSafe} onClick={() => setShowSafe(!showSafe)}><BoxSelect size={16} /></IconButton><IconButton title="显示网格" active={showGrid} onClick={() => setShowGrid(!showGrid)}><Grid2X2 size={16} /></IconButton><div className="zoom-control"><button onClick={() => setZoom(z => clamp(z - 10, 60, 140))}><Minus size={13} /></button><span>{zoom}%</span><button onClick={() => setZoom(z => clamp(z + 10, 60, 140))}><Plus size={13} /></button></div><IconButton title="适应画布" onClick={() => setZoom(100)}><Maximize2 size={16} /></IconButton></div>
    </div>

    <main className="workspace">
      <aside className={`left-panel ${mobilePanel === 'left' ? 'mobile-open' : ''}`}>
        <nav className="left-nav"><button className={leftTab === 'templates' ? 'active' : ''} onClick={() => setLeftTab('templates')}><LayoutTemplate size={17} /><span>模板</span></button><button className={leftTab === 'assets' ? 'active' : ''} onClick={() => setLeftTab('assets')}><Images size={17} /><span>素材</span></button><button className={leftTab === 'layers' ? 'active' : ''} onClick={() => setLeftTab('layers')}><Layers3 size={17} /><span>图层</span></button></nav>
        <div className="left-content">
          {leftTab === 'templates' && <>
            <div className="panel-heading"><div><h2>卡片模板</h2><span>9 个专业版式</span></div><Search size={16} /></div>
            <div className="template-list">{TEMPLATES.map(template => { const TemplateIcon = iconMap[template.icon] || LayoutTemplate; return <button key={template.id} className={`template-item ${project.templateId === template.id ? 'selected' : ''}`} onClick={() => switchTemplate(template.id)}><div className={`template-mini mini-${template.id}`}><TemplateIcon size={17} /><span>{template.id === 'player' ? '08' : template.id === 'match' ? '3:1' : template.id === 'mvp' ? 'MVP' : 'B5'}</span></div><div><strong>{template.name}</strong><span>{template.en}</span></div>{project.templateId === template.id && <Check size={14} className="template-check" />}</button>; })}</div>
            <div className="style-heading"><SectionTitle>风格包 <span className="count">8</span></SectionTitle><button onClick={() => notify('风格包会保留当前内容与图层位置')}>使用说明</button></div>
            <div className="theme-grid">{Object.entries(THEMES).map(([id, item]) => <button key={id} className={project.themeId === id ? 'active' : ''} onClick={() => switchTheme(id)} title={item.name}><span className="theme-preview" style={{ background: item.bg, color: item.ink }}><i style={{ background: item.accent }} /><b style={{ fontFamily: item.font }}>Aa</b><em style={{ background: item.ink }} /></span><span>{item.name}</span>{project.themeId === id && <Check size={11} />}</button>)}</div>
          </>}
          {leftTab === 'assets' && <>
            <div className="panel-heading"><div><h2>我的素材</h2><span>{assets.length} 张上传图片</span></div><button className="small-add" onClick={() => uploadRef.current.click()}><Plus size={16} /></button></div>
            <button className="upload-drop" onClick={() => uploadRef.current.click()}><div><Upload size={22} /></div><strong>上传球员 / 比赛图片</strong><span>支持多选 · PNG / JPG / WebP</span></button>
            <div className="asset-grid">{assets.map((asset, index) => <button className="asset-item" key={`${asset.name}-${index}`} onClick={() => { const el = { id: uid(), type: 'image', name: asset.name, src: asset.src, x: 42, y: 36, w: 48, h: 38, shape: 'round', opacity: 100 }; snapshot(); setProject(prev => ({ ...prev, elements: [...prev.elements, el] })); setSelectedId(el.id); }}><img src={asset.src} alt={asset.name} /><span><Plus size={13} /></span></button>)}</div>
            {!assets.length && <div className="asset-empty"><ImageIcon size={30} /><p>上传后的图片会保留在这里，便于多次添加与拼贴。</p></div>}
            <SectionTitle action={<span className="count">{images.length}</span>}>画布图片</SectionTitle>
            <div className="image-layer-list">{images.map(el => <button key={el.id} onClick={() => setSelectedId(el.id)} className={selectedId === el.id ? 'active' : ''}><img src={el.src} alt="" /><span>{el.name || '图片素材'}</span><GripVertical size={14} /></button>)}</div>
            <button className="fusion-button" onClick={() => setFusionOpen(true)}><Blend size={17} /><span><strong>多卡融合</strong><small>网格 / 拼贴 / 叠层 / 统一背景</small></span><ChevronRight size={15} /></button>
            <div className="avatar-setting"><div className="mini-avatar"><UserRound size={17} /></div><div><strong>账户头像</strong><span>替换品牌头像</span></div><button onClick={() => avatarRef.current.click()}>更换</button></div>
          </>}
          {leftTab === 'layers' && <>
            <div className="panel-heading"><div><h2>图层管理</h2><span>{project.elements.length} 个独立图层</span></div><Layers3 size={16} /></div>
            <div className="layer-list">{[...project.elements].reverse().map((el, index) => <div key={el.id} className={`layer-row ${selectedId === el.id ? 'active' : ''}`} onClick={() => setSelectedId(el.id)}><GripVertical size={13} className="layer-grip" /><span className="layer-type">{el.type === 'text' ? <Type size={14} /> : el.type === 'image' ? <ImageIcon size={14} /> : el.type === 'metric' ? <BarChart3 size={14} /> : <Shapes size={14} />}</span><span className="layer-name">{el.name || el.text || el.label || '装饰图层'}</span><button title={el.hidden ? '显示' : '隐藏'} onClick={e => { e.stopPropagation(); updateElement(el.id, { hidden: !el.hidden }); }}>{el.hidden ? <EyeOff size={13} /> : <Eye size={13} />}</button><button title={el.locked ? '解锁' : '锁定'} onClick={e => { e.stopPropagation(); if (!el.isAvatar && el.id !== 'footer') updateElement(el.id, { locked: !el.locked }); }}>{el.locked ? <Lock size={12} /> : <Unlock size={12} />}</button><div className="layer-order"><button onClick={e => { e.stopPropagation(); moveLayer(el.id, 1); }}><ArrowUp size={11} /></button><button onClick={e => { e.stopPropagation(); moveLayer(el.id, -1); }}><ArrowDown size={11} /></button></div></div>)}</div>
          </>}
        </div>
        <div className="left-bottom"><button onClick={() => setHistoryOpen(true)}><Archive size={16} /><span>历史与归档</span><span className="badge">{versions.length}</span></button><button><Settings2 size={16} /><span>偏好设置</span></button></div>
      </aside>

      <section className="center-stage" onClick={() => setMobilePanel(null)}>
        <div className="stage-top"><div className="breadcrumb"><span>我的项目</span><ChevronRight size={12} /><strong>{project.name}</strong></div><div className="stage-actions"><button onClick={() => addElement('text')}><Type size={15} />文字</button><button onClick={() => addElement('rect')}><Shapes size={15} />图形</button><button onClick={() => addElement('metric')}><BarChart3 size={15} />数据</button><span /><button onClick={() => uploadRef.current.click()}><ImageIcon size={15} />图片</button></div></div>
        <div className="canvas-viewport">
          <div className={`canvas-shadow ratio-${project.ratio.replace(':', '-')}`} style={{ aspectRatio: `${dimensions.w}/${dimensions.h}`, '--zoom': zoom / 100 }}>
            <svg ref={svgRef} className="artboard" viewBox={`0 0 ${dimensions.w} ${dimensions.h}`} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp} onPointerDown={() => setSelectedId(null)} style={{ fontFamily: theme.font }}>
              <defs><filter id="group-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={project.groupBlur * dimensions.w / 900} /></filter><pattern id="editor-grid" width={dimensions.w / 12} height={dimensions.h / 12} patternUnits="userSpaceOnUse"><path d={`M ${dimensions.w / 12} 0 L 0 0 0 ${dimensions.h / 12}`} fill="none" stroke="#7257ff" strokeOpacity=".22" strokeWidth="1" /></pattern></defs>
              <rect className="canvas-bg" width={dimensions.w} height={dimensions.h} fill={project.background || theme.bg} />
              <g opacity={project.groupOpacity / 100} filter={project.groupBlur ? 'url(#group-blur)' : undefined}>
                <BackgroundDecor theme={theme} w={dimensions.w} h={dimensions.h} />
                {project.elements.map(el => <SvgElement key={el.id} el={el} project={project} theme={theme} w={dimensions.w} h={dimensions.h} selected={selectedId === el.id} onPointerDown={onElementPointerDown} onDoubleClick={onDoubleClick} />)}
              </g>
              {showGrid && <rect className="selection-layer" width={dimensions.w} height={dimensions.h} fill="url(#editor-grid)" pointerEvents="none" />}
              {showSafe && <g className="safe-area" pointerEvents="none"><rect x={dimensions.w * .035} y={dimensions.h * .025} width={dimensions.w * .93} height={dimensions.h * .94} fill="none" stroke="#7c67d9" strokeOpacity=".38" strokeWidth="1" strokeDasharray="5 6" /><text x={dimensions.w * .04} y={dimensions.h * .02} fill={theme.muted} fontSize={9 * dimensions.w / 900} fontFamily="Arial" letterSpacing="1">SAFE AREA · {project.platform}</text></g>}
            </svg>
          </div>
        </div>
        <div className="stage-bottom"><span><MousePointer2 size={13} />拖动移动 · 双击编辑 · Ctrl+Z 撤销</span><div><span className="status-dot" />所有图层可编辑</div><button className="mobile-inspector-button" onClick={() => setMobilePanel('right')}><SlidersHorizontal size={12} />属性</button></div>
      </section>

      <aside className={`right-panel ${mobilePanel === 'right' ? 'mobile-open' : ''}`}>
        <div className="right-tabs"><button className={rightTab === 'design' ? 'active' : ''} onClick={() => setRightTab('design')}><SlidersHorizontal size={15} />设计</button><button className={rightTab === 'data' ? 'active' : ''} onClick={() => setRightTab('data')}><BarChart3 size={15} />数据</button><IconButton className="mobile-panel-close" title="关闭属性面板" onClick={() => setMobilePanel(null)}><X size={15} /></IconButton></div>
        <div className="right-scroll">
          {rightTab === 'design' ? <>
            <div className="global-settings"><SectionTitle>封面整体组</SectionTitle><RangeField label="组不透明度" value={project.groupOpacity} onChange={value => patchProject({ groupOpacity: value })} unit="%" /><RangeField label="组模糊" value={project.groupBlur} max={30} onChange={value => patchProject({ groupBlur: value })} unit="px" /><div className="background-control"><span>画布背景</span><div><input type="color" value={project.background || theme.bg} onChange={e => patchProject({ background: e.target.value })} /><code>{(project.background || theme.bg).toUpperCase()}</code><button onClick={() => patchProject({ background: theme.bg })}><RotateCcw size={12} />重置</button></div></div></div>
            {renderInspector()}
          </> : <DataPanel project={project} selected={selected} setSelectedId={setSelectedId} updateElement={updateElement} patchProject={patchProject} addElement={addElement} />}
        </div>
        <div className="right-footer"><span><span className="status-dot" />100% 矢量文本</span><button onClick={() => setExportOpen(true)}>检查并导出<ArrowRight size={14} /></button></div>
      </aside>
    </main>

    <footer className="bottom-dock"><div className="dock-info"><div className="live-dot" /><span>草稿实时保存</span><i /><span>{project.elements.length} 个图层</span><i /><span>{project.platform} 安全区已开启</span></div><button className="recent-history" onClick={() => setHistoryOpen(true)}><Clock3 size={14} /><span>最近版本</span>{versions.slice(0, 3).map(v => <span className="history-thumb" key={v.id}>{v.thumbnail ? <img src={v.thumbnail} alt="" /> : <FileImage size={14} />}</span>)}<ChevronRight size={14} /></button><button className="dock-export" onClick={() => setExportOpen(true)}><Download size={14} />高清导出</button></footer>

    <input ref={uploadRef} type="file" accept="image/*" multiple hidden onChange={e => handleFiles(e)} />
    <input ref={avatarRef} type="file" accept="image/*" hidden onChange={e => handleFiles(e, true)} />

    {exportOpen && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setExportOpen(false)}><div className="modal export-modal"><div className="modal-head"><div><span className="eyebrow">PUBLISH YOUR STORY</span><h2>导出高清作品</h2></div><IconButton title="关闭" onClick={() => setExportOpen(false)}><X size={19} /></IconButton></div><div className="export-summary"><div className="export-preview" style={{ background: theme.bg }}><span style={{ color: theme.ink }}>BE5Tmate</span><b style={{ color: theme.ink }}>{project.name}</b><i style={{ background: theme.accent }} /></div><div><strong>{projectName}</strong><span>{project.ratio} · {project.platform}</span><span>{dimensions.w * exportScale} × {dimensions.h * exportScale} px</span><small><Check size={12} />文字与数据已检查，无越界</small></div></div><SectionTitle>文件格式 <span className="count">可多选</span></SectionTitle><div className="format-options">{['PNG', 'JPG', 'WebP', 'PDF'].map(format => <button key={format} className={exportFormats.includes(format.toLowerCase()) ? 'active' : ''} onClick={() => setExportFormats(prev => prev.includes(format.toLowerCase()) ? prev.filter(f => f !== format.toLowerCase()) : [...prev, format.toLowerCase()])}><FileImage size={19} /><strong>{format}</strong><span>{format === 'PNG' ? '无损 / 支持透明' : format === 'JPG' ? '通用高质量' : format === 'WebP' ? '更小体积' : '打印与分享'}</span><i>{exportFormats.includes(format.toLowerCase()) && <Check size={12} />}</i></button>)}</div><div className="export-settings"><Field label="导出倍率"><div className="segmented">{[1, 2, 3].map(scale => <button key={scale} className={exportScale === scale ? 'active' : ''} onClick={() => setExportScale(scale)}>{scale}×</button>)}</div></Field><label className={`toggle-row ${!exportFormats.includes('png') ? 'disabled' : ''}`}><span><strong>透明背景</strong><small>仅适用于 PNG</small></span><input type="checkbox" checked={transparent} disabled={!exportFormats.includes('png')} onChange={e => setTransparent(e.target.checked)} /><i /></label></div><div className="export-note"><Zap size={15} /><span>高清渲染，不栅格化源文件。导出后将自动保存一个历史版本。</span></div><button className="primary-button export-confirm" disabled={exporting} onClick={doExport}>{exporting ? <><span className="spinner" />正在渲染高清作品…</> : <><Download size={17} />导出 {exportFormats.length > 1 ? `${exportFormats.length} 个文件` : exportFormats[0]?.toUpperCase() || '作品'}</>}</button></div></div>}

    {fusionOpen && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setFusionOpen(false)}><div className="modal fusion-modal"><div className="modal-head"><div><span className="eyebrow">MULTI-CARD COMPOSITION</span><h2>多卡融合</h2><p>将当前画布中的 {images.length} 张图片重新组合，融合后仍可逐层编辑。</p></div><IconButton title="关闭" onClick={() => setFusionOpen(false)}><X size={19} /></IconButton></div><div className="fusion-grid">{[{ id: 'grid', name: '网格融合', en: 'CLEAN GRID', icon: Grid2X2 }, { id: 'collage', name: '拼贴融合', en: 'EDITORIAL COLLAGE', icon: LayoutGrid }, { id: 'stack', name: '叠层融合', en: 'LAYERED STACK', icon: Layers3 }, { id: 'unified', name: '统一背景融合', en: 'UNIFIED BLEND', icon: Blend }].map(mode => { const ModeIcon = mode.icon; return <button key={mode.id} onClick={() => applyFusion(mode.id)}><div className={`fusion-preview fusion-${mode.id}`}><i /><i /><i /></div><ModeIcon size={18} /><strong>{mode.name}</strong><span>{mode.en}</span><ArrowRight size={15} /></button>; })}</div>{images.length < 2 && <div className="export-note"><ImageIcon size={15} />当前只有一张主体图。可先在「素材」中多选上传，获得更丰富的融合效果。</div>}</div></div>}

    {historyOpen && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setHistoryOpen(false)}><div className="modal history-modal"><div className="modal-head"><div><span className="eyebrow">YOUR CREATIVE ARCHIVE</span><h2>历史与归档</h2><p>手动版本最多保留 30 个，草稿会自动保存在当前浏览器。</p></div><IconButton title="关闭" onClick={() => setHistoryOpen(false)}><X size={19} /></IconButton></div><div className="history-toolbar"><div className="search-box"><Search size={15} /><input placeholder="搜索项目名称或标签" value={historySearch} onChange={e => setHistorySearch(e.target.value)} /></div><button className="secondary-button" onClick={() => setHistoryView(historyView === 'versions' ? 'archived' : 'versions')}><Archive size={14} />{historyView === 'versions' ? `归档库 ${versions.filter(v => v.archived).length}` : '返回版本'}</button><button className="secondary-button" onClick={saveVersion}><Plus size={14} />保存当前版本</button></div><div className="version-list">{versions.filter(v => (historyView === 'archived' ? v.archived : !v.archived) && v.name.toLowerCase().includes(historySearch.toLowerCase())).map(version => <div className="version-row" key={version.id}><div className="version-thumb">{version.thumbnail ? <img src={version.thumbnail} alt={version.name} /> : <FileImage size={24} />}</div><div className="version-meta"><strong>{version.name}</strong><span>{new Date(version.date).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })} · {version.project.ratio} · {THEMES[version.project.themeId]?.name}</span></div><span className="version-tag">{version.archived ? '已归档' : '手动版本'}</span><IconButton title="收藏" active={version.favorite} onClick={() => patchVersion(version.id, { favorite: !version.favorite })}><Star size={15} fill={version.favorite ? 'currentColor' : 'none'} /></IconButton><button className="secondary-button" onClick={() => restoreVersion(version)}><RotateCcw size={14} />恢复</button><IconButton title={version.archived ? '取消归档' : '归档'} onClick={() => { patchVersion(version.id, { archived: !version.archived }); notify(version.archived ? '已恢复到版本列表' : '已移入归档库'); }}><Archive size={15} /></IconButton></div>)}{!versions.filter(v => historyView === 'archived' ? v.archived : !v.archived).length && <div className="history-empty"><div><Clock3 size={28} /></div><h3>{historyView === 'archived' ? '归档库还是空的' : '还没有手动版本'}</h3><p>{historyView === 'archived' ? '归档的版本会集中保存在这里，可随时恢复。' : '点击「保存当前版本」，为作品留下可回溯的创作节点。'}</p><button className="primary-button" onClick={saveVersion}><Plus size={15} />保存第一个版本</button></div>}</div></div></div>}

    {toast && <div className={`toast ${toast.type}`}>{toast.type === 'success' ? <Check size={16} /> : <CircleHelp size={16} />}<span>{toast.message}</span></div>}
  </div>;
}

function DataPanel({ project, selected, setSelectedId, updateElement, addElement }) {
  const metrics = project.elements.filter(el => el.type === 'metric');
  return <div className="data-panel"><div className="panel-heading"><div><h2>球员与比赛数据</h2><span>字段可编辑 · 模块可排序</span></div><BarChart3 size={17} /></div><div className="player-summary"><div className="player-avatar"><UserRound size={24} /></div><div><strong>Zhu Ting</strong><span>NO. 08 · OUTSIDE HITTER</span></div><button><ChevronRight size={15} /></button></div><div className="property-section"><SectionTitle action={<button className="inline-action" onClick={() => addElement('metric')}><Plus size={12} />添加</button>}>核心数据模块</SectionTitle><div className="metric-list">{metrics.map(metric => <button key={metric.id} className={selected?.id === metric.id ? 'active' : ''} onClick={() => setSelectedId(metric.id)}><span><b>{metric.value}</b><small>{metric.suffix}</small></span><div><strong>{metric.label}</strong><small>大数字模块</small></div><ChevronRight size={14} /></button>)}</div></div>{selected?.type === 'metric' ? <div className="property-section data-edit"><SectionTitle>编辑选中数据</SectionTitle><div className="field-grid"><Field label="数值"><input value={selected.value} onChange={e => updateElement(selected.id, { value: e.target.value })} /></Field><Field label="单位"><input value={selected.suffix} onChange={e => updateElement(selected.id, { suffix: e.target.value })} /></Field><Field label="标签" className="span-2"><input value={selected.label} onChange={e => updateElement(selected.id, { label: e.target.value })} /></Field></div><div className="chart-switch"><span>图表类型</span><div><button className={!selected.chartType || selected.chartType === 'number' ? 'active' : ''} onClick={() => updateElement(selected.id, { chartType: 'number' })}><BarChart3 size={15} />大数字</button><button className={selected.chartType === 'ring' ? 'active' : ''} onClick={() => updateElement(selected.id, { chartType: 'ring' })}><Circle size={15} />环形</button><button className={selected.chartType === 'bars' ? 'active' : ''} onClick={() => updateElement(selected.id, { chartType: 'bars' })}><BarChart3 size={15} />条形</button><button className={selected.chartType === 'radar' ? 'active' : ''} onClick={() => updateElement(selected.id, { chartType: 'radar' })}><ChartNoAxesColumn size={15} />雷达</button><button className={selected.chartType === 'trend' ? 'active' : ''} onClick={() => updateElement(selected.id, { chartType: 'trend' })}><Zap size={15} />趋势</button></div></div></div> : <div className="data-tip"><MousePointer2 size={18} /><p>选择一个数据模块，即可修改数值、单位与标签。</p></div>}<div className="property-section"><SectionTitle>球员档案字段</SectionTitle><div className="profile-fields">{[['位置', '主攻'], ['身高', '198 cm'], ['扣球高度', '327 cm'], ['拦网高度', '300 cm'], ['国籍', '中国'], ['赛季', '2026 / 27']].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></div><div className="data-note"><Zap size={14} /><span>数值与标签均为独立矢量文本，导出后依然清晰。</span></div></div>;
}

export default App;
