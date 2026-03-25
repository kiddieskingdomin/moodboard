'use client'

import { useEffect, useRef } from 'react'
import { loadMoodboard, saveMoodboard, startAutoSave } from '@/lib/storage'
import type { MoodboardState } from '@/types/moodboard'

// Full moodboard CSS — extracted from working standalone HTML
const CSS = `/* ─────────────────────────────────────────
   KIDDIES KINGDOM BRAND TOKENS
   Source: kiddieskingdom.in
───────────────────────────────────────── */
:root {
  --sage:    #8FAF7A;
  --sage-d:  #3F5A45;
  --sage-m:  #5E7D5F;
  --sage-l:  #EBF2E5;
  --blush:   #E8A4B4;
  --blush-l: #FDF0F4;
  --cream:   #F7F3EE;
  --cream-d: #EDE8E0;
  --peach:   #F6B8A6;
  --peach-l: #FEF3EF;
  --wood:    #D8C3A5;
  --wood-d:  #B8A080;
  --wood-l:  #F5F0E8;
  --ink:     #2A3828;
  --ink-m:   #5A6B58;
  --ink-l:   #8A9B88;
  --white:   #FFFFFF;
  --border:  #E2D9CE;
  --shadow:  rgba(42,56,40,.1);
}

* { margin:0; padding:0; box-sizing:border-box; }
html, body { height:100%; }
body {
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  background: var(--cream);
  color: var(--ink);
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  user-select: none;
}

/* ═══════════════════════════════════════
   TOPBAR
═══════════════════════════════════════ */
.topbar {
  height: 52px;
  background: var(--white);
  border-bottom: 1.5px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 18px;
  gap: 0;
  flex-shrink: 0;
  box-shadow: 0 1px 8px rgba(42,56,40,.07);
  z-index: 200;
  position: relative;
}
/* ── CONTEXTUAL PROPERTY BAR (centre of topbar, shown when item selected) ── */
.prop-bar {
  position: absolute;
  left: 50%; top: 50%;
  transform: translate(-50%,-50%);
  display: flex;
  align-items: center;
  gap: 2px;
  opacity: 0;
  pointer-events: none;
  transition: opacity .18s;
}
.prop-bar.vis { opacity: 1; pointer-events: all; }
.prop-bar.hidden-bar { display: none; }
/* prop-bar divider */
.pb-sep { width:1px; height:20px; background:var(--border); margin:0 4px; flex-shrink:0; }
/* colour swatch button */
.pb-color {
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 2px solid var(--border);
  cursor: pointer;
  transition: transform .15s;
  flex-shrink: 0;
  position: relative;
}
.pb-color:hover { transform: scale(1.1); box-shadow: 0 0 0 2px var(--sage); }
.pb-color input[type=color] {
  position: absolute; inset: 0;
  opacity: 0; cursor: pointer;
  width: 100%; height: 100%;
  border: none; padding: 0;
}
/* stroke color circle (hollow) */
.pb-stroke {
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 3px solid var(--sage-d);
  background: transparent;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  transition: transform .15s;
}
.pb-stroke:hover { transform: scale(1.1); }
.pb-stroke input[type=color] {
  position: absolute; inset: 0;
  opacity: 0; cursor: pointer;
  width: 100%; height: 100%;
}
/* icon button */
.pb-btn {
  width: 30px; height: 30px;
  border-radius: 7px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px;
  color: var(--ink-m);
  transition: all .14s;
  flex-shrink: 0;
  position: relative;
}
.pb-btn:hover { background: var(--sage-l); color: var(--sage-d); border-color: var(--sage); }
.pb-btn.on { background: var(--sage-l); color: var(--sage-d); border-color: var(--sage); }
.pb-btn svg { width: 14px; height: 14px; pointer-events: none; }
/* font family select */
.pb-font {
  font-family: inherit;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid var(--border);
  border-radius: 7px;
  padding: 4px 6px;
  background: var(--white);
  color: var(--ink);
  cursor: pointer;
  outline: none;
  max-width: 110px;
}
/* font size */
.pb-size {
  width: 46px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid var(--border);
  border-radius: 7px;
  padding: 4px 5px;
  text-align: center;
  background: var(--white);
  color: var(--ink);
  outline: none;
}
/* stroke width mini-slider */
.pb-sw {
  width: 60px;
  accent-color: var(--sage-d);
  cursor: pointer;
}
/* opacity mini-slider */
.pb-opac {
  width: 56px;
  accent-color: var(--sage-d);
  cursor: pointer;
}
/* tooltip */
.pb-btn[title]:hover::after {
  content: attr(title);
  position: absolute;
  bottom: -28px; left: 50%;
  transform: translateX(-50%);
  background: var(--ink);
  color: #fff;
  font-size: 9px;
  padding: 3px 7px;
  border-radius: 5px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10000;
}

/* brand */
.kk-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-right: 22px;
  border-right: 1px solid var(--border);
  flex-shrink: 0;
}
.kk-brand-words { line-height: 1.15; }
.kk-brand-words .n1 {
  display: block;
  font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  font-size: 15px;
  font-weight: 600;
  color: var(--sage-d);
  letter-spacing: .2px;
}
.kk-brand-words .n2 {
  display: block;
  font-size: 9px;
  font-weight: 500;
  color: var(--ink-l);
  letter-spacing: 1.4px;
  text-transform: uppercase;
}

/* board name — centre */
.board-name-zone {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 28px;
}
.board-name-inp {
  font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  font-size: 18px;
  font-weight: 600;
  color: var(--ink);
  border: none;
  border-bottom: 1.5px solid transparent;
  background: transparent;
  outline: none;
  padding: 2px 6px;
  min-width: 180px;
  max-width: 380px;
  width: 100%;
  text-align: center;
  transition: border-color .2s;
  letter-spacing: .2px;
}
.board-name-inp:hover { border-bottom-color: var(--border); }
.board-name-inp:focus { border-bottom-color: var(--sage); }
.board-name-inp::placeholder { color: var(--ink-l); font-style: italic; }

/* right actions */
.top-right {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 22px;
  border-left: 1px solid var(--border);
  flex-shrink: 0;
}
.tbtn {
  padding: 6px 14px;
  border-radius: 7px;
  border: 1.5px solid var(--border);
  background: var(--white);
  font-size: 11px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  color: var(--ink);
  cursor: pointer;
  transition: all .15s;
  white-space: nowrap;
  letter-spacing: .1px;
}
.tbtn:hover { background: var(--cream); border-color: var(--wood-d); }
.tbtn.active { background: var(--sage-l); color: var(--sage-d); border-color: var(--sage); }
.tbtn.c-export { background: var(--sage-d); color: #fff; border-color: var(--sage-d); }
.tbtn.c-export:hover { background: var(--sage-m); }
.tbtn.c-save { background: var(--sage-l); color: var(--sage-d); border-color: var(--sage); }
.tbtn.c-save:hover { background: #dcebd6; }
.tbtn.c-clear { color: #b54040; border-color: #e8c4c4; }
.tbtn.c-clear:hover { background: #fff5f5; }
.top-vsep { width: 1px; height: 20px; background: var(--border); }

/* ═══════════════════════════════════════
   MAIN LAYOUT
═══════════════════════════════════════ */
.main { display:flex; flex:1; overflow:hidden; }

/* ═══════════════════════════════════════
   LEFT ICON RAIL
═══════════════════════════════════════ */
.rail {
  width: 62px;
  background: var(--white);
  border-right: 1.5px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0;
  gap: 1px;
  flex-shrink: 0;
  overflow-y: auto;
}
.rail::-webkit-scrollbar { display: none; }
.rbt {
  width: 54px; height: 44px;
  border-radius: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  transition: all .15s;
  font-size: 8px;
  font-weight: 600;
  color: var(--ink-l);
  font-family: 'DM Sans', sans-serif;
  letter-spacing: .3px;
}
.rbt svg { width: 18px; height: 18px; flex-shrink: 0; }
.rbt:hover { background: var(--sage-l); color: var(--sage-d); }
.rbt:hover svg { stroke: var(--sage-d); }
.rbt.on { background: var(--sage-l); color: var(--sage-d); }
.rbt.on svg { stroke: var(--sage-d); }
.r-sep { width: 24px; height: 1px; background: var(--border); margin: 4px 0; }

/* ═══════════════════════════════════════
   SLIDE PANEL
═══════════════════════════════════════ */
.panel {
  width: 228px;
  background: var(--white);
  border-right: 1.5px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
  transition: width .22s ease;
}
.panel.closed { width: 0; border-right: none; }
.panel-head {
  padding: 12px 14px 9px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.panel-head-title {
  font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--sage-d);
  letter-spacing: .2px;
}
.panel-head-close {
  width: 22px; height: 22px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--white);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px;
  color: var(--ink-l);
  transition: all .15s;
}
.panel-head-close:hover { background: var(--sage-l); color: var(--sage-d); }
.pscroll { flex: 1; overflow-y: auto; padding: 12px; }
.pscroll::-webkit-scrollbar { width: 3px; }
.pscroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
.hidden { display: none !important; }

/* section labels */
.sec-lbl {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--ink-l);
  margin: 12px 0 7px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.sec-lbl:first-child { margin-top: 0; }
.sec-lbl::after { content:''; flex:1; height:1px; background: var(--border); }

/* category pills */
.cpills { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px; }
.cpill {
  padding: 3px 9px;
  border-radius: 20px;
  font-size: 9px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid var(--border);
  background: var(--white);
  color: var(--ink-m);
  transition: all .15s;
}
.cpill:hover, .cpill.on { background: var(--sage-d); color: #fff; border-color: var(--sage-d); }

/* product cards */
.prod-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.prod-card {
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  cursor: grab;
  transition: all .2s;
  position: relative;
}
.prod-card:hover {
  border-color: var(--sage);
  box-shadow: 0 4px 14px var(--shadow);
  transform: translateY(-2px);
}
.prod-card:active { cursor: grabbing; }
.prod-card img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
  background: var(--cream);
  pointer-events: none;
}
.prod-card .pc-cat {
  position: absolute;
  top: 6px; left: 6px;
  background: var(--sage-d);
  color: #fff;
  font-size: 7px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  letter-spacing: .4px;
  text-transform: uppercase;
}
.prod-card .pc-name {
  padding: 6px 7px 4px;
  font-size: 9.5px;
  font-weight: 500;
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
}
.prod-card .pc-price {
  padding: 0 7px 7px;
  font-size: 10px;
  font-weight: 700;
  color: var(--sage-d);
  font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
}

/* upload zone */
.upload-zone {
  border: 1.5px dashed var(--border);
  border-radius: 10px;
  padding: 14px 10px;
  text-align: center;
  cursor: pointer;
  font-size: 10px;
  font-weight: 500;
  color: var(--ink-l);
  transition: all .18s;
  margin-bottom: 10px;
  line-height: 1.5;
}
.upload-zone:hover { border-color: var(--sage); color: var(--sage-d); background: var(--sage-l); }
.upload-zone strong { display: block; color: var(--sage-d); font-size: 11px; margin-bottom: 2px; }

/* elements */
.el-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 5px; }
.el-chip {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 7px 3px;
  text-align: center;
  cursor: grab;
  transition: all .15s;
  font-size: 9px;
  font-weight: 500;
  color: var(--ink);
}
.el-chip:hover { border-color: var(--sage); background: var(--sage-l); }
.el-chip .ei { font-size: 17px; display: block; margin-bottom: 2px; }
.el-chip.wide { grid-column: 1/-1; text-align: left; padding: 8px 10px; cursor: pointer; }
.el-chip.wide:hover { cursor: pointer; }

/* shapes */
.sh-cat { font-size: 9px; font-weight: 600; color: var(--ink-l); text-transform: uppercase; letter-spacing: .5px; margin: 8px 0 5px; }
.sh-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 4px; margin-bottom: 4px; }
.sh-btn {
  aspect-ratio: 1;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all .15s;
}
.sh-btn:hover { border-color: var(--sage); background: var(--sage-l); }
.sh-btn svg { width: 15px; height: 15px; }

/* color swatches */
.swatch-row { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 6px; }
.csw {
  width: 22px; height: 22px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1.5px var(--border);
  transition: transform .15s;
  flex-shrink: 0;
}
.csw:hover { transform: scale(1.18); }
.csw.on { box-shadow: 0 0 0 2px var(--sage-d); }

/* draw tools */
.dt-list { display: flex; flex-direction: column; gap: 5px; }
.dt-btn {
  display: flex; align-items: center; gap: 9px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--white);
  cursor: pointer;
  transition: all .15s;
}
.dt-btn:hover, .dt-btn.on { border-color: var(--sage); background: var(--sage-l); }
.dt-btn .dt-icon { font-size: 16px; width: 20px; text-align: center; flex-shrink: 0; }
.dt-btn .dt-name { font-size: 11px; font-weight: 600; color: var(--ink); }
.dt-btn .dt-desc { font-size: 9px; color: var(--ink-l); }
.ctrl-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.ctrl-row label { font-size: 9px; font-weight: 600; color: var(--ink-l); min-width: 38px; text-transform: uppercase; letter-spacing: .4px; }
.ctrl-row input[type=range] { flex: 1; accent-color: var(--sage-d); cursor: pointer; }
.ctrl-row input[type=color] { width: 26px; height: 26px; border: 1px solid var(--border); border-radius: 6px; cursor: pointer; padding: 1px; background: none; }
.ctrl-row .val { font-size: 10px; font-weight: 700; color: var(--sage-d); min-width: 20px; }
.dc-row { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 4px; }
.draw-col {
  width: 20px; height: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px var(--border);
  transition: transform .15s;
}
.draw-col:hover, .draw-col.on { transform: scale(1.2); box-shadow: 0 0 0 2px var(--sage-d); }

/* sticky notes */
.note-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 6px; margin-bottom: 10px; }
.note-swatch {
  aspect-ratio: 1;
  border-radius: 7px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: var(--ink);
  box-shadow: 2px 3px 8px var(--shadow);
  transition: all .2s;
}
.note-swatch:hover { transform: translateY(-2px) rotate(-3deg); box-shadow: 3px 5px 14px var(--shadow); }

/* bg options */
.bg-opts { display: flex; gap: 5px; flex-wrap: wrap; }
.bg-opt {
  width: 32px; height: 32px;
  border-radius: 7px;
  cursor: pointer;
  border: 2px solid transparent;
  box-shadow: 0 0 0 1px var(--border);
  transition: all .15s;
}
.bg-opt:hover, .bg-opt.on { box-shadow: 0 0 0 2px var(--sage-d); }

/* style panel */
.style-sec { background: var(--cream); border-radius: 9px; padding: 10px; margin-bottom: 8px; }
.style-row { display: flex; gap: 6px; align-items: center; margin-bottom: 7px; }
.style-row label { font-size: 9px; color: var(--ink-l); font-weight: 600; min-width: 44px; text-transform: uppercase; letter-spacing: .3px; }
.style-row input[type=color] { width: 24px; height: 24px; border: 1px solid var(--border); border-radius: 5px; cursor: pointer; padding: 1px; }
.style-row input[type=range] { flex: 1; accent-color: var(--sage-d); }
.btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; }
.sm-btn {
  padding: 7px 5px;
  border-radius: 7px;
  border: 1px solid var(--border);
  background: var(--white);
  font-size: 9px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: all .15s;
  color: var(--ink);
  font-family: 'DM Sans', sans-serif;
  letter-spacing: .2px;
}
.sm-btn:hover { border-color: var(--sage); background: var(--sage-l); color: var(--sage-d); }
.sm-btn.danger { color: #b54040; }
.sm-btn.danger:hover { background: #fff5f5; border-color: #e8c4c4; }

/* ═══════════════════════════════════════
   CANVAS
═══════════════════════════════════════ */
.canvas-wrap {
  flex: 1;
  overflow: hidden;
  position: relative;
}
#board-canvas {
  position: absolute;
  inset: 0;
  background: var(--cream);
}
.drop-overlay {
  position: absolute; inset: 0;
  border: 2px dashed var(--sage);
  background: rgba(143,175,122,.04);
  pointer-events: none;
  opacity: 0;
  transition: opacity .18s;
  z-index: 4;
  border-radius: 2px;
}
.drop-overlay.show { opacity: 1; }
/* draw canvas */
#draw-canvas {
  position: absolute; inset: 0;
  pointer-events: none;
  z-index: 6;
}
#draw-canvas.active { pointer-events: all; cursor: crosshair; }

/* hint */
.hint-wrap {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  pointer-events: none;
  transition: opacity .4s;
  z-index: 2;
}
.hint-wrap.gone { opacity: 0; }
.hint-icon {
  width: 64px; height: 64px;
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 14px;
  box-shadow: 0 4px 16px var(--shadow);
  animation: float 3s ease-in-out infinite;
}
.hint-icon svg { width: 28px; height: 28px; }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
.hint-h {
  font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  font-size: 18px;
  font-weight: 600;
  color: var(--sage-d);
  margin-bottom: 5px;
}
.hint-p { font-size: 11px; color: var(--ink-l); font-weight: 400; line-height: 1.6; text-align: center; max-width: 280px; }

/* ═══════════════════════════════════════
   BOARD ITEMS
═══════════════════════════════════════ */
.bitem {
  position: absolute;
  cursor: default; /* don't show grab by default */
}
/* Move handle — 4-arrow icon, appears in top-left on hover */
.bitem .move-handle {
  position: absolute;
  top: -11px; left: -11px;
  width: 22px; height: 22px;
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  cursor: move;
  opacity: 0;
  transition: opacity .14s, box-shadow .14s;
  z-index: 9998;
  box-shadow: 0 2px 8px rgba(0,0,0,.12);
}
.bitem .move-handle svg { width: 12px; height: 12px; pointer-events: none; }
.bitem:hover .move-handle,
.bitem.sel .move-handle { opacity: 1; }
.bitem .move-handle:hover {
  background: var(--sage-l);
  border-color: var(--sage);
  box-shadow: 0 3px 12px rgba(63,90,69,.2);
}
/* When dragging — whole item gets move cursor via JS class */
.bitem.dragging { cursor: move !important; user-select: none; }
/* Hover outline (not selection — lighter, dashed) */
.bitem:not(.sel):hover::after {
  content: '';
  position: absolute; inset: -3px;
  border: 1.5px dashed var(--sage);
  border-radius: 5px;
  pointer-events: none;
  z-index: 0;
  opacity: .5;
}

/* ── INLINE QUICK BAR (below element, Canva-style) ── */
.tbar {
  position: absolute;
  bottom: -46px; left: 50%;
  transform: translateX(-50%);
  display: flex; align-items: center; gap: 1px;
  opacity: 0; pointer-events: none;
  transition: opacity .12s;
  z-index: 9999;
  background: var(--white);
  border-radius: 9px;
  padding: 5px 7px;
  box-shadow: 0 4px 18px rgba(0,0,0,.15);
  border: 1px solid var(--border);
  white-space: nowrap;
}
.bitem.sel .tbar { opacity: 1; pointer-events: all; }
.bitem:hover .tbar { opacity: 1; pointer-events: all; }
.tb {
  width: 28px; height: 28px;
  border-radius: 6px; border: none;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  display: flex; align-items: center; justify-content: center;
  transition: all .12s;
  color: var(--ink-m);
  position: relative;
}
.tb:hover { background: var(--sage-l); color: var(--sage-d); }
.tb.on { background: var(--sage-l); color: var(--sage-d); }
.tb.del:hover { background: #ffeded; color: #c04040; }
.t-sep { width: 1px; height: 18px; background: var(--border); margin: 0 3px; align-self: center; }
/* tooltip on tbar buttons */
.tb[title]:hover::after {
  content: attr(title);
  position: absolute;
  bottom: 34px; left: 50%;
  transform: translateX(-50%);
  background: var(--ink);
  color: #fff;
  font-size: 9px;
  padding: 3px 7px;
  border-radius: 5px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10001;
  font-family: 'DM Sans', sans-serif;
}

/* rotate handle */
.rot-handle {
  position: absolute;
  top: -50px; left: 50%;
  transform: translateX(-50%);
  width: 20px; height: 20px;
  background: var(--sage-d);
  border-radius: 50%;
  cursor: crosshair;
  opacity: 0;
  transition: opacity .12s;
  z-index: 9999;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 10px;
  box-shadow: 0 2px 8px rgba(63,90,69,.4);
}
.rot-handle::after {
  content: '';
  position: absolute;
  top: 20px; left: 50%;
  transform: translateX(-50%);
  width: 1px; height: 16px;
  background: var(--sage-d);
  opacity: .35;
}
.bitem:hover .rot-handle, .bitem.sel .rot-handle { opacity: 1; }

/* resize handles — 8 points */
.rh {
  position: absolute;
  width: 9px; height: 9px;
  background: var(--white);
  border: 1.5px solid var(--sage);
  border-radius: 2px;
  z-index: 9999;
  opacity: 0;
  transition: opacity .12s;
}
.bitem:hover .rh, .bitem.sel .rh { opacity: 1; }
.rh.nw { top:-4px; left:-4px; cursor:nw-resize; }
.rh.nm { top:-4px; left:calc(50% - 4px); cursor:n-resize; }
.rh.ne { top:-4px; right:-4px; cursor:ne-resize; }
.rh.wm { top:calc(50% - 4px); left:-4px; cursor:w-resize; }
.rh.em { top:calc(50% - 4px); right:-4px; cursor:e-resize; }
.rh.sw { bottom:-4px; left:-4px; cursor:sw-resize; }
.rh.sm { bottom:-4px; left:calc(50% - 4px); cursor:s-resize; }
.rh.se { bottom:-4px; right:-4px; cursor:se-resize; }

/* selection outline */
.bitem.sel::before {
  content: '';
  position: absolute; inset: -5px;
  border: 1.5px solid var(--sage);
  border-radius: 4px;
  pointer-events: none;
  z-index: 1;
}

/* ─── item types ─── */
.bi-img { border-radius: 10px; overflow: hidden; box-shadow: 0 5px 18px var(--shadow); width:100%; height:100%; }
.bi-img img { width:100%; height:100%; object-fit:cover; display:block; }
.bi-pol { background:#fff; padding: 7px 7px 26px; box-shadow: 0 8px 24px var(--shadow); border-radius: 2px; width:100%; height:100%; }
.bi-pol img { width:100%; height:calc(100% - 26px); object-fit:cover; display:block; }
.bi-pol .pl { text-align:center; font-size:9px; margin-top:5px; color:var(--ink-l); font-family:'Cormorant Garamond',serif; }
.bi-sticky { padding:12px; width:100%; height:100%; font-size:12px; font-weight:500; box-shadow: 2px 4px 14px var(--shadow); border-radius: 2px; outline:none; font-family:'DM Sans',sans-serif; line-height:1.55; cursor:text; }
.bi-text { font-family:'Cormorant Garamond',serif; font-weight:600; font-size:28px; color:var(--sage-d); outline:none; cursor:text; white-space:nowrap; }
.bi-caption { font-size:10px; letter-spacing:2.5px; text-transform:uppercase; color:var(--ink-l); outline:none; cursor:text; white-space:nowrap; font-weight:600; }
.bi-tag { background:var(--sage-d); padding:5px 14px; border-radius:4px; font-size:11px; font-weight:600; color:#fff; white-space:nowrap; outline:none; cursor:text; font-family:'DM Sans',sans-serif; }
.bi-badge { padding:5px 12px; border-radius:20px; font-size:11px; font-weight:600; color:#fff; white-space:nowrap; outline:none; cursor:text; font-family:'DM Sans',sans-serif; }
.bi-bubble { border:2px solid var(--sage); padding:7px 14px; border-radius:20px; font-size:11px; font-weight:500; color:var(--sage-d); outline:none; cursor:text; white-space:nowrap; }
.bi-sticker { font-size:52px; line-height:1; display:flex; align-items:center; justify-content:center; width:100%; height:100%; }
.bi-blob { border-radius:50%; width:100%; height:100%; }
.bi-tape { background:rgba(143,175,122,.35); border-radius:2px; width:100%; height:100%; }
.bi-washi { background:repeating-linear-gradient(90deg,var(--sage-l) 0,var(--sage-l) 10px,var(--peach-l) 10px,var(--peach-l) 20px); border-radius:2px; width:100%; height:100%; border: 1px solid rgba(143,175,122,.3); }

/* ═══════════════════════════════════════
   STATUS BAR
═══════════════════════════════════════ */
.statusbar {
  height: 26px;
  background: var(--white);
  border-top: 1px solid var(--border);
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 10px;
  color: var(--ink-l);
  flex-shrink: 0;
  font-weight: 500;
}
.st-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--sage); flex-shrink: 0; }
.st-kk { margin-left: auto; color: var(--sage-d); font-weight: 600; font-size: 10px; font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif; font-size: 12px; letter-spacing: .3px; }

/* ═══════════════════════════════════════
   TOAST
═══════════════════════════════════════ */
.toast {
  position: fixed;
  bottom: 36px; left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: var(--sage-d);
  color: #fff;
  padding: 9px 20px;
  border-radius: 8px;
  font-size: 11px;
  opacity: 0;
  transition: all .25s;
  pointer-events: none;
  z-index: 9999;
  font-weight: 600;
  box-shadow: 0 4px 18px rgba(63,90,69,.4);
  letter-spacing: .2px;
}
.toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

/* ── CONTEXT MENU (right-click) ── */
.ctx-menu {
  position: fixed;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 8px 32px rgba(0,0,0,.16);
  z-index: 19999;
  min-width: 190px;
  animation: ctx-in .1s ease;
}
@keyframes ctx-in { from { opacity:0; transform:scale(.95) } to { opacity:1; transform:scale(1) } }
.ctx-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 7px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: var(--ink);
  transition: background .12s;
}
.ctx-item:hover { background: var(--sage-l); color: var(--sage-d); }
.ctx-item.danger { color: #c04040; }
.ctx-item.danger:hover { background: #ffeded; }
.ctx-item .ctx-icon { width: 18px; text-align: center; font-size: 13px; flex-shrink: 0; }
.ctx-item .ctx-kb { margin-left: auto; font-size: 10px; color: var(--ink-l); background: var(--cream); padding: 1px 6px; border-radius: 4px; border: 1px solid var(--border); }
.ctx-sep { height: 1px; background: var(--border); margin: 4px 2px; }

/* ── EDIT IMAGE PANEL ── */
.edit-panel {
  position: fixed;
  top: 0; right: 0;
  width: 320px; height: 100vh;
  background: var(--white);
  border-left: 1.5px solid var(--border);
  box-shadow: -4px 0 24px rgba(0,0,0,.1);
  z-index: 9000;
  display: flex; flex-direction: column;
  transform: translateX(100%);
  transition: transform .24s ease;
  overflow: hidden;
}
.edit-panel.open { transform: translateX(0); }
.ep-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px 10px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.ep-head h3 { font-family:'Cormorant Garamond',serif; font-size:16px; font-weight:600; color:var(--sage-d); }
.ep-close { width:28px;height:28px;border-radius:7px;border:1px solid var(--border);background:var(--white);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--ink-l); }
.ep-close:hover { background:var(--sage-l); color:var(--sage-d); }
.ep-scroll { flex:1; overflow-y:auto; padding:14px; }
.ep-scroll::-webkit-scrollbar { width:3px; }
.ep-scroll::-webkit-scrollbar-thumb { background:var(--border); border-radius:2px; }
.ep-sec { margin-bottom:18px; }
.ep-sec-title { font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--ink-l);margin-bottom:10px;display:flex;align-items:center;gap:6px; }
.ep-sec-title::after{content:'';flex:1;height:1px;background:var(--border);}
/* adjust sliders */
.adj-row { display:flex;align-items:center;gap:8px;margin-bottom:8px; }
.adj-row label { font-size:10px;font-weight:600;color:var(--ink-m);min-width:72px; }
.adj-row input[type=range] { flex:1;accent-color:var(--sage-d); }
.adj-row .adj-val { font-size:10px;color:var(--sage-d);font-weight:700;min-width:24px;text-align:right; }
/* filter / effect grid */
.ep-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:7px; }
.ep-tile {
  border-radius:10px;
  overflow:hidden;
  cursor:pointer;
  border:2px solid transparent;
  transition:all .15s;
  position:relative;
}
.ep-tile:hover { border-color:var(--sage); transform:translateY(-1px); box-shadow:0 3px 10px var(--shadow); }
.ep-tile.on { border-color:var(--sage-d); box-shadow:0 0 0 1px var(--sage-d); }
.ep-tile-preview {
  width:100%;
  aspect-ratio:1;
  background:var(--cream-d);
  display:flex;align-items:center;justify-content:center;
  font-size:20px;
}
.ep-tile-label { font-size:9px;font-weight:600;text-align:center;padding:4px 2px;color:var(--ink-m);background:var(--white); }
/* image in tile */
.ep-tile-preview img { width:100%;height:100%;object-fit:cover; }


/* ── BOARD BACKGROUND THUMBNAILS ── */
.bg-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 7px;
  margin-bottom: 4px;
}
.bg-thumb {
  aspect-ratio: 1;
  border-radius: 12px;
  cursor: pointer;
  border: 2.5px solid transparent;
  box-shadow: 0 1px 6px rgba(42,56,40,.1);
  transition: all .18s;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}
.bg-thumb:hover { transform: translateY(-2px); box-shadow: 0 4px 14px rgba(42,56,40,.15); }
.bg-thumb.on { border-color: var(--sage-d); box-shadow: 0 0 0 3px rgba(63,90,69,.2); }
.bg-thumb-label {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  font-size: 8px;
  font-weight: 600;
  color: var(--ink-m);
  text-align: center;
  padding: 3px 2px;
  background: rgba(247,243,238,.88);
  backdrop-filter: blur(2px);
  opacity: 0;
  transition: opacity .15s;
}
.bg-thumb:hover .bg-thumb-label { opacity: 1; }

/* ── FRAME OPTIONS ── */
.frame-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 6px;
  margin-bottom: 6px;
}
.frame-opt {
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 10px 6px 7px;
  text-align: center;
  cursor: pointer;
  transition: all .15s;
  background: var(--white);
  font-size: 9px;
  font-weight: 600;
  color: var(--ink-m);
}
.frame-opt.wide { grid-column: 1/-1; padding: 12px; }
.frame-opt:hover { border-color: var(--sage); background: var(--sage-l); color: var(--sage-d); }
.frame-opt.on { border-color: var(--sage-d); background: var(--sage-l); color: var(--sage-d); }
.frame-opt .fi { font-size: 18px; display: block; margin-bottom: 4px; }
.frame-opt .frame-preview {
  width: 24px; height: 20px;
  margin: 0 auto 5px;
  border: 1.5px solid var(--ink-m);
}

/* ── COLOR PICKER MODAL ── */
.cpick-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.25);
  z-index: 19000;
  display: none;
  align-items: flex-start;
  justify-content: flex-start;
}
.cpick-overlay.open { display: flex; }
.cpick-modal {
  background: var(--white);
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(0,0,0,.2);
  border: 1px solid var(--border);
  width: 260px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 14px;
  position: absolute;
  animation: cpick-in .15s ease;
}
.cpick-modal::-webkit-scrollbar { width: 3px; }
.cpick-modal::-webkit-scrollbar-thumb { background: var(--border); }
@keyframes cpick-in { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
.cpick-sec-title {
  font-size: 10px; font-weight: 700;
  color: var(--ink); margin-bottom: 10px;
  display: flex; align-items: center; gap: 7px;
}
.cpick-sec-title svg { flex-shrink: 0; }
.cpick-sec { margin-bottom: 16px; }
.cpick-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 4px; }
.cpick-sw {
  width: 28px; height: 28px; border-radius: 50%;
  cursor: pointer; border: 2px solid var(--white);
  box-shadow: 0 0 0 1.5px var(--border);
  transition: transform .15s;
  flex-shrink: 0; position: relative;
}
.cpick-sw:hover { transform: scale(1.15); box-shadow: 0 0 0 2px var(--sage-d); }
.cpick-sw.transparent {
  background: linear-gradient(135deg, #fff 45%, #e0e0e0 45%, #e0e0e0 55%, #fff 55%);
}
.cpick-sw.add-btn {
  background: var(--cream);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; color: var(--ink-l); font-weight: 400;
}
.cpick-brand-sub { font-size: 9px; color: var(--ink-l); margin-bottom: 8px; font-weight: 500; }
/* gradient swatches */
.cpick-sw.grad { border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 0 1.5px var(--border); }
.cpick-row.solid-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; }
.cpick-row.grad-grid  { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; }
.cpick-input-row {
  display: flex; gap: 6px; margin-top: 8px; align-items: center;
}
.cpick-hex {
  flex: 1; border: 1.5px solid var(--border); border-radius: 7px;
  padding: 5px 8px; font-size: 11px; font-family: monospace;
  color: var(--ink); outline: none; background: var(--cream);
}
.cpick-hex:focus { border-color: var(--sage); }
.cpick-native {
  width: 32px; height: 32px; border: 1.5px solid var(--border);
  border-radius: 7px; cursor: pointer; padding: 2px; background: var(--white);
}
.cpick-close-btn {
  position: absolute; top: 10px; right: 10px;
  width: 22px; height: 22px; border-radius: 6px;
  border: 1px solid var(--border); background: var(--white);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  font-size: 11px; color: var(--ink-l);
}
.cpick-close-btn:hover { background: var(--sage-l); color: var(--sage-d); }

/* ── PALETTE CIRCLES (in styles panel) ── */
.palette-row {
  display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;
}
.pal-dot {
  width: 28px; height: 28px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid var(--white);
  box-shadow: 0 0 0 1.5px var(--border);
  transition: all .15s;
  flex-shrink: 0;
}
.pal-dot:hover { transform: scale(1.15); box-shadow: 0 0 0 2px var(--sage-d); }


/* ── FONT PANEL (slide from left) ── */
.font-panel {
  position: fixed;
  top: 0; left: 0;
  width: 300px; height: 100vh;
  background: var(--white);
  border-right: 1.5px solid var(--border);
  box-shadow: 4px 0 24px rgba(0,0,0,.12);
  z-index: 18000;
  display: flex; flex-direction: column;
  transform: translateX(-100%);
  transition: transform .22s ease;
}
.font-panel.open { transform: translateX(0); }
.fp-head {
  padding: 16px 16px 12px;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid var(--border); flex-shrink: 0;
}
.fp-head h3 { font-size: 16px; font-weight: 700; color: var(--ink); }
.fp-close {
  width: 28px; height: 28px; border-radius: 7px;
  border: 1px solid var(--border); background: transparent;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  font-size: 14px; color: var(--ink-l);
}
.fp-close:hover { background: var(--sage-l); color: var(--sage-d); }
.fp-tabs {
  display: flex; border-bottom: 1px solid var(--border); flex-shrink: 0;
}
.fp-tab {
  flex: 1; padding: 10px; text-align: center;
  font-size: 13px; font-weight: 600; color: var(--ink-l);
  cursor: pointer; border-bottom: 2px solid transparent;
  transition: all .15s;
}
.fp-tab.on { color: var(--sage-d); border-bottom-color: var(--sage-d); }
.fp-search {
  padding: 10px 14px; flex-shrink: 0;
  display: flex; align-items: center; gap: 8px;
  border-bottom: 1px solid var(--border);
}
.fp-search-inp {
  flex: 1; border: 1.5px solid var(--border); border-radius: 8px;
  padding: 7px 10px; font-size: 12px; outline: none;
  background: var(--cream); color: var(--ink);
}
.fp-search-inp:focus { border-color: var(--sage); }
.fp-cats {
  display: flex; gap: 6px; padding: 8px 14px;
  border-bottom: 1px solid var(--border); flex-shrink: 0; overflow-x: auto;
}
.fp-cats::-webkit-scrollbar { display: none; }
.fp-cat {
  padding: 5px 12px; border-radius: 20px; border: 1.5px solid var(--border);
  font-size: 11px; font-weight: 600; cursor: pointer; white-space: nowrap;
  transition: all .15s; background: var(--white); color: var(--ink-m);
}
.fp-cat:hover, .fp-cat.on { background: var(--sage-d); color: #fff; border-color: var(--sage-d); }
.fp-scroll { flex: 1; overflow-y: auto; }
.fp-scroll::-webkit-scrollbar { width: 3px; }
.fp-scroll::-webkit-scrollbar-thumb { background: var(--border); }
.fp-section-title {
  padding: 10px 14px 4px; font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1px; color: var(--ink-l);
  display: flex; align-items: center; gap: 6px;
}
.fp-section-title svg { flex-shrink: 0; }
.fp-font-item {
  padding: 10px 14px; cursor: pointer; transition: background .12s;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid var(--cream-d);
}
.fp-font-item:hover { background: var(--sage-l); }
.fp-font-item.on { background: var(--sage-l); }
.fp-font-name { font-size: 14px; color: var(--ink); }
.fp-font-check { color: var(--sage-d); font-size: 14px; }

/* ── UPGRADED COLOR PICKER ── */
/* Color gradient canvas */
.cpick-canvas-wrap {
  position: relative; width: 100%; aspect-ratio: 1.8; border-radius: 8px;
  overflow: hidden; cursor: crosshair; margin-bottom: 10px;
}
#cpick-canvas { display: block; width: 100%; height: 100%; border-radius: 8px; }
.cpick-canvas-cursor {
  position: absolute; width: 12px; height: 12px;
  border: 2.5px solid #fff; border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(0,0,0,.3);
  transform: translate(-50%,-50%);
  pointer-events: none; top: 10%; left: 90%;
}
/* Hue slider */
.cpick-hue-wrap {
  position: relative; height: 12px; border-radius: 6px; margin-bottom: 8px;
  background: linear-gradient(90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00);
  cursor: pointer;
}
.cpick-hue-thumb {
  position: absolute; width: 14px; height: 14px;
  background: #fff; border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0,0,0,.3);
  top: 50%; transform: translate(-50%,-50%);
  pointer-events: none; left: 0%;
}
/* Alpha slider */
.cpick-alpha-wrap {
  position: relative; height: 12px; border-radius: 6px; margin-bottom: 10px;
  background: linear-gradient(90deg, transparent, #000);
  cursor: pointer;
  background-image: linear-gradient(45deg,#ccc 25%,transparent 25%),
    linear-gradient(-45deg,#ccc 25%,transparent 25%),
    linear-gradient(45deg,transparent 75%,#ccc 75%),
    linear-gradient(-45deg,transparent 75%,#ccc 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
}
.cpick-alpha-overlay {
  position: absolute; inset: 0; border-radius: 6px;
}
.cpick-alpha-thumb {
  position: absolute; width: 14px; height: 14px;
  background: #fff; border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0,0,0,.3);
  top: 50%; transform: translate(-50%,-50%);
  pointer-events: none; left: 100%;
}
/* RGB / Hex inputs */
.cpick-inputs { display: flex; gap: 5px; margin-bottom: 10px; align-items: center; }
.cpick-preview-dot {
  width: 30px; height: 30px; border-radius: 8px;
  border: 1.5px solid var(--border); flex-shrink: 0;
}
.cpick-rgb-box {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px;
}
.cpick-rgb-inp {
  width: 100%; border: 1.5px solid var(--border); border-radius: 6px;
  padding: 4px 4px; font-size: 12px; font-weight: 600; text-align: center;
  outline: none; background: var(--cream);
}
.cpick-rgb-inp:focus { border-color: var(--sage); }
.cpick-rgb-lbl { font-size: 9px; color: var(--ink-l); font-weight: 700; }
.cpick-hex-box { flex: 2; display: flex; flex-direction: column; gap: 2px; }
.cpick-hex-inp2 {
  width: 100%; border: 1.5px solid var(--border); border-radius: 6px;
  padding: 4px 8px; font-size: 12px; font-weight: 600; font-family: monospace;
  outline: none; background: var(--cream); text-transform: uppercase;
}
.cpick-hex-inp2:focus { border-color: var(--sage); }

/* search bar in color picker */
.cpick-search {
  width: 100%; border: 1.5px solid var(--border); border-radius: 8px;
  padding: 7px 10px 7px 28px; font-size: 11px; outline: none;
  background: var(--cream); color: var(--ink); margin-bottom: 10px;
}
.cpick-search:focus { border-color: var(--sage); }
.cpick-search-wrap { position: relative; }
.cpick-search-icon {
  position: absolute; left: 8px; top: 50%; transform: translateY(-50%);
  color: var(--ink-l); pointer-events: none;
}


/* ════════════════════════════════
   BROWSE PRODUCTS MODAL
════════════════════════════════ */
.browse-overlay {
  position: fixed; inset: 0;
  background: rgba(42,56,40,.45);
  backdrop-filter: blur(3px);
  z-index: 20000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity .2s;
}
.browse-overlay.open {
  opacity: 1;
  pointer-events: all;
}
.browse-modal {
  background: var(--white);
  border-radius: 18px;
  box-shadow: 0 24px 80px rgba(0,0,0,.22);
  width: min(92vw, 860px);
  height: min(88vh, 680px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: translateY(20px) scale(.97);
  transition: transform .22s ease;
}
.browse-overlay.open .browse-modal {
  transform: translateY(0) scale(1);
}
/* modal header */
.bm-head {
  padding: 20px 24px 14px;
  border-bottom: 1.5px solid var(--border);
  flex-shrink: 0;
}
.bm-head-top {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 14px;
}
.bm-title {
  font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  font-size: 20px; font-weight: 600; color: var(--ink);
}
.bm-close {
  width: 32px; height: 32px; border-radius: 8px;
  border: 1.5px solid var(--border); background: var(--white);
  cursor: pointer; font-size: 16px; color: var(--ink-l);
  display: flex; align-items: center; justify-content: center;
  transition: all .15s;
}
.bm-close:hover { background: var(--sage-l); color: var(--sage-d); border-color: var(--sage); }
/* search row */
.bm-search-row {
  display: flex; gap: 10px; align-items: center;
}
.bm-search-wrap {
  flex: 1; position: relative;
}
.bm-search-icon {
  position: absolute; left: 12px; top: 50%;
  transform: translateY(-50%);
  color: var(--ink-l); pointer-events: none;
}
.bm-search-inp {
  width: 100%;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px 10px 36px;
  font-size: 13px; font-family: 'DM Sans', sans-serif;
  color: var(--ink); background: var(--cream);
  outline: none; transition: border-color .15s;
}
.bm-search-inp:focus { border-color: var(--sage); background: var(--white); }
.bm-search-inp::placeholder { color: var(--ink-l); }
.bm-search-btn {
  padding: 10px 20px;
  background: var(--sage-d); color: #fff;
  border: none; border-radius: 10px;
  font-size: 13px; font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; transition: background .15s;
  white-space: nowrap;
}
.bm-search-btn:hover { background: var(--sage-m); }
/* collection filter */
.bm-filter-row {
  display: flex; align-items: center; gap: 8px;
  margin-top: 10px; flex-wrap: nowrap; overflow-x: auto;
}
.bm-filter-row::-webkit-scrollbar { display: none; }
.bm-filter-label {
  font-size: 11px; font-weight: 600; color: var(--ink-l);
  white-space: nowrap; flex-shrink: 0;
}
.bm-collection-sel {
  flex: 1;
  border: 1.5px solid var(--border);
  border-radius: 9px;
  padding: 8px 12px;
  font-size: 12px; font-family: 'DM Sans', sans-serif;
  color: var(--ink); background: var(--white);
  outline: none; cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238A9B88' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 28px;
}
.bm-collection-sel:focus { border-color: var(--sage); }
/* age filter pills */
.bm-age-pill {
  padding: 5px 12px; border-radius: 20px;
  border: 1.5px solid var(--border);
  font-size: 11px; font-weight: 600; cursor: pointer;
  white-space: nowrap; transition: all .13s;
  background: var(--white); color: var(--ink-m);
  flex-shrink: 0;
}
.bm-age-pill:hover, .bm-age-pill.on {
  background: var(--sage-d); color: #fff; border-color: var(--sage-d);
}
/* results count */
.bm-results-bar {
  padding: 10px 24px 6px;
  font-size: 11px; color: var(--ink-l); font-weight: 500;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: space-between;
}
.bm-results-bar span { color: var(--sage-d); font-weight: 700; }
/* product grid */
.bm-grid-wrap {
  flex: 1; overflow-y: auto; padding: 18px 20px;
}
.bm-grid-wrap::-webkit-scrollbar { width: 4px; }
.bm-grid-wrap::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
.bm-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 14px;
}
/* product card */
.bm-card {
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: all .18s;
  position: relative;
}
.bm-card:hover {
  border-color: var(--sage);
  box-shadow: 0 6px 20px rgba(63,90,69,.15);
  transform: translateY(-3px);
}
.bm-card:active { transform: translateY(-1px); }
.bm-card-img-wrap {
  width: 100%; aspect-ratio: 1;
  background: var(--cream);
  overflow: hidden; position: relative;
}
.bm-card-img-wrap img {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
  transition: transform .2s;
}
.bm-card:hover .bm-card-img-wrap img { transform: scale(1.04); }
.bm-card-body { padding: 10px 10px 8px; }
.bm-card-name {
  font-size: 11px; font-weight: 600; color: var(--ink);
  line-height: 1.35; margin-bottom: 4px;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}
.bm-card-meta {
  display: flex; align-items: center; justify-content: space-between;
}
.bm-card-price {
  font-size: 13px; font-weight: 700; color: var(--sage-d);
  font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
}
.bm-card-age {
  font-size: 9px; font-weight: 600;
  background: var(--sage-l); color: var(--sage-d);
  padding: 2px 6px; border-radius: 8px;
}
.bm-card-add {
  position: absolute; top: 8px; right: 8px;
  width: 26px; height: 26px; border-radius: 50%;
  background: var(--sage-d); color: #fff;
  font-size: 16px; font-weight: 400;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity .15s;
  box-shadow: 0 2px 8px rgba(63,90,69,.4);
  line-height: 1;
}
.bm-card:hover .bm-card-add { opacity: 1; }
.bm-card-cat {
  position: absolute; top: 8px; left: 8px;
  background: rgba(63,90,69,.85); color: #fff;
  font-size: 7px; font-weight: 700;
  padding: 2px 6px; border-radius: 8px;
  text-transform: uppercase; letter-spacing: .5px;
}
/* loading / empty states */
.bm-loading {
  display: flex; align-items: center; justify-content: center;
  height: 200px; flex-direction: column; gap: 12px; color: var(--ink-l);
}
.bm-spinner {
  width: 32px; height: 32px;
  border: 3px solid var(--border);
  border-top-color: var(--sage-d);
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.bm-empty {
  display: flex; align-items: center; justify-content: center;
  height: 200px; flex-direction: column; gap: 10px;
  color: var(--ink-l); font-size: 13px;
}
/* added toast inside modal */
.bm-added-flash {
  position: absolute; inset: 0;
  background: rgba(63,90,69,.15);
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
  opacity: 0; pointer-events: none;
  animation: bm-flash .5s ease forwards;
}
@keyframes bm-flash {
  0%  { opacity: 0; transform: scale(.8); }
  40% { opacity: 1; transform: scale(1.1); }
  100%{ opacity: 0; transform: scale(1); }
}
/* browse btn in topbar */
.tbtn.c-browse {
  background: var(--sage-d);
  border-color: var(--sage-d);
  color: #fff;
  display: flex; align-items: center; gap: 5px;
}
.tbtn.c-browse:hover { background: var(--sage-m); border-color: var(--sage-m); }
.tbtn.c-browse svg { flex-shrink: 0; }
`

// Full moodboard JS engine
const JS = `// ───────────────────────────────────────────────
//  PRODUCTS  (with prices from site)
// ───────────────────────────────────────────────
// ── Collection label map ──
const CAT_LABELS = {
  blocks:'Open-Ended Play', motor:'Motor Skill Toys',
  montessori:'Montessori & Learning', pretend:'Pretend Play',
  furniture:'Kids Furniture', storage:'Organisers & Storage',
  diy:'DIY Kits', games:'Games', dollhouse:'Dollhouses & Playsets',
  active:'Active Play'
};

const PRODUCTS = [
  // Open-Ended Play / Blocks
  {name:'15-Piece Castle Blocks Set',  col:'blocks',   cat:'Open-Ended Play',  age:'3-10', ageN:[3,10],  price:'₹2,999', url:'https://kiddieskingdom.in/shop/15-piece-classical-castle-block-set',    img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fwooden-blocks-02%2F8.png&w=640&q=75',   alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fwooden-blocks-02%2F1.png&w=640&q=75'},
  {name:'64-Piece Natural Wood Blocks',col:'blocks',   cat:'Open-Ended Play',  age:'2-10', ageN:[2,10],  price:'₹4,999', url:'https://kiddieskingdom.in/shop/64-piece-wooden-building-blocks-set',      img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fwooden-blocks-01%2F9.png&w=640&q=75',   alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fwooden-blocks-01%2F1.png&w=640&q=75'},
  {name:'47-Piece Natural Wood Blocks',col:'blocks',   cat:'Open-Ended Play',  age:'2-8',  ageN:[2,8],   price:'₹1,500', url:'https://kiddieskingdom.in/shop/47-piece-pure-nature-wooden-blocks',        img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fwooden-blocks-03%2F8.png&w=640&q=75',   alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fwooden-blocks-03%2F1.png&w=640&q=75'},
  {name:'Castle Building Blocks Set',  col:'blocks',   cat:'Open-Ended Play',  age:'3-10', ageN:[3,10],  price:'₹1,999', url:'https://kiddieskingdom.in/shop/medieval-castle-building-blocks',            img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fwooden-blocks-04%2F8.png&w=640&q=75',   alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fwooden-blocks-04%2F1.png&w=640&q=75'},
  {name:'Starter Blocks Set',          col:'blocks',   cat:'Open-Ended Play',  age:'2-8',  ageN:[2,8],   price:'₹2,499', url:'https://kiddieskingdom.in/shop/core-four-starter-block-set',               img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fwooden-blocks-05%2F8.png&w=640&q=75',   alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fwooden-blocks-05%2F1.png&w=640&q=75'},
  {name:'First Blocks Set',            col:'blocks',   cat:'Open-Ended Play',  age:'2-6',  ageN:[2,6],   price:'₹1,799', url:'https://kiddieskingdom.in/shop/beginner-wooden-block-set-flat-plank',       img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fwooden-blocks-06%2F6.png&w=640&q=75',   alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fwooden-blocks-06%2F1.png&w=640&q=75'},
  // Motor Skill
  {name:'Rainbow Peg Board',           col:'motor',    cat:'Motor Skill Toys', age:'1-6',  ageN:[1,6],   price:'₹2,199', url:'https://kiddieskingdom.in/shop/rainbow-pegboard',                          img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-MK-06-1.png&w=640&q=75',            alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-MK-06-2.png&w=640&q=75'},
  {name:'Brown Stair Set',             col:'motor',    cat:'Motor Skill Toys', age:'1-6',  ageN:[1,6],   price:'₹1,999', url:'https://kiddieskingdom.in/shop/brown-stair-blocks',                         img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-MK-05-1.png&w=640&q=75',            alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-MK-05-2.png&w=640&q=75'},
  {name:'Red Rods Set',                col:'motor',    cat:'Motor Skill Toys', age:'1-6',  ageN:[1,6],   price:'₹1,999', url:'https://kiddieskingdom.in/shop/red-rod-steps-sticks-set',                   img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-MK-04-1.png&w=640&q=75',            alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-MK-04-2.png&w=640&q=75'},
  {name:'Fruit Stacker',               col:'motor',    cat:'Motor Skill Toys', age:'1-6',  ageN:[1,6],   price:'₹899',   url:'https://kiddieskingdom.in/shop/fruit-stacker-set',                          img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-MK-03-1.png&w=640&q=75',            alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-MK-03-2.png&w=640&q=75'},
  {name:'Rocket Shape Sorter',         col:'motor',    cat:'Motor Skill Toys', age:'1-6',  ageN:[1,6],   price:'₹1,299', url:'https://kiddieskingdom.in/shop/rocket-shape-sorter',                        img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-MK-02-1.png&w=640&q=75',            alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-MK-02-2.png&w=640&q=75'},
  {name:'Color Stacking Blocks',       col:'motor',    cat:'Motor Skill Toys', age:'1-6',  ageN:[1,6],   price:'₹799',   url:'https://kiddieskingdom.in/shop/color-square-stacker',                       img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-MK-01-1.png&w=640&q=75',            alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-MK-01-2.png&w=640&q=75'},
  // Kids Furniture
  {name:'Montessori Cloud Shelf',      col:'furniture',cat:'Kids Furniture',   age:'3-9',  ageN:[3,9],   price:'₹10,090',url:'https://kiddieskingdom.in/shop/toddler-cloud-shelf',                        img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FToddler%20Cloud%20Shelf.jpg&w=640&q=75', alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FToddler%20Cloud%20Shelf2.jpg&w=640&q=75'},
  {name:'Ratatouille Chair',           col:'furniture',cat:'Kids Furniture',   age:'3-9',  ageN:[3,9],   price:'₹7,690', url:'https://kiddieskingdom.in/shop/ratatouille-chair',                           img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fchair.webp&w=640&q=75',                 alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fchair.webp&w=640&q=75'},
  {name:'Butterfly Chair',             col:'furniture',cat:'Kids Furniture',   age:'3-9',  ageN:[3,9],   price:'₹7,690', url:'https://kiddieskingdom.in/shop/lili-fly-g-butterfly-chair',                  img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Flilifly.WEBP&w=640&q=75',               alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Flilifly2.WEBP&w=640&q=75'},
  {name:'Kids Round Table',            col:'furniture',cat:'Kids Furniture',   age:'3-9',  ageN:[3,9],   price:'₹9,500', url:'https://kiddieskingdom.in/shop/childrens-round-table',                       img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Froundtable.WEBP&w=640&q=75',            alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Froundtable2.WEBP&w=640&q=75'},
  // Storage
  {name:'Bus Bookshelf',               col:'storage',  cat:'Organisers & Storage',age:'3-9',ageN:[3,9],  price:'₹12,500',url:'https://kiddieskingdom.in/shop/bus-book-shelf',                              img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FBus%20Book%20Shelf.jpg&w=640&q=75',     alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FBus%20Book%20Shelf2.jpg&w=640&q=75'},
  {name:'Peg Board Organiser',         col:'storage',  cat:'Organisers & Storage',age:'3-9',ageN:[3,9],  price:'₹32,000',url:'https://kiddieskingdom.in/shop/pegboard',                                    img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FPegboard%201.webp&w=640&q=75',          alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FPegboard%202.webp&w=640&q=75'},
  {name:'Alphabet Shelf Letter G',     col:'storage',  cat:'Organisers & Storage',age:'0-12',ageN:[0,12],price:'₹15,499',url:'https://kiddieskingdom.in/shop/alphabet-shelf-letter-g',                    img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Falphabet-shelf-g%2Fmain.jpg&w=640&q=75', alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Falphabet-shelf-g%2Fcolors.jpg&w=640&q=75'},
  {name:'Alphabet Shelf Letter A',     col:'storage',  cat:'Organisers & Storage',age:'0-12',ageN:[0,12],price:'₹15,499',url:'https://kiddieskingdom.in/shop/alphabet-shelf-letter-a',                    img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Falphabet-shelf-a%2Fmain.jpg&w=640&q=75', alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Falphabet-shelf-a%2Fcolors.jpg&w=640&q=75'},
  // DIY
  {name:'DIY Tree Painting Kit',       col:'diy',      cat:'DIY Kits',         age:'3-9',  ageN:[3,9],   price:'₹1,200', url:'https://kiddieskingdom.in/shop/diy-tree-painting-kit',                       img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-DY-03-1.png&w=640&q=75',            alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-DY-03-4.png&w=640&q=75'},
];

const SHAPES = {
  rect:         {vb:'0 0 120 80',  s:'<rect x="3" y="3" width="114" height="74" rx="4" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  roundrect:    {vb:'0 0 120 80',  s:'<rect x="3" y="3" width="114" height="74" rx="24" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  circle:       {vb:'0 0 120 120', s:'<ellipse cx="60" cy="60" rx="57" ry="57" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  triangle:     {vb:'0 0 120 120', s:'<polygon points="60,4 116,116 4,116" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  diamond:      {vb:'0 0 120 120', s:'<polygon points="60,4 116,60 60,116 4,60" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  pentagon:     {vb:'0 0 120 120', s:'<polygon points="60,4 114,43 92,110 28,110 6,43" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  hexagon:      {vb:'0 0 120 120', s:'<polygon points="60,4 110,32 110,88 60,116 10,88 10,32" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  octagon:      {vb:'0 0 120 120', s:'<polygon points="38,4 82,4 116,38 116,82 82,116 38,116 4,82 4,38" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  cross:        {vb:'0 0 120 120', s:'<path d="M42,4h36v38h38v36h-38v38h-36v-38H4v-36h38z" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  parallelogram:{vb:'0 0 120 80',  s:'<polygon points="30,4 116,4 90,76 4,76" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  star:         {vb:'0 0 120 120', s:'<polygon points="60,4 73,43 114,43 82,68 93,107 60,84 27,107 38,68 6,43 47,43" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  star4:        {vb:'0 0 120 120', s:'<polygon points="60,4 68,52 116,60 68,68 60,116 52,68 4,60 52,52" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  star6:        {vb:'0 0 120 120', s:'<polygon points="60,4 70,40 105,20 85,55 116,60 85,65 105,100 70,80 60,116 50,80 15,100 35,65 4,60 35,55 15,20 50,40" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  burst:        {vb:'0 0 120 120', s:'<polygon points="60,4 65,44 94,18 77,52 116,50 84,68 108,94 72,82 74,116 56,88 40,116 44,80 8,92 34,68 4,44 42,56 22,22 52,44" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  ribbon:       {vb:'0 0 120 120', s:'<polygon points="60,4 76,50 118,52 86,80 98,118 60,94 22,118 34,80 2,52 44,50" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  'arrow-r':    {vb:'0 0 120 80',  s:'<path d="M4,28h78v-18l36,30-36,30v-18H4z" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  'arrow-l':    {vb:'0 0 120 80',  s:'<path d="M116,28H38v-18L2,40l36,30v-18h78z" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  'arrow-u':    {vb:'0 0 80 120',  s:'<path d="M28,116V38H10L40,2l30,36H52v78z" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  'arrow-d':    {vb:'0 0 80 120',  s:'<path d="M28,4v78H10l30,36 30-36H52V4z" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  'dbl-arrow':  {vb:'0 0 120 80',  s:'<path d="M4,40l28-30v16h56V10l28,30-28,30V54H32v16z" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  speech:       {vb:'0 0 120 100', s:'<path d="M4,4h112v68H54l-24,24V72H4z" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  thought:      {vb:'0 0 120 120', s:'<ellipse cx="60" cy="50" rx="56" ry="38" fill="__F__" stroke="__S__" stroke-width="__W__"/><circle cx="44" cy="96" r="8" fill="__F__" stroke="__S__" stroke-width="__W__"/><circle cx="30" cy="112" r="5" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  cloud:        {vb:'0 0 120 90',  s:'<path d="M30,80 a24,24 0 0,1 0-48 a18,18 0 0,1 36-4 a28,28 0 0,1 46,26 a20,20 0 0,1 -2,26z" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  heart:        {vb:'0 0 120 110', s:'<path d="M60,100C60,100 4,68 4,34 a28,28 0 0,1 56-6 a28,28 0 0,1 56,6C116,68 60,100 60,100z" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  flower:       {vb:'0 0 120 120', s:'<circle cx="60" cy="60" r="18" fill="__F__" stroke="__S__" stroke-width="__W__"/><ellipse cx="60" cy="22" rx="16" ry="20" fill="__F__" stroke="__S__" stroke-width="__W__"/><ellipse cx="60" cy="98" rx="16" ry="20" fill="__F__" stroke="__S__" stroke-width="__W__"/><ellipse cx="22" cy="60" rx="20" ry="16" fill="__F__" stroke="__S__" stroke-width="__W__"/><ellipse cx="98" cy="60" rx="20" ry="16" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  line:         {vb:'0 0 120 20',  s:'<line x1="4" y1="10" x2="116" y2="10" stroke="__S__" stroke-width="__W__" stroke-linecap="round"/>'},
  banner1:      {vb:'0 0 120 70',  s:'<path d="M4,4h112v48l-16,-16H20l-16,16z" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  banner2:      {vb:'0 0 120 120', s:'<path d="M4,4h88l24,56-24,56H4z" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  oval:         {vb:'0 0 120 60',  s:'<ellipse cx="60" cy="30" rx="56" ry="26" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  frame:        {vb:'0 0 120 120', s:'<rect x="4" y="4" width="112" height="112" fill="__F__" stroke="__S__" stroke-width="__W__"/><rect x="16" y="16" width="88" height="88" fill="white" stroke="__S__" stroke-width="2"/>'},
};

function mkSVG(type, f, s, w) {
  const d = SHAPES[type]; if (!d) return '';
  return \`<svg viewBox="\${d.vb}" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" data-type="\${type}" data-f="\${f}" data-s="\${s}" data-w="\${w}">\${d.s.replace(/__F__/g,f).replace(/__S__/g,s).replace(/__W__/g,w)}</svg>\`;
}

const BLOB_COLORS   = ['#8FAF7A','#E8A4B4','#F6B8A6','#D8C3A5','#3F5A45','#F7F3EE','#B5CEAC','#EBF2E5'];
const FILL_COLORS   = ['#EBF2E5','#FDF0F4','#FEF3EF','#F5F0E8','#E8A4B4','#8FAF7A','#ffffff','#3F5A45'];
const DRAW_COLORS   = ['#3F5A45','#2A3828','#8FAF7A','#E8A4B4','#F6B8A6','#D8C3A5','#B5CEAC','#ffffff'];
const NOTE_COLORS   = ['#F7F3EE','#EBF2E5','#FDF0F4','#FEF3EF','#F5F0E8','#3F5A45','#E8A4B4','#8FAF7A','#D8C3A5'];
// ── BOARD BACKGROUNDS ──
const BG_BOARDS = [
  {label:'Cream',      bg:'#F7F3EE',           style:'background:#F7F3EE'},
  {label:'Sage Mist',  bg:'linear-gradient(135deg,#EBF2E5 0%,#F7F3EE 100%)', style:'background:linear-gradient(135deg,#EBF2E5 0%,#F7F3EE 100%)'},
  {label:'Blush Glow', bg:'linear-gradient(135deg,#FDF0F4 0%,#F7F3EE 100%)', style:'background:linear-gradient(135deg,#FDF0F4 0%,#F7F3EE 100%)'},
  {label:'Peach Dawn',  bg:'linear-gradient(135deg,#FEF3EF 0%,#FDF0F4 100%)', style:'background:linear-gradient(135deg,#FEF3EF 0%,#FDF0F4 100%)'},
  {label:'Blush Fade',  bg:'linear-gradient(160deg,#FDF0F4 0%,#F7F3EE 60%,#FEF3EF 100%)', style:'background:linear-gradient(160deg,#FDF0F4 0%,#F7F3EE 60%,#FEF3EF 100%)'},
  {label:'Dot Grid',   bg:'', style:"background:radial-gradient(circle,#D8C3A5 1.2px,transparent 1.2px) 0 0/18px 18px,#F7F3EE"},
  {label:'Checker',    bg:'', style:"background:repeating-conic-gradient(#F0EBE3 0% 25%,#F7F3EE 0% 50%) 0 0/18px 18px"},
  {label:'Stripes',    bg:'', style:"background:repeating-linear-gradient(45deg,#EBF2E5 0,#EBF2E5 1.5px,#F7F3EE 1.5px,#F7F3EE 14px)"},
  {label:'Forest',     bg:'#2A3828', style:'background:#2A3828'},
  {label:'White',      bg:'#FFFFFF', style:'background:#FFFFFF'},
  {label:'Blush Pink', bg:'#FDF0F4', style:'background:#FDF0F4'},
  {label:'Sage Green', bg:'#EBF2E5', style:'background:#EBF2E5'},
];

// ── PALETTE COLOURS (brand + extras) ──
const KK_PALETTE = [
  '#E8A4B4','#C4738A','#8FAF7A','#3F5A45','#F7F3EE',
  '#2A3828','#FFD166','#D8C3A5','#F6B8A6','#B5CEAC',
];

// ── FRAME PRESETS ──
const FRAME_PRESETS = [
  {label:'No Frame', wide:true, fn:()=>removeFrame()},
  {label:'Scallop',  icon:'〜',  fn:()=>applyFrame('scallop')},
  {label:'Stripes',  icon:'▦',   fn:()=>applyFrame('stripes')},
  {label:'Dots',     icon:'⁘',   fn:()=>applyFrame('dots')},
  {label:'Rounded',  icon:'▢',   fn:()=>applyFrame('rounded')},
  {label:'Shadow',   icon:'◨',   fn:()=>applyFrame('shadow')},
];

// ── COLOUR PICKER DATA ──
const SOLID_COLORS = [
  '#000000','#404040','#606060','#808080','#A0A0A0','#C0C0C0','#E0E0E0','#FFFFFF',
  '#FF0000','#FF4444','#FF69B4','#E488DD','#B44FCC','#8B44CC','#5533CC','#3333CC',
  '#009999','#00BBBB','#00DDDD','#44AAFF','#2266FF','#1144CC','#002299','#001177',
  '#00AA44','#44CC66','#88EE66','#CCEE44','#FFCC00','#FF9900','#FF6600','#FF3300',
];
const GRAD_COLORS = [
  'linear-gradient(135deg,#000,#666)',
  'linear-gradient(135deg,#999,#eee)',
  'linear-gradient(135deg,#fff,#ccc)',
  'linear-gradient(135deg,#88EE66,#009944)',
  'linear-gradient(135deg,#AA7700,#FFD166)',
  'linear-gradient(135deg,#9B59B6,#E8A4B4)',
  'linear-gradient(135deg,#1a1a3e,#3a3a7e)',
  'linear-gradient(135deg,#a8edea,#fed6e3)',
  'linear-gradient(135deg,#ff6b6b,#ffeaa7)',
  'linear-gradient(135deg,#a29bfe,#fd79a8)',
  'linear-gradient(135deg,#6c5ce7,#a29bfe)',
  'linear-gradient(135deg,#00b09b,#96c93d)',
  'linear-gradient(135deg,#f7971e,#ffd200)',
  'linear-gradient(135deg,#ee0979,#ff6a00)',
  'linear-gradient(135deg,#3f2b96,#a8c0ff)',
  'linear-gradient(135deg,#56ab2f,#a8e063)',
  'linear-gradient(135deg,#f953c6,#b91d73)',
  'linear-gradient(135deg,#0575e6,#021b79)',
  'linear-gradient(135deg,#fc5c7d,#6a3093)',
  'linear-gradient(135deg,#11998e,#38ef7d)',
  'linear-gradient(135deg,#f64f59,#c471ed,#12c2e9)',
];

// ─── STATE ───
let SEL=null, DRAG=null, zC=10, uid=0, items={};
let mvS=null, rzS=null, rtS=null;
let tool='select', dtool='pen', dcolor='#3F5A45', bsize=4;
let dhist=[], isdrw=false, dctx=null, curPanel='shop';

// ─── INIT ───

// ════════════════════════════════════════
//  FONT PANEL
// ════════════════════════════════════════
const ALL_FONTS = [
  // Serif
  {name:'Cormorant Garamond', family:"'Cormorant Garamond',serif",   cat:'serif'},
  {name:'Playfair Display',   family:"'Playfair Display',serif",     cat:'serif'},
  {name:'Lora',               family:"'Lora',serif",                 cat:'serif'},
  {name:'Georgia',            family:"Georgia,serif",                cat:'serif'},
  {name:'Palatino',           family:"'Palatino',serif",             cat:'serif'},
  {name:'Times New Roman',    family:"'Times New Roman',serif",      cat:'serif'},
  // Sans-serif
  {name:'DM Sans',            family:"'DM Sans',sans-serif",         cat:'sans'},
  {name:'Raleway',            family:"'Raleway',sans-serif",         cat:'sans'},
  {name:'Nunito',             family:"'Nunito',sans-serif",          cat:'sans'},
  {name:'Quicksand',          family:"'Quicksand',sans-serif",       cat:'sans'},
  {name:'Oswald',             family:"'Oswald',sans-serif",          cat:'sans'},
  {name:'Arial',              family:"Arial,sans-serif",             cat:'sans'},
  {name:'Helvetica',          family:"Helvetica,sans-serif",         cat:'sans'},
  {name:'Verdana',            family:"Verdana,sans-serif",           cat:'sans'},
  {name:'Trebuchet MS',       family:"'Trebuchet MS',sans-serif",    cat:'sans'},
  {name:'Tahoma',             family:"Tahoma,sans-serif",            cat:'sans'},
  // Display / Handwriting
  {name:'Dancing Script',     family:"'Dancing Script',cursive",     cat:'display'},
  {name:'Pacifico',           family:"'Pacifico',cursive",           cat:'display'},
  {name:'Caveat',             family:"'Caveat',cursive",             cat:'display'},
  {name:'Satisfy',            family:"'Satisfy',cursive",            cat:'display'},
  {name:'Impact',             family:"Impact,sans-serif",            cat:'display'},
  {name:'Comic Sans MS',      family:"'Comic Sans MS',cursive",      cat:'display'},
  // Mono
  {name:'Courier New',        family:"'Courier New',monospace",      cat:'mono'},
  {name:'Lucida Console',     family:"'Lucida Console',monospace",   cat:'mono'},
];
const DOC_FONTS = new Set(["'Cormorant Garamond',serif","'DM Sans',sans-serif"]);
let _currentFontCat = 'all';
let _currentFontFamily = "'Cormorant Garamond',serif";

function buildFontPanel() {
  buildFontList(ALL_FONTS);
  buildDocFonts();
}
function buildDocFonts() {
  const c = document.getElementById('fp-doc-fonts'); if(!c) return;
  c.innerHTML='';
  DOC_FONTS.forEach(fam => {
    const f = ALL_FONTS.find(x=>x.family===fam)||{name:fam.split(',')[0].replace(/'/g,''),family:fam};
    appendFontItem(c, f);
  });
}
function buildFontList(fonts) {
  const c = document.getElementById('fp-all-fonts'); if(!c) return;
  c.innerHTML='';
  fonts.forEach(f => appendFontItem(c, f));
}
function appendFontItem(container, f) {
  const d = document.createElement('div');
  d.className='fp-font-item'+(f.family===_currentFontFamily?' on':'');
  d.innerHTML=\`<span class="fp-font-name" style="font-family:\${f.family}">\${f.name}</span>\${f.family===_currentFontFamily?'<span class="fp-font-check">✓</span>':''}\`;
  d.addEventListener('click',()=>{
    _currentFontFamily=f.family;
    DOC_FONTS.add(f.family);
    pbFontFamily(f.family);
    const label=document.getElementById('pb-font-label');
    if(label)label.textContent=f.name.length>12?f.name.slice(0,10)+'…':f.name;
    buildFontPanel();
    closeFontPanel();
  });
  container.appendChild(d);
}
function filterFonts(q) {
  const q2=q.toLowerCase();
  const filtered=ALL_FONTS.filter(f=>
    f.name.toLowerCase().includes(q2)||
    (_currentFontCat==='all'||f.cat===_currentFontCat)
  );
  buildFontList(filtered);
}
function filterFontCat(cat,el) {
  _currentFontCat=cat;
  document.querySelectorAll('.fp-cat').forEach(x=>x.classList.remove('on'));
  el.classList.add('on');
  const filtered=cat==='all'?ALL_FONTS:ALL_FONTS.filter(f=>f.cat===cat);
  buildFontList(filtered);
}
function switchFpTab(tab,el) {
  document.querySelectorAll('.fp-tab').forEach(x=>x.classList.remove('on'));
  el.classList.add('on');
}
function openFontPanel() {
  document.getElementById('font-panel').classList.add('open');
  setTimeout(()=>document.getElementById('fp-search').focus(),100);
}
function closeFontPanel() {
  document.getElementById('font-panel').classList.remove('open');
}

// ── Extra text formatting ──
function pbUnderline() {
  if(!SEL) return;
  const el=document.getElementById(SEL);if(!el)return;
  const btn=document.getElementById('pb-underline');
  const on=btn.classList.toggle('on');
  el.querySelectorAll('[contenteditable]').forEach(t=>{
    t.style.textDecoration = on ? 'underline' : (document.getElementById('pb-strike').classList.contains('on')?'line-through':'none');
  });
}
function pbStrike() {
  if(!SEL) return;
  const el=document.getElementById(SEL);if(!el)return;
  const btn=document.getElementById('pb-strike');
  const on=btn.classList.toggle('on');
  el.querySelectorAll('[contenteditable]').forEach(t=>{
    t.style.textDecoration = on ? 'line-through' : (document.getElementById('pb-underline').classList.contains('on')?'underline':'none');
  });
}
function pbSizeStep(d) {
  const inp=document.getElementById('pb-font-sz');if(!inp)return;
  const cur=parseInt(inp.value)||24;
  const nv=Math.max(8,Math.min(120,cur+d));
  inp.value=nv; pbFontSize(nv);
}
function openTextColorPicker() {
  _cpickTarget='fill'; // fill = text colour when text selected
  buildCpick(); positionCpick();
  document.getElementById('cpick-overlay').classList.add('open');
}

// ════════════════════════════════════════
//  CANVAS COLOR PICKER (gradient + hue)
// ════════════════════════════════════════
let _cpickHue = 120;  // start on green
let _cpickSV = {s:0.3, v:0.9};
let _cpickDragging = null;

function initCpickCanvas() {
  const wrap = document.getElementById('cpick-canvas-wrap');
  const hueWrap = document.getElementById('cpick-hue-wrap');
  if (!wrap || !hueWrap) return;
  wrap.addEventListener('mousedown', e=>{_cpickDragging='sv'; cpickSVDrag(e);});
  hueWrap.addEventListener('mousedown', e=>{_cpickDragging='hue'; cpickHueDrag(e);});
  document.addEventListener('mousemove', e=>{
    if(_cpickDragging==='sv') cpickSVDrag(e);
    else if(_cpickDragging==='hue') cpickHueDrag(e);
  });
  document.addEventListener('mouseup', ()=>{_cpickDragging=null;});
  drawCpickCanvas();
}
function drawCpickCanvas() {
  const cvs = document.getElementById('cpick-canvas');if(!cvs)return;
  const ctx = cvs.getContext('2d');
  const w=cvs.offsetWidth||228, h=cvs.offsetHeight||130;
  cvs.width=w; cvs.height=h;
  // base hue color
  const baseColor = hsvToHex(_cpickHue,1,1);
  // white to hue gradient (horizontal)
  const gH = ctx.createLinearGradient(0,0,w,0);
  gH.addColorStop(0,'#fff'); gH.addColorStop(1,baseColor);
  ctx.fillStyle=gH; ctx.fillRect(0,0,w,h);
  // transparent to black gradient (vertical)
  const gV = ctx.createLinearGradient(0,0,0,h);
  gV.addColorStop(0,'rgba(0,0,0,0)'); gV.addColorStop(1,'#000');
  ctx.fillStyle=gV; ctx.fillRect(0,0,w,h);
  // cursor position
  const cur = document.getElementById('cpick-cursor');
  if(cur){ cur.style.left=(_cpickSV.s*100)+'%'; cur.style.top=((1-_cpickSV.v)*100)+'%'; }
  syncCpickColor();
}
function cpickSVDrag(e) {
  const wrap=document.getElementById('cpick-canvas-wrap');if(!wrap)return;
  const r=wrap.getBoundingClientRect();
  _cpickSV.s=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));
  _cpickSV.v=Math.max(0,Math.min(1,1-(e.clientY-r.top)/r.height));
  drawCpickCanvas();
}
function cpickHueDrag(e) {
  const wrap=document.getElementById('cpick-hue-wrap');if(!wrap)return;
  const r=wrap.getBoundingClientRect();
  const pct=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));
  _cpickHue=Math.round(pct*360);
  const thumb=document.getElementById('cpick-hue-thumb');
  if(thumb)thumb.style.left=(pct*100)+'%';
  drawCpickCanvas();
}
function syncCpickColor() {
  const hex=hsvToHex(_cpickHue,_cpickSV.s,_cpickSV.v);
  const rgb=hexToRgb(hex);
  const hexInp=document.getElementById('cpick-hex2');
  if(hexInp)hexInp.value=hex.toUpperCase();
  if(rgb){
    const r=document.getElementById('cpick-r');if(r)r.value=rgb.r;
    const g=document.getElementById('cpick-g');if(g)g.value=rgb.g;
    const b=document.getElementById('cpick-b');if(b)b.value=rgb.b;
  }
  const prev=document.getElementById('cpick-preview');
  if(prev)prev.style.background=hex;
  // live apply
  if(_cpickDragging) cpickApply(hex);
}
function cpickRGBInput() {
  const r=parseInt(document.getElementById('cpick-r').value)||0;
  const g=parseInt(document.getElementById('cpick-g').value)||0;
  const b=parseInt(document.getElementById('cpick-b').value)||0;
  const hex='#'+[r,g,b].map(n=>Math.max(0,Math.min(255,n)).toString(16).padStart(2,'0')).join('');
  updateCpickFromHex(hex);
}
function cpickHex2Input(v) {
  if(v.match(/^#[0-9a-fA-F]{6}$/)) updateCpickFromHex(v);
}
function updateCpickFromHex(hex) {
  const rgb=hexToRgb(hex);if(!rgb)return;
  const hsv=rgbToHsv(rgb.r,rgb.g,rgb.b);
  _cpickHue=hsv.h; _cpickSV={s:hsv.s,v:hsv.v};
  const thumb=document.getElementById('cpick-hue-thumb');
  if(thumb)thumb.style.left=(_cpickHue/360*100)+'%';
  drawCpickCanvas();
  cpickApply(hex);
}
function cpickNativeInput(v) { updateCpickFromHex(v); }
function cpickSearch(q) {
  // filter the visible swatches — highlight matching ones
  // simple: just filter solid colors
  const q2=q.toLowerCase();
  if(!q2){buildCpickSolid();return;}
  const filtered=SOLID_COLORS.filter(c=>c.toLowerCase().includes(q2));
  const r=document.getElementById('cpick-solid-row');
  r.innerHTML='';
  filtered.forEach(c=>{
    const s=document.createElement('div');s.className='cpick-sw';s.style.background=c;s.title=c;
    if(c==='#FFFFFF')s.style.boxShadow='0 0 0 1.5px #ccc';
    s.addEventListener('click',()=>cpickApply(c));r.appendChild(s);
  });
}
function positionCpick(anchorEl) {
  const modal=document.getElementById('cpick-modal');if(!modal)return;
  if(anchorEl) {
    const r=anchorEl.getBoundingClientRect();
    const left=Math.min(r.left, window.innerWidth-270);
    const top=Math.min(r.bottom+6, window.innerHeight-500);
    modal.style.top=top+'px'; modal.style.left=left+'px';
  } else {
    modal.style.top='60px'; modal.style.left='280px';
  }
}

// Color math helpers
function hsvToHex(h,s,v) {
  let r,g,b;const i=Math.floor(h/60)%6,f=h/60-Math.floor(h/60),p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s);
  if(i===0){r=v;g=t;b=p;}else if(i===1){r=q;g=v;b=p;}else if(i===2){r=p;g=v;b=t;}
  else if(i===3){r=p;g=q;b=v;}else if(i===4){r=t;g=p;b=v;}else{r=v;g=p;b=q;}
  return '#'+[r,g,b].map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join('');
}
function hexToRgb(hex) {
  const m=hex.replace('#','').match(/.{2}/g);if(!m||m.length<3)return null;
  return {r:parseInt(m[0],16),g:parseInt(m[1],16),b:parseInt(m[2],16)};
}
function rgbToHsv(r,g,b) {
  r/=255;g/=255;b/=255;
  const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;
  let h=0,s=max===0?0:d/max,v=max;
  if(d!==0){
    if(max===r)h=(g-b)/d+(g<b?6:0);
    else if(max===g)h=(b-r)/d+2;
    else h=(r-g)/d+4;
    h/=6;
  }
  return {h:Math.round(h*360),s,v};
}

// Override openCpick to also draw canvas and init hue from current color


// ════════════════════════════════════════
//  BROWSE PRODUCTS MODAL
// ════════════════════════════════════════
let _bmAgeFilter = '';

function openBrowse() {
  document.getElementById('browse-overlay').classList.add('open');
  bmRender(PRODUCTS);
  setTimeout(()=>document.getElementById('bm-search-inp').focus(), 200);
}
function closeBrowse() {
  document.getElementById('browse-overlay').classList.remove('open');
}

function bmFilter() {
  const q = (document.getElementById('bm-search-inp').value||'').toLowerCase().trim();
  const col = document.getElementById('bm-collection').value;
  let results = PRODUCTS.filter(p => {
    const matchQ  = !q || p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q);
    const matchCol = !col || p.col === col;
    const matchAge = !_bmAgeFilter || bmAgeMatch(p.ageN, _bmAgeFilter);
    return matchQ && matchCol && matchAge;
  });
  bmRender(results);
}

function bmAgeMatch(ageN, filter) {
  if (!ageN) return true;
  const ranges = {'0-1':[0,1],'1-3':[1,3],'3-6':[3,6],'6-12':[6,99]};
  const [lo,hi] = ranges[filter]||[0,99];
  return ageN[0] <= hi && ageN[1] >= lo;
}

function bmAgeFilter(age, el) {
  _bmAgeFilter = age;
  document.querySelectorAll('.bm-age-pill').forEach(p=>p.classList.remove('on'));
  el.classList.add('on');
  bmFilter();
}

function bmRender(products) {
  const grid = document.getElementById('bm-grid');
  const countEl = document.getElementById('bm-count');
  grid.innerHTML = '';
  if (countEl) countEl.textContent = products.length;

  if (products.length === 0) {
    grid.innerHTML = '<div class="bm-empty" style="grid-column:1/-1"><svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" stroke="#E2D9CE" stroke-width="2"/><path d="M14 26c1.5-3 5-5 6-5s4.5 2 6 5" stroke="#8A9B88" stroke-width="1.5" stroke-linecap="round"/><circle cx="15" cy="17" r="2" fill="#8A9B88"/><circle cx="25" cy="17" r="2" fill="#8A9B88"/></svg><div>No products found</div><div style="font-size:11px">Try a different search or filter</div></div>';
    return;
  }

  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'bm-card';

    // Image with graceful fallback
    const imgSrc = p.img;
    const altSrc = p.alt;

    card.innerHTML = \`
      <div class="bm-card-img-wrap">
        <img src="\${imgSrc}"
          onerror="this.onerror=null;this.src='\${altSrc}';this.onerror=function(){this.style.display='none';this.parentNode.innerHTML='<div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0ede8\\'><svg width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 40 40\\' fill=\\'none\\'><rect x=\\'4\\' y=\\'4\\' width=\\'32\\' height=\\'32\\' rx=\\'4\\' stroke=\\'#D8C3A5\\' stroke-width=\\'2\\'/><circle cx=\\'15\\' cy=\\'16\\' r=\\'3\\' fill=\\'#D8C3A5\\'/><path d=\\'M4 28l10-8 8 8 5-5 9 9\\' stroke=\\'#D8C3A5\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'/></svg></div>'};"
          loading="lazy" alt="\${p.name}">
        <div class="bm-card-cat">\${p.cat}</div>
        <div class="bm-card-add">+</div>
      </div>
      <div class="bm-card-body">
        <div class="bm-card-name">\${p.name}</div>
        <div class="bm-card-meta">
          <div class="bm-card-price">\${p.price}</div>
          <div class="bm-card-age">\${p.age} yrs</div>
        </div>
      </div>\`;

    card.addEventListener('click', () => {
      bmAddToCanvas(p, card);
    });

    grid.appendChild(card);
  });
}

function bmAddToCanvas(p, cardEl) {
  // Add flash feedback
  const flash = document.createElement('div');
  flash.className = 'bm-added-flash';
  flash.textContent = '✓';
  cardEl.style.position = 'relative';
  cardEl.appendChild(flash);
  setTimeout(() => flash.remove(), 600);

  // Add to canvas
  const bc = document.getElementById('board-canvas');
  const r = bc.getBoundingClientRect();
  // Scatter placement so multiple products don't stack
  const x = r.width * (0.3 + Math.random() * 0.4);
  const y = r.height * (0.25 + Math.random() * 0.35);
  spawnProduct(p, x, y);
  refHint(); refCount();
  toast('Added to board — close modal to arrange');
}

// Keyboard: Escape closes browse modal
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    if (document.getElementById('browse-overlay').classList.contains('open')) {
      closeBrowse();
    }
  }
}, true);


function init() {
  renderProducts(PRODUCTS);
  buildRow('blob-row', BLOB_COLORS, c => { DRAG={type:'blob',color:c}; }, true);
  buildBGs();
  buildPalette();
  buildFrames();
  buildNoteGrid();
  buildDrawColors();
  buildFontPanel();
  initDrawCanvas();
  initCpickCanvas();
  openPanel('shop', document.getElementById('rb-shop'));
}

function renderProducts(arr) {
  const g = document.getElementById('prod-grid');
  g.innerHTML = '';
  arr.forEach(p => {
    const d = document.createElement('div');
    d.className = 'prod-card';
    d.draggable = true;
    d.innerHTML = \`<img src="\${p.img}" onerror="this.src='\${p.alt}'" loading="lazy">
      <div class="pc-cat">\${p.age}</div>
      <div class="pc-name">\${p.name}</div>
      <div class="pc-price">\${p.price}</div>\`;
    const img = d.querySelector('img');
    d.addEventListener('mouseenter', () => img.src = p.alt);
    d.addEventListener('mouseleave', () => img.src = p.img);
    d.addEventListener('dragstart', () => { DRAG = {type:'product', p}; });
    d.addEventListener('dragend', hideDOL);
    g.appendChild(d);
  });
}
function filterCat(cat, el) {
  document.querySelectorAll('.cpill').forEach(x => x.classList.remove('on'));
  el.classList.add('on');
  renderProducts(cat==='all' ? PRODUCTS : PRODUCTS.filter(p=>p.cat===cat));
}

function buildRow(id, colors, clickFn, draggable) {
  const r = document.getElementById(id);
  if (!r) return;
  colors.forEach(c => {
    const s = document.createElement('div');
    s.className = 'csw';
    s.style.background = c;
    if (c === '#ffffff' || c === '#F7F3EE') s.style.boxShadow = '0 0 0 1.5px #ccc';
    if (draggable) { s.draggable = true; s.addEventListener('dragstart', () => { DRAG={type:'blob',color:c}; }); }
    s.addEventListener('click', () => clickFn(c));
    r.appendChild(s);
  });
}
// ── BUILD BACKGROUND GRID ──
function buildBGs() {
  const g = document.getElementById('bg-grid');
  if (!g) return;
  g.innerHTML = '';
  BG_BOARDS.forEach((b, i) => {
    const d = document.createElement('div');
    d.className = 'bg-thumb' + (i===0?' on':'');
    d.style.cssText = b.style;
    // special patterns need inline style for thumb preview
    if (b.label==='Dot Grid') d.style.cssText = "background:radial-gradient(circle,#D8C3A5 1.2px,transparent 1.2px) 0 0/6px 6px,#F7F3EE;border-radius:12px;cursor:pointer;border:2.5px solid transparent;box-shadow:0 1px 6px rgba(42,56,40,.1);transition:all .18s;aspect-ratio:1;position:relative;overflow:hidden;flex-shrink:0";
    if (b.label==='Checker') d.style.cssText = "background:repeating-conic-gradient(#F0EBE3 0% 25%,#F7F3EE 0% 50%) 0 0/8px 8px;border-radius:12px;cursor:pointer;border:2.5px solid transparent;box-shadow:0 1px 6px rgba(42,56,40,.1);transition:all .18s;aspect-ratio:1;position:relative;overflow:hidden;flex-shrink:0";
    if (b.label==='Stripes') d.style.cssText = "background:repeating-linear-gradient(45deg,#EBF2E5 0,#EBF2E5 2px,#F7F3EE 2px,#F7F3EE 8px);border-radius:12px;cursor:pointer;border:2.5px solid transparent;box-shadow:0 1px 6px rgba(42,56,40,.1);transition:all .18s;aspect-ratio:1;position:relative;overflow:hidden;flex-shrink:0";
    const lbl = document.createElement('div');lbl.className='bg-thumb-label';lbl.textContent=b.label;
    d.appendChild(lbl);
    d.addEventListener('click', () => {
      document.querySelectorAll('.bg-thumb').forEach(x=>x.classList.remove('on'));
      d.classList.add('on');
      const bc = document.getElementById('board-canvas');
      const bgVal = b.style.startsWith('background:') ? b.style.slice('background:'.length).trim() : b.style;
      bc.style.background = bgVal;
    });
    g.appendChild(d);
  });
}

// ── BUILD PALETTE ROW ──
function buildPalette() {
  const r = document.getElementById('palette-row');
  if (!r) return;
  KK_PALETTE.forEach(c => {
    const d = document.createElement('div');
    d.className = 'pal-dot';
    d.style.background = c;
    if (c==='#F7F3EE') d.style.boxShadow='0 0 0 1.5px #ccc';
    d.title = c;
    d.addEventListener('click', () => {
      if (SEL) applyFill(c);
      else { document.getElementById('board-canvas').style.background=c; }
    });
    r.appendChild(d);
  });
}

// ── BUILD FRAME GRID ──
function buildFrames() {
  const g = document.getElementById('frame-grid');
  if (!g) return;
  g.innerHTML = '';
  FRAME_PRESETS.forEach(f => {
    const d = document.createElement('div');
    d.className = 'frame-opt' + (f.wide?' wide':'') + (f.label==='No Frame'?' on':'');
    if (f.wide) {
      d.innerHTML = '<div class="frame-preview"></div>' + f.label;
    } else {
      d.innerHTML = '<span class="fi">' + f.icon + '</span>' + f.label;
    }
    d.addEventListener('click', () => {
      document.querySelectorAll('.frame-opt').forEach(x=>x.classList.remove('on'));
      d.classList.add('on');
      f.fn();
    });
    g.appendChild(d);
  });
}
function removeFrame() {
  const bc = document.getElementById('board-canvas');
  bc.style.borderRadius='';bc.style.outline='';bc.style.boxShadow='';bc.style.padding='';
}
function applyFrame(type) {
  const bc = document.getElementById('board-canvas');
  if(type==='rounded'){bc.style.borderRadius='28px';bc.style.outline='';bc.style.boxShadow='';}
  else if(type==='shadow'){bc.style.boxShadow='inset 0 0 60px rgba(42,56,40,.15)';bc.style.borderRadius='';}
  else if(type==='scallop'){bc.style.borderRadius='2px';bc.style.boxShadow='0 0 0 8px #F7F3EE, 0 0 0 12px var(--sage-l)';}
  else if(type==='stripes'){bc.style.outline='8px solid';bc.style.outlineStyle='dashed';bc.style.outlineColor='var(--sage)';}
  else if(type==='dots'){bc.style.outline='6px dotted var(--sage-d)';}
}

// ── COLOUR PICKER ──
let _cpickTarget = 'fill';
const _docColors = new Set();

function openCpick(target, anchorEl) {
  _cpickTarget = target;
  buildCpick();
  let currentColor = '#3F5A45';
  if(SEL){
    const el=document.getElementById(SEL);
    if(el){
      const svg=el.querySelector('svg[data-type]');
      if(target==='fill'&&svg) currentColor=svg.dataset.f||'#EBF2E5';
      else if(target==='stroke'&&svg) currentColor=svg.dataset.s||'#8FAF7A';
      const text=el.querySelector('[contenteditable]');
      if(text&&target==='fill') currentColor=text.style.color||'#3F5A45';
    }
  }
  const hex=currentColor.startsWith('#')?currentColor:'#3F5A45';
  try{ updateCpickFromHex(hex); }catch(e){}
  positionCpick(anchorEl||null);
  document.getElementById('cpick-overlay').classList.add('open');
}
function closeCpick() {
  document.getElementById('cpick-overlay').classList.remove('open');
}
function cpickApply(color) {
  if (_cpickTarget==='fill') {
    pbFill(color);
    const inp = document.getElementById('pb-fill'); if(inp) inp.value = rgbToHex(color);
  } else if (_cpickTarget==='stroke') {
    pbStroke(color);
    const inp = document.getElementById('pb-stroke-c'); if(inp) inp.value = rgbToHex(color);
  } else if (_cpickTarget==='canvas') {
    document.getElementById('board-canvas').style.background = color;
  }
  if(color!=='transparent'){ _docColors.add(color); buildCpickDocRow(); }
  const hexInp = document.getElementById('cpick-hex-inp'); if(hexInp) hexInp.value = color;
  closeCpick();
}
function cpickHexInput(v) {
  if(v.match(/^#[0-9a-fA-F]{6}$/)) {
    document.getElementById('cpick-native-inp').value=v;
    cpickApply(v);
  }
}
function cpickNativeInput(v) {
  document.getElementById('cpick-hex-inp').value=v;
  cpickApply(v);
}
function buildCpick() {
  buildCpickDocRow();
  buildCpickBrand();
  buildCpickSolid();
  buildCpickGrad();
}
function buildCpickDocRow() {
  const r = document.getElementById('cpick-doc-row');
  // keep first 2 static buttons, remove dynamic swatches
  while(r.children.length>2) r.removeChild(r.lastChild);
  _docColors.forEach(c => {
    const s = document.createElement('div');
    s.className='cpick-sw'; s.style.background=c; s.title=c;
    s.addEventListener('click',()=>cpickApply(c));
    r.appendChild(s);
  });
}
function buildCpickBrand() {
  const r = document.getElementById('cpick-brand-row');
  r.innerHTML='';
  KK_PALETTE.forEach(c => {
    const s = document.createElement('div');
    s.className='cpick-sw'; s.style.background=c; s.title=c;
    if(c==='#F7F3EE')s.style.boxShadow='0 0 0 1.5px #ccc';
    s.addEventListener('click',()=>cpickApply(c));
    r.appendChild(s);
  });
}
function buildCpickSolid() {
  const r = document.getElementById('cpick-solid-row');
  r.innerHTML='';
  SOLID_COLORS.forEach(c => {
    const s = document.createElement('div');
    s.className='cpick-sw'; s.style.background=c; s.title=c;
    if(c==='#FFFFFF')s.style.boxShadow='0 0 0 1.5px #ccc';
    s.addEventListener('click',()=>cpickApply(c));
    r.appendChild(s);
  });
}
function buildCpickGrad() {
  const r = document.getElementById('cpick-grad-row');
  r.innerHTML='';
  GRAD_COLORS.forEach(g => {
    const s = document.createElement('div');
    s.className='cpick-sw grad'; s.style.background=g;
    s.addEventListener('click',()=>{
      // for gradients, apply to board background instead if no item selected
      if(SEL){ const el=document.getElementById(SEL); if(el){ const b=el.querySelector('.bi-blob'); if(b)b.style.background=g; } }
      else { document.getElementById('board-canvas').style.background=g; }
      closeCpick();
    });
    r.appendChild(s);
  });
}
function buildNoteGrid() {
  const g = document.getElementById('note-grid');
  NOTE_COLORS.forEach(c => {
    const d = document.createElement('div');
    d.className = 'note-swatch';
    d.style.background = c;
    d.style.color = c==='#3F5A45'||c==='#2A3828'?'#fff':'#2A3828';
    d.textContent = 'Aa';
    d.style.fontFamily = "'Cormorant Garamond',serif";
    d.style.fontWeight = '600';
    d.addEventListener('click', () => addSticky(c));
    g.appendChild(d);
  });
}
function buildDrawColors() {
  const r = document.getElementById('draw-cols');
  DRAW_COLORS.forEach(c => {
    const d = document.createElement('div');
    d.className = 'draw-col' + (c===dcolor?' on':'');
    d.style.background = c;
    if (c==='#ffffff') d.style.boxShadow='0 0 0 1px #ccc';
    d.addEventListener('click', () => {
      dcolor = c;
      document.getElementById('draw-color-inp').value = c==='#ffffff'?'#ffffff':c;
      document.querySelectorAll('.draw-col').forEach(x=>x.classList.remove('on'));
      d.classList.add('on');
    });
    r.appendChild(d);
  });
}

// ─── PANEL ───
const PTITLES = {shop:'Shop Products', elements:'Elements', shapes:'Shapes', draw:'Draw Tools', notes:'Sticky Notes', styles:'Styles'};
function openPanel(name, btn) {
  document.querySelectorAll('.rbt').forEach(b=>b.classList.remove('on'));
  if (btn) btn.classList.add('on');
  if (curPanel===name && !document.getElementById('panel').classList.contains('closed')) { closePanel(); return; }
  curPanel = name;
  document.querySelectorAll('[id^=pnl-]').forEach(p=>p.classList.add('hidden'));
  document.getElementById('pnl-'+name).classList.remove('hidden');
  document.getElementById('panel-title').textContent = PTITLES[name]||name;
  document.getElementById('panel').classList.remove('closed');
}
function closePanel() {
  document.getElementById('panel').classList.add('closed');
  document.querySelectorAll('.rbt').forEach(b=>b.classList.remove('on'));
  curPanel='';
}

// ─── DRAW ───
function initDrawCanvas() {
  const cvs=document.getElementById('draw-canvas'), w=document.getElementById('canvas-wrap');
  cvs.width=w.offsetWidth; cvs.height=w.offsetHeight;
  dctx=cvs.getContext('2d');
  cvs.addEventListener('mousedown',startDraw);
  cvs.addEventListener('mousemove',moveDraw);
  cvs.addEventListener('mouseup',endDraw);
  cvs.addEventListener('mouseleave',endDraw);
}
function setTool(t) {
  tool=t;
  // update rail tool buttons
  document.querySelectorAll('[id^=tt-]').forEach(b=>b.classList.remove('on'));
  const b=document.getElementById('tt-'+t); if(b)b.classList.add('on');
  const cvs=document.getElementById('draw-canvas');
  if(t==='draw'){cvs.classList.add('active');openPanel('draw',document.getElementById('rb-draw'));}
  else{cvs.classList.remove('active');}
}
function selDT(t,el){dtool=t;document.querySelectorAll('.dt-btn').forEach(d=>d.classList.remove('on'));el.classList.add('on');}
function updBrush(v){bsize=parseInt(v);document.getElementById('brush-val').textContent=v;}
function updDrawColor(c){dcolor=c;}
let ldx=0,ldy=0;
function startDraw(e){if(tool!=='draw')return;isdrw=true;const r=document.getElementById('draw-canvas').getBoundingClientRect();ldx=e.clientX-r.left;ldy=e.clientY-r.top;dctx.beginPath();dctx.moveTo(ldx,ldy);}
function moveDraw(e){
  if(!isdrw)return;
  const r=document.getElementById('draw-canvas').getBoundingClientRect();
  const x=e.clientX-r.left,y=e.clientY-r.top;
  dctx.lineCap='round';dctx.lineJoin='round';
  if(dtool==='eraser'){dctx.globalCompositeOperation='destination-out';dctx.lineWidth=bsize*3;dctx.strokeStyle='rgba(0,0,0,1)';dctx.globalAlpha=1;}
  else{dctx.globalCompositeOperation='source-over';dctx.lineWidth=dtool==='marker'?bsize*2.5:bsize;dctx.globalAlpha=dtool==='highlighter'?0.4:1;dctx.strokeStyle=dcolor;}
  dctx.lineTo(x,y);dctx.stroke();dctx.beginPath();dctx.moveTo(x,y);ldx=x;ldy=y;
}
function endDraw(){if(!isdrw)return;isdrw=false;dctx.globalAlpha=1;dctx.globalCompositeOperation='source-over';dhist.push(dctx.getImageData(0,0,dctx.canvas.width,dctx.canvas.height));if(dhist.length>40)dhist.shift();}
function undoDraw(){dhist.pop();if(dhist.length>0)dctx.putImageData(dhist[dhist.length-1],0,0);else dctx.clearRect(0,0,dctx.canvas.width,dctx.canvas.height);toast('Drawing undone');}
function clearDraw(){dctx.clearRect(0,0,dctx.canvas.width,dctx.canvas.height);dhist=[];toast('Drawing cleared');}

// ─── DRAG/DROP ───
function dg(e,type,val){DRAG={type,val};e.dataTransfer.effectAllowed='copy';}
function hideDOL(){document.getElementById('drop-overlay').classList.remove('show');}
function onBoardDrop(e){
  e.preventDefault();hideDOL();if(!DRAG)return;
  const w=document.getElementById('canvas-wrap'),r=w.getBoundingClientRect();
  const x=e.clientX-r.left,y=e.clientY-r.top;
  const d={...DRAG};DRAG=null;
  if(d.type==='product')spawnProduct(d.p,x,y);
  else if(d.type==='blob')spawnBlob(d.color,x,y);
  else if(d.type==='sticker')spawnSticker(d.val,x,y);
  else if(d.type==='upload')spawnUpload(d.url,d.name,x,y);
  else spawnEl(d.type,x,y);
  refHint();refCount();
}
function onBoardMD(e){if(e.target.id==='canvas-wrap'||e.target.id==='board-canvas'||e.target.closest('.hint-wrap'))deselectAll();}

// ─── MOUNT ───
function mkId(){return 'b'+(++uid);}
function mount(el,id,x,y,w,h){
  el.id=id;el.className='bitem';
  el.style.left=(x-w/2)+'px';el.style.top=(y-h/2)+'px';
  el.style.width=w+'px';el.style.height=h+'px';
  el.style.zIndex=++zC;
  items[id]={rot:0,sx:1,sy:1,locked:false};
  attachH(el,id);
  document.getElementById('board-canvas').appendChild(el);
  el.addEventListener('mousedown',ev=>onItemMD(ev,id));
  selectItem(id);
}
function attachH(el,id){
  // ── MOVE HANDLE (top-left, 4-arrow icon) ──
  const mh=document.createElement('div');
  mh.className='move-handle';
  mh.title='Drag to move';
  mh.innerHTML='<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 1v12M4 4l3-3 3 3M4 10l3 3 3-3M1 7h12M4 4l-3 3 3 3M10 4l3 3-3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  mh.addEventListener('mousedown', e => {
    e.stopPropagation(); e.preventDefault();
    selectItem(id);
    el.classList.add('dragging');
    const wrap=document.getElementById('canvas-wrap'), wr=wrap.getBoundingClientRect();
    mvS={id, ox:e.clientX-wr.left-parseInt(el.style.left), oy:e.clientY-wr.top-parseInt(el.style.top)};
  });
  el.appendChild(mh);

  // ── INLINE QUICK BAR (below item, Canva style) ──
  const tb=document.createElement('div');tb.className='tbar';
  tb.innerHTML=
    '<button class="tb del" data-a="del" title="Delete">'+
      '<svg viewBox="0 0 14 14" fill="none" width="13" height="13"><path d="M2 4h10M5 4V2h4v2M5.5 6.5v4M8.5 6.5v4M3 4l.7 7.3A1 1 0 0 0 4.7 12h4.6a1 1 0 0 0 1-.7L11 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>'+
    '</button>'+
    '<span class="t-sep"></span>'+
    '<button class="tb" data-a="fwd" title="Bring forward">'+
      '<svg viewBox="0 0 14 14" fill="none" width="13" height="13"><rect x="4" y="5" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="2" y="1" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5" opacity=".45"/></svg>'+
    '</button>'+
    '<button class="tb" data-a="bwd" title="Send backward">'+
      '<svg viewBox="0 0 14 14" fill="none" width="13" height="13"><rect x="4" y="1" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="2" y="5" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5" opacity=".45"/></svg>'+
    '</button>'+
    '<span class="t-sep"></span>'+
    '<button class="tb" data-a="dup" title="Duplicate (Ctrl+D)">'+
      '<svg viewBox="0 0 14 14" fill="none" width="13" height="13"><rect x="4" y="4" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M1 10V2a1 1 0 0 1 1-1h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'+
    '</button>'+
    '<button class="tb" data-a="lk" title="Lock/Unlock">'+
      '<svg viewBox="0 0 14 14" fill="none" width="13" height="13"><rect x="3" y="6" width="8" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M5 6V4a2 2 0 1 1 4 0v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'+
    '</button>'+
    '<span class="t-sep"></span>'+
    '<button class="tb" data-a="rl" title="Rotate left 15°">'+
      '<svg viewBox="0 0 14 14" fill="none" width="13" height="13"><path d="M2 7A5 5 0 1 1 7 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M2 4v3h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'+
    '</button>'+
    '<button class="tb" data-a="rr" title="Rotate right 15°">'+
      '<svg viewBox="0 0 14 14" fill="none" width="13" height="13"><path d="M12 7A5 5 0 1 0 7 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 4v3h-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'+
    '</button>';
  tb.addEventListener('mousedown',e=>e.stopPropagation());
  tb.addEventListener('click',e=>{
    const a=e.target.closest('[data-a]');if(!a)return;e.stopPropagation();
    const act=a.dataset.a;
    if(act==='rl')rotI(id,-15);
    if(act==='rr')rotI(id,15);
    if(act==='dup')dupeI(id);
    if(act==='lk')lockI(id);
    if(act==='fwd'){document.getElementById(id).style.zIndex=++zC;}
    if(act==='bwd'){const e2=document.getElementById(id);e2.style.zIndex=Math.max(1,parseInt(e2.style.zIndex||10)-2);}
    if(act==='del')removeI(id);
  });
  el.appendChild(tb);
  // rotate handle
  const rh=document.createElement('div');rh.className='rot-handle';rh.innerHTML='&#8635;';
  rh.addEventListener('mousedown',e=>{e.stopPropagation();e.preventDefault();startRot(e,id);});
  el.appendChild(rh);
  // 8 resize handles
  ['nw','nm','ne','wm','em','sw','sm','se'].forEach(pos=>{
    const r=document.createElement('div');r.className='rh '+pos;
    r.addEventListener('mousedown',e=>{e.stopPropagation();e.preventDefault();startRz(e,id,pos);});
    el.appendChild(r);
  });
  // right-click context menu
  el.addEventListener('contextmenu',e=>{e.preventDefault();e.stopPropagation();showCtxMenu(e,id);});
}

// ─── SPAWN ───
function spawnProduct(p,x,y){
  const id=mkId(),el=document.createElement('div');
  const imgSrc = p.img || '';
  const altSrc = p.alt || imgSrc;
  const pol=Math.random()>.45;
  const onerr = \`this.onerror=null;this.src='\${altSrc}'\`;
  if(pol){
    el.innerHTML=\`<div class="bi-pol"><img src="\${imgSrc}" onerror="\${onerr}"><div class="pl">\${p.name}</div></div>\`;
  } else {
    el.innerHTML=\`<div class="bi-img"><img src="\${imgSrc}" onerror="\${onerr}" style="width:100%;height:100%;object-fit:cover;display:block"></div>\`;
  }
  mount(el,id,x,y,165,165);
}
function spawnBlob(c,x,y){const id=mkId();const sz=50+Math.random()*70|0;const el=document.createElement('div');el.innerHTML=\`<div class="bi-blob" style="background:\${c}"></div>\`;mount(el,id,x,y,sz,sz);}
function spawnSticker(v,x,y){const id=mkId(),el=document.createElement('div');el.innerHTML=\`<div class="bi-sticker">\${v}</div>\`;mount(el,id,x,y,72,72);}
function mked(tag,cls,txt,bg,fg){const d=document.createElement(tag);d.className=cls;d.contentEditable='true';d.spellcheck=false;d.textContent=txt;if(bg)d.style.background=bg;if(fg)d.style.color=fg;d.addEventListener('mousedown',e=>e.stopPropagation());return d;}
function spawnEl(type,x,y){
  const id=mkId(),el=document.createElement('div');

  // ── WASHI TAPES ──
  const WASHI_STYLES = {
    'washi-pink':  'repeating-linear-gradient(90deg,#f2a8b8 0,#f2a8b8 10px,#e8d0d8 10px,#e8d0d8 20px)',
    'washi-sage':  'repeating-linear-gradient(90deg,#8FAF7A 0,#8FAF7A 10px,#c5dab8 10px,#c5dab8 20px)',
    'washi-wood':  'repeating-linear-gradient(90deg,#D8C3A5 0,#D8C3A5 10px,#e8d5bc 10px,#e8d5bc 20px)',
    'washi-cream': 'repeating-linear-gradient(90deg,#e8e0d0 0,#e8e0d0 10px,#f5f0e8 10px,#f5f0e8 20px)',
    'washi-blush': 'repeating-linear-gradient(90deg,#E8A4B4 0,#E8A4B4 10px,#fad8e0 10px,#fad8e0 20px)',
    'washi-dark':  'repeating-linear-gradient(90deg,#3F5A45 0,#3F5A45 10px,#5a7d62 10px,#5a7d62 20px)',
    'washi-dot':   'radial-gradient(circle,#E8A4B4 2.5px,transparent 2.5px) 0 0/14px 14px,#fdf0f4',
    'washi-stripe':'repeating-linear-gradient(135deg,#8FAF7A 0,#8FAF7A 4px,#EBF2E5 4px,#EBF2E5 14px)',
    'washi':       'repeating-linear-gradient(90deg,#8FAF7A 0,#8FAF7A 10px,#FFD93D 10px,#FFD93D 20px)',
  };
  if (WASHI_STYLES[type]) {
    el.innerHTML=\`<div style="width:100%;height:100%;background:\${WASHI_STYLES[type]};border-radius:2px;opacity:.88"></div>\`;
    mount(el,id,x,y,160,22); return;
  }

  // ── TAPE STRIPS ──
  if (type==='tape-clear'){
    el.innerHTML=\`<div style="width:100%;height:100%;background:rgba(200,210,230,.3);border:1px solid rgba(150,170,200,.35);border-radius:2px;backdrop-filter:blur(1px)"></div>\`;
    mount(el,id,x,y,120,22); return;
  }
  if (type==='tape-kraft'){
    el.innerHTML=\`<div style="width:100%;height:100%;background:#c4a882;border-radius:2px;opacity:.9"></div>\`;
    mount(el,id,x,y,120,22); return;
  }
  if (type==='tape-white'){
    el.innerHTML=\`<div style="width:100%;height:100%;background:rgba(255,255,255,.92);border:1px solid #ddd;border-radius:2px"></div>\`;
    mount(el,id,x,y,120,22); return;
  }
  if (type==='tape-red'){
    el.innerHTML=\`<div style="width:100%;height:100%;background:#e04040;border-radius:2px;opacity:.9"></div>\`;
    mount(el,id,x,y,120,22); return;
  }

  // ── CHECKER PATTERNS ──
  const CHECKER_STYLES = {
    'checker-pink':       ['#F2A8B8','#fff'],
    'checker-sage':       ['#8FAF7A','#EBF2E5'],
    'checker-bw':         ['#222','#fff'],
    'checker-blush':      ['#E8A4B4','#fdf0f4'],
    'checker-wood':       ['#D8C3A5','#f5f0e8'],
    'checker-dark':       ['#3F5A45','#EBF2E5'],
    'checker-blue-yellow':['#5080E0','#F5E070'],
    'checker-lavender':   ['#B8A8E8','#E8E0F8'],
    'checker-red-blk':    ['#222','#fff'],
    'checker-light-blue': ['#88B8E8','#E8F0F8'],
    'checker-red':        ['#C03040','#FFC8CC'],
    'checker-blue-soft':  ['#7890E8','#F5F8FF'],
    'checker-green-dark': ['#1A5030','#D0E8D8'],
  };
  if (CHECKER_STYLES[type]) {
    const [c1,c2]=CHECKER_STYLES[type];
    el.innerHTML=\`<div style="width:100%;height:100%;background:repeating-conic-gradient(\${c1} 0% 25%,\${c2} 0% 50%) 0 0/20px 20px;border-radius:6px"></div>\`;
    mount(el,id,x,y,160,160); return;
  }

  // ── DECORATIVE LABELS ──
  const LABEL_SVGS = {
    'label-ribbon': {w:200,h:52,svg:\`<svg viewBox="0 0 200 52" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><path d="M6,4h188l-16,22 16,22H6l16-22z" fill="#e04040"/><text x="100" y="31" font-size="14" fill="#fff" text-anchor="middle" font-family="DM Sans,sans-serif" font-weight="700">LABEL</text></svg>\`},
    'label-tag':    {w:180,h:50,svg:\`<svg viewBox="0 0 180 50" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect x="4" y="4" width="172" height="42" rx="6" fill="#3F5A45"/><circle cx="18" cy="25" r="5" fill="#fff" opacity=".7"/><text x="100" y="30" font-size="13" fill="#fff" text-anchor="middle" font-family="DM Sans,sans-serif" font-weight="600">TAG</text></svg>\`},
    'label-flower': {w:200,h:50,svg:\`<svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect x="18" y="6" width="176" height="38" rx="6" fill="#FFD166"/><ellipse cx="18" cy="25" rx="14" ry="14" fill="#F6B8A6"/><text x="112" y="30" font-size="12" fill="#3F5A45" text-anchor="middle" font-family="DM Sans,sans-serif" font-weight="700">NOTE</text></svg>\`},
    'label-scroll': {w:200,h:50,svg:\`<svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><path d="M14,4 C6,4 6,46 14,46h172V6H14z M14,4 C22,4 22,46 14,46" fill="#D8C3A5" stroke="#b8a080" stroke-width="1.5"/><text x="106" y="30" font-size="13" fill="#3F5A45" text-anchor="middle" font-family="Cormorant Garamond,serif" font-style="italic" font-size="15">scroll</text></svg>\`},
    'label-banner': {w:200,h:48,svg:\`<svg viewBox="0 0 200 48" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><path d="M4,4h192v32l-14,-14H18l-14,14z" fill="#8FAF7A"/><text x="100" y="26" font-size="13" fill="#fff" text-anchor="middle" font-family="DM Sans,sans-serif" font-weight="700">BANNER</text></svg>\`},
    'label-stamp':  {w:160,h:52,svg:\`<svg viewBox="0 0 160 52" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect x="4" y="4" width="152" height="44" rx="22" fill="none" stroke="#3F5A45" stroke-width="3" stroke-dasharray="5,3"/><text x="80" y="31" font-size="13" fill="#3F5A45" text-anchor="middle" font-family="DM Sans,sans-serif" font-weight="700">STAMP</text></svg>\`},
  };
  if (LABEL_SVGS[type]) {
    const {w,h,svg}=LABEL_SVGS[type];
    el.innerHTML=svg; mount(el,id,x,y,w,h); return;
  }

  // ── ORIGINAL ELEMENTS ──
  if(type==='tape'){el.innerHTML='<div class="bi-tape"></div>';mount(el,id,x,y,110,22);return;}
  if(type==='washi'){el.innerHTML='<div class="bi-washi"></div>';mount(el,id,x,y,130,18);return;}
  if(type==='tag'){const d=mked('div','bi-tag','Montessori','#3F5A45','#fff');el.appendChild(d);mount(el,id,x,y,130,34);setTimeout(()=>d.focus(),50);return;}
  if(type==='badge'){const d=mked('div','bi-badge','Natural Toy','#8FAF7A','#fff');el.appendChild(d);mount(el,id,x,y,130,32);setTimeout(()=>d.focus(),50);return;}
  if(type==='bubble'){const d=mked('div','bi-bubble','So cute!');el.appendChild(d);mount(el,id,x,y,130,38);setTimeout(()=>d.focus(),50);return;}
  if(type==='heading'){const d=mked('div','bi-text','Kids Room');el.appendChild(d);mount(el,id,x,y,200,52);setTimeout(()=>d.focus(),50);return;}
  if(type==='caption'){const d=mked('div','bi-caption','MONTESSORI INSPIRED');el.appendChild(d);mount(el,id,x,y,220,26);setTimeout(()=>d.focus(),50);return;}
}

// ── POLAROID FRAME SPAWNER ──
function addPolaroid(style) {
  const id=mkId(), el=document.createElement('div');
  const bc=document.getElementById('board-canvas');
  const r=bc.getBoundingClientRect();
  const x=r.width/2, y=r.height/2;

  const STYLES = {
    classic: {bg:'#fff',    border:'1px solid #ddd', shadow:'0 6px 20px rgba(0,0,0,.15)', captionColor:'#888', imgBg:'#f0f0f0'},
    cream:   {bg:'#f5f0e5', border:'1px solid #ddd', shadow:'0 6px 20px rgba(0,0,0,.12)', captionColor:'#a08060', imgBg:'#e8e0cc'},
    shadow:  {bg:'#fff',    border:'1px solid #ddd', shadow:'6px 6px 0 #ccc, 0 6px 20px rgba(0,0,0,.1)', captionColor:'#888', imgBg:'#222'},
    pink:    {bg:'#fff',    border:'4px solid #E8A4B4', shadow:'0 6px 20px rgba(232,164,180,.3)', captionColor:'#c4687a', imgBg:'#fdf0f4'},
    sage:    {bg:'#fff',    border:'4px solid #8FAF7A', shadow:'0 6px 20px rgba(143,175,122,.3)', captionColor:'#5e7d5f', imgBg:'#EBF2E5'},
    dark:    {bg:'#1a1a1a', border:'1px solid #000',   shadow:'0 6px 20px rgba(0,0,0,.5)',   captionColor:'#666',  imgBg:'#111'},
    kraft:   {bg:'#C8B89A', border:'1px solid #a08060',shadow:'0 6px 20px rgba(0,0,0,.15)', captionColor:'#7a6040', imgBg:'#a08060'},
    tape:    {bg:'#fff',    border:'1px solid #ddd', shadow:'0 6px 20px rgba(0,0,0,.15)', captionColor:'#888', imgBg:'#f0f0f0', tape:true},
    stack:   {bg:'#fff',    border:'1px solid #ddd', shadow:'0 6px 20px rgba(0,0,0,.15)', captionColor:'#888', imgBg:'#f0f0f0', stack:true},
  };
  const s=STYLES[style]||STYLES.classic;
  const iconColor = (style==='dark'||style==='shadow')?'#444':'#ccc';
  const imgIcon = \`<svg width="28" height="22" viewBox="0 0 28 22" fill="none"><rect x="1" y="1" width="26" height="20" rx="2" stroke="\${iconColor}" stroke-width="1.5" stroke-dasharray="3,2"/><circle cx="9" cy="8" r="2" fill="\${iconColor}"/><path d="M1 16l6-5 5 5 4-4 11 8" stroke="\${iconColor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>\`;
  let wrapper = '';
  if (s.stack) {
    wrapper = \`<div style="position:relative;width:100%;height:100%">
      <div style="position:absolute;inset:0;background:#fff;border:1px solid #ddd;transform:rotate(5deg);box-shadow:2px 2px 6px rgba(0,0,0,.1)"></div>
      <div style="position:absolute;inset:0;background:#fff;border:1px solid #ddd;transform:rotate(-4deg);box-shadow:2px 2px 6px rgba(0,0,0,.1)"></div>
      <div class="bi-pol" style="position:relative;background:#fff;border:1px solid #ddd;box-shadow:0 6px 20px rgba(0,0,0,.2)">
        <div style="width:100%;height:calc(100% - 32px);background:#f0f0f0;display:flex;align-items:center;justify-content:center">\${imgIcon}</div>
        <div class="pl" style="color:#888;font-style:italic">drag image here</div>
      </div></div>\`;
  } else {
    const tapeHtml = s.tape ? \`<div style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);width:44%;height:16px;background:#8FAF7A;opacity:.65;border-radius:2px;z-index:3"></div>\` : '';
    wrapper = \`<div style="position:relative">\${tapeHtml}<div class="bi-pol" style="background:\${s.bg};border:\${s.border};box-shadow:\${s.shadow}">
      <div style="width:100%;height:calc(100% - 32px);background:\${s.imgBg};display:flex;align-items:center;justify-content:center">\${imgIcon}</div>
      <div class="pl" style="color:\${s.captionColor};font-style:italic">drag image here</div>
    </div></div>\`;
  }
  el.innerHTML = wrapper;
  mount(el,id,x,y,170,200);
  refHint(); refCount();
}
function addShape(type){
  const def=SHAPES[type];if(!def)return;
  const id=mkId(),el=document.createElement('div');
  const f='#EBF2E5',s='#8FAF7A',w=3;
  el.innerHTML=mkSVG(type,f,s,w);
  const bc=document.getElementById('board-canvas'),r=bc.getBoundingClientRect();
  const flat=['line','arrow-r','arrow-l','dbl-arrow','banner1','oval','rect','roundrect','parallelogram'].includes(type);
  mount(el,id,r.width/2,r.height/2,130,flat?50:130);
  refHint();refCount();
}
function addText(){const bc=document.getElementById('board-canvas'),r=bc.getBoundingClientRect();spawnEl('heading',r.width/2,r.height/2);refHint();refCount();}
function addSticky(c='#F7F3EE'){
  const id=mkId(),bc=document.getElementById('board-canvas'),r=bc.getBoundingClientRect(),el=document.createElement('div');
  const d=document.createElement('div');d.className='bi-sticky';d.contentEditable='true';d.spellcheck=false;d.textContent='Type here...';
  d.style.background=c;d.style.color=(c==='#3F5A45'||c==='#2A3828')?'#fff':'#2A3828';
  d.addEventListener('mousedown',e=>e.stopPropagation());
  el.appendChild(d);mount(el,id,r.width/2,r.height/2,165,115);setTimeout(()=>d.focus(),50);refHint();refCount();
}

// ─── UPLOAD ───
function triggerUpload(){
  // ensure shop panel is open so user sees the upload grid
  openPanel('shop', document.getElementById('rb-shop'));
  // scroll to upload zone
  setTimeout(()=>{
    const uz = document.getElementById('up-zone');
    if(uz) uz.scrollIntoView({behavior:'smooth', block:'center'});
  }, 300);
  document.getElementById('file-inp').click();
}
function handleDropUpload(e){
  e.preventDefault();e.stopPropagation();
  const uz=document.getElementById('up-zone');
  if(uz){uz.style.borderColor='';uz.style.background='';}
  Array.from(e.dataTransfer.files).filter(f=>f.type.startsWith('image/')).forEach(readF);
}
function handleFiles(e){
  const files=Array.from(e.target.files);
  if(!files.length)return;
  files.forEach(readF);
  e.target.value=''; // reset so same file can be re-selected
}
function readF(file){
  const r=new FileReader();
  r.onload=ev=>addUpCard(ev.target.result, file.name.replace(/\\.[^.]+$/,''));
  r.readAsDataURL(file);
}
function addUpCard(url, name){
  // Switch to shop panel so user sees uploaded image
  openPanel('shop', document.getElementById('rb-shop'));
  const g=document.getElementById('upload-grid');
  if(!g){ console.warn('upload-grid not found'); return; }
  const d=document.createElement('div');
  d.className='prod-card';
  d.draggable=true;
  d.innerHTML=\`
    <img src="\${url}" style="width:100%;aspect-ratio:1;object-fit:cover;display:block;pointer-events:none">
    <div class="pc-name" style="padding:5px 7px;font-size:9px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${name}</div>\`;
  // drag to board
  d.addEventListener('dragstart', (e)=>{
    DRAG = {type:'upload', url, name};
    e.dataTransfer.effectAllowed='copy';
  });
  d.addEventListener('dragend', hideDOL);
  // single click to place on canvas center
  d.addEventListener('click', ()=>{
    const bc=document.getElementById('board-canvas');
    const r=bc.getBoundingClientRect();
    spawnUpload(url, name, r.width/2, r.height/2);
    refHint(); refCount();
    toast('Image placed on board — drag to reposition');
  });
  g.appendChild(d);
  // scroll to show it
  setTimeout(()=>d.scrollIntoView({behavior:'smooth',block:'nearest'}), 100);
  toast('✓ Photo uploaded — click to place or drag to board');
}
function spawnUpload(url, name, x, y){
  const id=mkId(), el=document.createElement('div');
  el.innerHTML=\`<div class="bi-img"><img src="\${url}" alt="\${name}" style="width:100%;height:100%;object-fit:cover;display:block"></div>\`;
  mount(el, id, x, y, 200, 200);
}

// ─── MOUSE ───
function onItemMD(e,id){
  if(tool==='draw')return;if(e.target.classList.contains('rh'))return;if(e.target.classList.contains('rot-handle'))return;if(e.target.closest('.tbar'))return;if(e.target.getAttribute('contenteditable')==='true')return;if(items[id]?.locked)return;
  e.stopPropagation();e.preventDefault();selectItem(id);
  const el=document.getElementById(id),w=document.getElementById('canvas-wrap'),wr=w.getBoundingClientRect();
  el.classList.add('dragging');
  mvS={id,ox:e.clientX-wr.left-parseInt(el.style.left),oy:e.clientY-wr.top-parseInt(el.style.top)};
}
document.addEventListener('mousemove',e=>{
  if(mvS){const w=document.getElementById('canvas-wrap'),wr=w.getBoundingClientRect(),el=document.getElementById(mvS.id);if(!el)return;el.style.left=(e.clientX-wr.left-mvS.ox)+'px';el.style.top=(e.clientY-wr.top-mvS.oy)+'px';}
  if(rzS){const{id,pos,ox,oy,ow,oh,ol,ot}=rzS,el=document.getElementById(id);if(!el)return;const dx=e.clientX-ox,dy=e.clientY-oy;let nw=ow,nh=oh,nl=ol,nt=ot;if(pos.includes('e'))nw=Math.max(30,ow+dx);if(pos.includes('w')){nw=Math.max(30,ow-dx);nl=ol+ow-nw;}if(pos.includes('s'))nh=Math.max(24,oh+dy);if(pos.includes('n')){nh=Math.max(24,oh-dy);nt=ot+oh-nh;}el.style.width=nw+'px';el.style.height=nh+'px';el.style.left=nl+'px';el.style.top=nt+'px';}
  if(rtS){const{id,cx,cy}=rtS,el=document.getElementById(id);if(!el)return;items[id].rot=Math.atan2(e.clientY-cy,e.clientX-cx)*180/Math.PI+90;apTr(el,id);}
});
document.addEventListener('mouseup',()=>{
  mvS=rzS=rtS=null;
  document.querySelectorAll('.bitem.dragging').forEach(e=>e.classList.remove('dragging'));
});
function startRz(e,id,pos){const el=document.getElementById(id);rzS={id,pos,ox:e.clientX,oy:e.clientY,ow:el.offsetWidth,oh:el.offsetHeight,ol:parseInt(el.style.left),ot:parseInt(el.style.top)};}
function startRot(e,id){const el=document.getElementById(id),r=el.getBoundingClientRect();rtS={id,cx:r.left+r.width/2,cy:r.top+r.height/2};}
function apTr(el,id){const{rot=0,sx=1,sy=1}=items[id];el.style.transform=\`rotate(\${rot}deg) scaleX(\${sx}) scaleY(\${sy})\`;}

// ─── ACTIONS ───
function selectItem(id){
  deselectAll();SEL=id;
  const el=document.getElementById(id);
  if(el){el.classList.add('sel');el.style.zIndex=++zC;}
  showPropBar(id);
  setMsg('Selected — drag to move · teal dot = rotate · corners = resize');
}
function deselectAll(){
  SEL=null;
  document.querySelectorAll('.bitem').forEach(e=>e.classList.remove('sel'));
  hidePropBar();
  closeEditPanel();
}

// ── CONTEXTUAL PROPERTY BAR ──
function showPropBar(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const pb = document.getElementById('prop-bar');
  const bn = document.getElementById('board-name-zone');
  pb.classList.add('vis');
  bn.style.opacity = '0'; bn.style.pointerEvents = 'none';

  const hasImg = el.querySelector('.bi-img,.bi-pol');
  const hasText = el.querySelector('[contenteditable]');
  const hasSvg = el.querySelector('svg[data-type]');
  const hasSticky = el.querySelector('.bi-sticky');

  // show/hide font group
  const fg = document.getElementById('pb-font-group');
  const ig = document.getElementById('pb-img-group');
  fg.style.display = (hasText||hasSticky) ? 'flex' : 'none';
  ig.style.display = hasImg ? 'flex' : 'none';

  // sync fill swatch
  let fillColor = '#EBF2E5';
  if (hasSvg) fillColor = hasSvg.dataset.f || '#EBF2E5';
  else if (hasSticky) fillColor = hasSticky.style.background || '#F7F3EE';
  else if (el.querySelector('.bi-blob')) fillColor = el.querySelector('.bi-blob').style.background || '#8FAF7A';
  else if (hasText) fillColor = hasText.style.color || '#3F5A45';
  const fillSwatch = document.getElementById('pb-fill-swatch');
  const fillInp = document.getElementById('pb-fill');
  if(fillSwatch) fillSwatch.style.background = fillColor;
  try{ if(fillInp) fillInp.value = rgbToHex(fillColor); }catch(e){}

  // sync stroke swatch
  let strokeColor = '#8FAF7A';
  if (hasSvg) strokeColor = hasSvg.dataset.s || '#8FAF7A';
  const strokeSwatch = document.getElementById('pb-stroke-swatch');
  const strokeInp = document.getElementById('pb-stroke-c');
  if(strokeSwatch) strokeSwatch.style.borderColor = strokeColor;
  try{ if(strokeInp) strokeInp.value = rgbToHex(strokeColor); }catch(e){}

  // sync opacity
  const opacInp = document.getElementById('pb-opac');
  if(opacInp) opacInp.value = Math.round((parseFloat(el.style.opacity)||1)*100);

  // sync font size if text
  if (hasText) {
    try {
      const sz = parseInt(window.getComputedStyle(hasText).fontSize)||24;
      const szInp = document.getElementById('pb-font-sz');
      if(szInp) szInp.value = sz;
    } catch(e){}
  }
}
function hidePropBar() {
  document.getElementById('prop-bar').classList.remove('vis');
  const bn = document.getElementById('board-name-zone');
  bn.style.opacity = ''; bn.style.pointerEvents = '';
}

// prop bar handlers
function pbFill(c) {
  document.getElementById('pb-fill-swatch').style.background = c;
  // update cpick preview
  const cp = document.getElementById('cpick-fill-preview'); if(cp) cp.style.background = c;
  if (!SEL) {
    // change canvas bg if nothing selected
    document.getElementById('board-canvas').style.background = c;
    return;
  }
  applyFill(c);
}
function pbStroke(c) {
  document.getElementById('pb-stroke-swatch').style.borderColor = c;
  const cp = document.getElementById('cpick-stroke-preview'); if(cp) cp.style.borderColor = c;
  if (!SEL) return;
  applyStroke(c);
}
function pbStrokeW(v) { if (SEL) applyStrokeW(v); }
function pbOpacity(v) { if (SEL) applyOpacity(v); }
function pbFontFamily(v) {
  if (!SEL) return;
  const el = document.getElementById(SEL);
  if (!el) return;
  el.querySelectorAll('[contenteditable]').forEach(t => t.style.fontFamily = v);
}
function pbFontSize(v) {
  if (!SEL) return;
  const el = document.getElementById(SEL);
  if (!el) return;
  el.querySelectorAll('[contenteditable]').forEach(t => t.style.fontSize = v + 'px');
}
function pbBold() {
  if (!SEL) return;
  const el = document.getElementById(SEL);
  if (!el) return;
  const btn = document.getElementById('pb-bold');
  const on = btn.classList.toggle('on');
  el.querySelectorAll('[contenteditable]').forEach(t => t.style.fontWeight = on ? '800' : '');
}
function pbItalic() {
  if (!SEL) return;
  const el = document.getElementById(SEL);
  if (!el) return;
  const btn = document.getElementById('pb-italic');
  const on = btn.classList.toggle('on');
  el.querySelectorAll('[contenteditable]').forEach(t => t.style.fontStyle = on ? 'italic' : '');
}

// ── CONTEXT MENU ──
let _ctxId = null;
function showCtxMenu(e, id) {
  hideCtxMenu();
  _ctxId = id;
  selectItem(id);
  const m = document.createElement('div');
  m.className = 'ctx-menu'; m.id = 'ctx-menu';
  const items = [
    {icon:'⎘', label:'Copy',       kb:'⌘C',  act:'copy'},
    {icon:'⎒', label:'Copy style', kb:'⌥⌘C', act:'copystyle'},
    {icon:'⎗', label:'Paste',      kb:'⌘V',  act:'paste'},
    {icon:'⧉', label:'Duplicate',  kb:'⌘D',  act:'dup'},
    null,
    {icon:'↑', label:'Bring to front', kb:'',act:'fwd'},
    {icon:'↓', label:'Send to back',   kb:'',act:'bwd'},
    null,
    {icon:'🔒',label:'Lock',       kb:'',    act:'lk'},
    null,
    {icon:'✕', label:'Delete',     kb:'⌫',   act:'del', danger:true},
  ];
  items.forEach(it => {
    if (!it) { const s=document.createElement('div');s.className='ctx-sep';m.appendChild(s); return; }
    const d=document.createElement('div');d.className='ctx-item'+(it.danger?' danger':'');
    d.innerHTML=\`<span class="ctx-icon">\${it.icon}</span><span>\${it.label}</span>\${it.kb?\`<span class="ctx-kb">\${it.kb}</span>\`:''}\`;
    d.addEventListener('click',()=>{ hideCtxMenu(); execCtx(it.act); });
    m.appendChild(d);
  });
  m.style.left = Math.min(e.clientX, window.innerWidth-200)+'px';
  m.style.top  = Math.min(e.clientY, window.innerHeight-300)+'px';
  document.body.appendChild(m);
  setTimeout(()=>document.addEventListener('click',hideCtxMenu,{once:true}),50);
}
function hideCtxMenu(){const m=document.getElementById('ctx-menu');if(m)m.remove();}
function execCtx(act){
  const id=_ctxId;if(!id)return;
  if(act==='copy'){_clipboard=id; toast('Copied');}
  if(act==='paste'&&_clipboard)dupeI(_clipboard);
  if(act==='copystyle'){_styleClip=id; toast('Style copied');}
  if(act==='dup')dupeI(id);
  if(act==='del')removeI(id);
  if(act==='fwd'){const el=document.getElementById(id);if(el)el.style.zIndex=++zC;}
  if(act==='bwd'){const el=document.getElementById(id);if(el)el.style.zIndex=Math.max(1,parseInt(el.style.zIndex||10)-2);}
  if(act==='lk')lockI(id);
}
let _clipboard=null, _styleClip=null;

// ── EDIT IMAGE PANEL ──
let _editTarget=null;
function openEditPanel(){
  if(!SEL)return;
  _editTarget=SEL;
  buildEpFilters();
  buildEpEffects();
  document.getElementById('edit-panel').classList.add('open');
}
function closeEditPanel(){document.getElementById('edit-panel').classList.remove('open');}

const EP_FILTERS=[
  {label:'None',    filter:'none',                          emoji:'🖼'},
  {label:'Fresco',  filter:'sepia(30%) saturate(1.3) brightness(1.05)', emoji:'🎨'},
  {label:'Belvedere',filter:'contrast(1.15) brightness(.96) saturate(.85)',emoji:'🏛'},
  {label:'Fade',    filter:'brightness(1.1) saturate(.7)',  emoji:'🌫'},
  {label:'B&W',     filter:'grayscale(100%)',               emoji:'⬛'},
  {label:'Sepia',   filter:'sepia(70%)',                    emoji:'🟫'},
  {label:'Vivid',   filter:'brightness(1.2) saturate(1.6)', emoji:'✨'},
  {label:'Matte',   filter:'contrast(1.2) brightness(.9)',  emoji:'🫧'},
  {label:'Warm',    filter:'sepia(25%) saturate(1.2) hue-rotate(-5deg)',emoji:'🌅'},
];
const EP_EFFECTS=[
  {label:'None',    fn:()=>'',           emoji:'○'},
  {label:'Shadow',  fn:()=>'drop-shadow(4px 6px 12px rgba(0,0,0,.35))', emoji:'🌑'},
  {label:'Glow',    fn:()=>'drop-shadow(0 0 12px rgba(143,175,122,.8))', emoji:'💚'},
  {label:'Blur',    fn:()=>'blur(3px)',  emoji:'💭'},
  {label:'Duotone', fn:()=>'sepia(1) hue-rotate(60deg) saturate(2)', emoji:'🎭'},
  {label:'Vignette',fn:()=>'brightness(.85) contrast(1.1)', emoji:'🔲'},
];

function buildEpFilters(){
  const g=document.getElementById('ep-filters');g.innerHTML='';
  EP_FILTERS.forEach(f=>{
    const t=document.createElement('div');t.className='ep-tile';
    t.innerHTML=\`<div class="ep-tile-preview" style="font-size:26px">\${f.emoji}</div><div class="ep-tile-label">\${f.label}</div>\`;
    t.addEventListener('click',()=>{
      g.querySelectorAll('.ep-tile').forEach(x=>x.classList.remove('on'));t.classList.add('on');
      applyFilter(f.filter);updateAdjust();
    });
    g.appendChild(t);
  });
}
function buildEpEffects(){
  const g=document.getElementById('ep-effects');g.innerHTML='';
  EP_EFFECTS.forEach(f=>{
    const t=document.createElement('div');t.className='ep-tile';
    t.innerHTML=\`<div class="ep-tile-preview" style="font-size:26px">\${f.emoji}</div><div class="ep-tile-label">\${f.label}</div>\`;
    t.addEventListener('click',()=>{
      g.querySelectorAll('.ep-tile').forEach(x=>x.classList.remove('on'));t.classList.add('on');
      const el=document.getElementById(_editTarget||SEL);if(!el)return;
      const eff=f.fn();const base=el.dataset.baseFilter||'none';
      el.style.filter=base+(eff?' '+eff:'');
    });
    g.appendChild(t);
  });
}

function applyAdjust(){
  const el=document.getElementById(_editTarget||SEL);if(!el)return;
  const br=parseInt(document.getElementById('adj-bright').value)||0;
  const co=parseInt(document.getElementById('adj-con').value)||0;
  const sa=parseInt(document.getElementById('adj-sat').value)||0;
  const wa=parseInt(document.getElementById('adj-warm').value)||0;
  const bl=parseInt(document.getElementById('adj-blur').value)||0;
  document.getElementById('adj-bright-v').textContent=br;
  document.getElementById('adj-con-v').textContent=co;
  document.getElementById('adj-sat-v').textContent=sa;
  document.getElementById('adj-warm-v').textContent=wa;
  document.getElementById('adj-blur-v').textContent=bl;
  const brf=1+(br/100), cof=1+(co/100), saf=1+(sa/100);
  const hue=wa*0.6;
  let f=\`brightness(\${brf}) contrast(\${cof}) saturate(\${saf})\`;
  if(hue!==0)f+=\` hue-rotate(\${hue}deg)\`;
  if(bl>0)f+=\` blur(\${bl*0.3}px)\`;
  el.dataset.baseFilter=f;
  el.style.filter=f;
}
function updateAdjust(){
  // reset sliders when filter button clicked
  ['adj-bright','adj-con','adj-sat','adj-warm','adj-blur'].forEach(id=>{
    document.getElementById(id).value=0;
  });
  ['adj-bright-v','adj-con-v','adj-sat-v','adj-warm-v','adj-blur-v'].forEach(id=>{
    document.getElementById(id).textContent='0';
  });
}

// ── UTILITY ──
function rgbToHex(c) {
  if(!c)return'#EBF2E5';
  if(c.startsWith('#'))return c.length===7?c:c;
  // rgb(r,g,b) → #rrggbb
  const m=c.match(/\\d+/g);
  if(!m||m.length<3)return'#EBF2E5';
  return '#'+m.slice(0,3).map(n=>parseInt(n).toString(16).padStart(2,'0')).join('');
}
function removeI(id){const el=document.getElementById(id);if(!el)return;el.style.transition='opacity .18s,transform .18s';el.style.opacity='0';el.style.transform=(el.style.transform||'')+' scale(.85)';setTimeout(()=>{el.remove();delete items[id];if(SEL===id)SEL=null;refCount();refHint();},200);}
function rotI(id,d){if(!items[id])return;items[id].rot=(items[id].rot||0)+d;apTr(document.getElementById(id),id);}
function dupeI(id){
  const el=document.getElementById(id);if(!el)return;
  const cl=el.cloneNode(true);const nid=mkId();cl.id=nid;
  cl.style.left=(parseInt(el.style.left)+22)+'px';cl.style.top=(parseInt(el.style.top)+22)+'px';
  cl.style.zIndex=++zC;items[nid]={...items[id]};
  cl.querySelectorAll('.tbar,.rot-handle,.rh,.move-handle').forEach(h=>h.remove());
  attachH(cl,nid);document.getElementById('board-canvas').appendChild(cl);
  cl.addEventListener('mousedown',ev=>onItemMD(ev,nid));selectItem(nid);refCount();
}
function lockI(id){if(!items[id])return;items[id].locked=!items[id].locked;const el=document.getElementById(id);if(el)el.style.cursor=items[id].locked?'not-allowed':'move';toast(items[id].locked?'Item locked':'Item unlocked');}
function dupeSelected(){if(SEL)dupeI(SEL);}
function delSelected(){if(SEL)removeI(SEL);else toast('Select an item first');}
function bringFront(){if(SEL){const el=document.getElementById(SEL);if(el)el.style.zIndex=++zC;}}
function sendBack(){if(SEL){const el=document.getElementById(SEL);if(el)el.style.zIndex=Math.max(1,parseInt(el.style.zIndex||10)-2);}}
function flipH(){if(!SEL||!items[SEL])return;items[SEL].sx=(items[SEL].sx||1)*-1;apTr(document.getElementById(SEL),SEL);}
function flipV(){if(!SEL||!items[SEL])return;items[SEL].sy=(items[SEL].sy||1)*-1;apTr(document.getElementById(SEL),SEL);}
function applyFill(c){
  if(c&&c!=='transparent'){ _docColors.add(c); }
  if(!SEL){ toast('Select an item first'); return; }
  const el=document.getElementById(SEL); if(!el) return;
  // SVG shapes
  const svg=el.querySelector('svg[data-type]');
  if(svg){
    const t=svg.dataset.type;
    el.innerHTML=mkSVG(t,c,svg.dataset.s||'#8FAF7A',svg.dataset.w||3);
    attachH(el,SEL);
    return;
  }
  // colour blob
  const blob=el.querySelector('.bi-blob'); if(blob){ blob.style.background=c; return; }
  // sticky notes
  const sticky=el.querySelector('.bi-sticky'); if(sticky){ sticky.style.background=c; return; }
  // text / editable elements — change text color
  const editable=el.querySelector('[contenteditable]');
  if(editable){ editable.style.color=c; return; }
  // image items — change border color as tint
  const img=el.querySelector('.bi-img,.bi-pol');
  if(img){ img.style.borderColor=c; return; }
  // fallback: background of the wrapper
  el.style.background=c;
}
function applyStroke(c){
  if(!SEL) return;
  const el=document.getElementById(SEL); if(!el) return;
  const svg=el.querySelector('svg[data-type]');
  if(svg){
    const t=svg.dataset.type;
    el.innerHTML=mkSVG(t,svg.dataset.f||'#EBF2E5',c,svg.dataset.w||3);
    attachH(el,SEL); return;
  }
  // bubble border color
  const bubble=el.querySelector('.bi-bubble'); if(bubble){ bubble.style.borderColor=c; bubble.style.color=c; return; }
  // text / editable: border or outline
  const editable=el.querySelector('[contenteditable]');
  if(editable){ el.style.outline='2px solid '+c; return; }
  // images: border
  const img=el.querySelector('.bi-img,.bi-pol');
  if(img){ img.style.border='3px solid '+c; return; }
}
function applyStrokeW(v){
  if(!SEL)return;const el=document.getElementById(SEL);const svg=el&&el.querySelector('svg[data-type]');
  if(!svg)return;const t=svg.dataset.type;el.innerHTML=mkSVG(t,svg.dataset.f||'#EBF2E5',svg.dataset.s||'#8FAF7A',v);attachH(el,SEL);
}
function applyOpacity(v){if(!SEL)return;const el=document.getElementById(SEL);if(el)el.style.opacity=v/100;}
function applyFilter(f){if(!SEL){toast('Select an item first');return;}const el=document.getElementById(SEL);if(el)el.style.filter=f;}
function applyBorder(b){
  if(!SEL){toast('Select an item first');return;}
  const el=document.getElementById(SEL);if(!el)return;
  const inn=el.querySelector('.bi-img,.bi-pol,.bi-sticky');
  if(inn)inn.style.border=b;else el.style.outline=b;
}

// ─── EXPORT ───
function exportPNG(){
  deselectAll();toast('Generating export…');
  const cv=document.getElementById('board-canvas');
  document.querySelectorAll('.tbar,.rot-handle,.rh').forEach(h=>h.style.opacity='0');
  setTimeout(()=>{
    html2canvas(cv,{backgroundColor:null,useCORS:true,scale:2,logging:false,allowTaint:true})
    .then(c=>{
      document.querySelectorAll('.tbar,.rot-handle,.rh').forEach(h=>h.style.opacity='');
      const a=document.createElement('a');a.href=c.toDataURL('image/png');
      a.download=(document.getElementById('board-title').value||'kk-moodboard')+'.png';a.click();
      toast('Exported successfully');
    }).catch(()=>{
      document.querySelectorAll('.tbar,.rot-handle,.rh').forEach(h=>h.style.opacity='');
      toast('Try Cmd+Shift+4 screenshot if blocked');
    });
  },120);
}
function saveBoard(){toast('Board saved');}
function clearBoard(){if(!confirm('Clear the board?'))return;document.getElementById('board-canvas').innerHTML='';items={};uid=0;SEL=null;refHint();refCount();toast('Board cleared');}
function refHint(){document.getElementById('hint-wrap').classList.toggle('gone',document.getElementById('board-canvas').children.length>0);}
function refCount(){const n=document.getElementById('board-canvas').children.length;document.getElementById('st-count').textContent=n+(n===1?' item':' items');}
function setMsg(m){document.getElementById('st-msg').textContent=m;}
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2600);}

// ── KEYBOARD SHORTCUTS ──
document.addEventListener('keydown',e=>{
  const a=document.activeElement;
  if(a&&(a.getAttribute('contenteditable')==='true'||a.tagName==='INPUT'||a.tagName==='SELECT'))return;
  const meta=e.ctrlKey||e.metaKey;

  // Delete / Backspace
  if((e.key==='Delete'||e.key==='Backspace')&&SEL){removeI(SEL);return;}
  // Ctrl+D — duplicate
  if(e.key==='d'&&meta&&SEL){e.preventDefault();dupeI(SEL);return;}
  // Ctrl+C — copy
  if(e.key==='c'&&meta&&SEL){_clipboard=SEL;toast('Copied');return;}
  // Ctrl+V — paste
  if(e.key==='v'&&meta&&_clipboard){e.preventDefault();dupeI(_clipboard);return;}
  // Ctrl+Z — undo draw
  if(e.key==='z'&&meta){e.preventDefault();undoDraw();return;}
  // Ctrl+A — select all (deselect + reselect last)
  if(e.key==='a'&&meta){e.preventDefault();return;}
  // [ ] — rotate 5°
  if(e.key==='['&&SEL)rotI(SEL,-5);
  if(e.key===']'&&SEL)rotI(SEL,5);
  // Escape
  if(e.key==='Escape'){
    closeEditPanel();hideCtxMenu();
    if(tool==='draw')setTool('select');
    else deselectAll();
    return;
  }
  // Arrow keys — nudge (1px, Shift = 10px)
  if(SEL&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){
    e.preventDefault();
    const el=document.getElementById(SEL);if(!el)return;
    const s=e.shiftKey?10:1;
    if(e.key==='ArrowLeft') el.style.left=(parseInt(el.style.left)-s)+'px';
    if(e.key==='ArrowRight')el.style.left=(parseInt(el.style.left)+s)+'px';
    if(e.key==='ArrowUp')   el.style.top=(parseInt(el.style.top)-s)+'px';
    if(e.key==='ArrowDown') el.style.top=(parseInt(el.style.top)+s)+'px';
  }
});

// right-click on canvas background
document.getElementById('board-canvas').addEventListener('contextmenu',e=>{
  if(e.target.id==='board-canvas')e.preventDefault();
});
// double-click to add text
document.getElementById('board-canvas').addEventListener('dblclick',e=>{
  if(e.target.id!=='board-canvas')return;spawnEl('heading',e.offsetX,e.offsetY);refHint();refCount();
});
// resize draw canvas
window.addEventListener('resize',()=>{
  const cvs=document.getElementById('draw-canvas'),w=document.getElementById('canvas-wrap');
  const img=dctx?dctx.getImageData(0,0,cvs.width,cvs.height):null;
  cvs.width=w.offsetWidth;cvs.height=w.offsetHeight;if(img)dctx.putImageData(img,0,0);
});

init();`

// Full moodboard body HTML
const BODY = `
<!-- ═══ TOPBAR ═══ -->
<div class="topbar">


  <!-- CENTRE: Board name (default) / Contextual property bar (when item selected) -->
  <div class="board-name-zone" id="board-name-zone">
    <input class="board-name-inp" id="board-title" value="My Kids Room" placeholder="Name your moodboard…" spellcheck="false">
  </div>

  <!-- CONTEXTUAL PROPERTY BAR -->
  <div class="prop-bar" id="prop-bar">

    <!-- Fill colour — clickable swatch triggers native color picker -->
    <div style="position:relative;display:flex;align-items:center" title="Fill / text colour">
      <div id="pb-fill-swatch" style="width:26px;height:26px;border-radius:50%;background:#EBF2E5;border:2px solid var(--border);cursor:pointer;flex-shrink:0;box-shadow:0 1px 4px rgba(0,0,0,.1)" onclick="document.getElementById('pb-fill').click()"></div>
      <input type="color" id="pb-fill" value="#EBF2E5" style="position:absolute;opacity:0;width:0;height:0;pointer-events:none" oninput="pbFill(this.value)">
    </div>

    <!-- Stroke colour -->
    <div style="position:relative;display:flex;align-items:center;margin-left:4px" title="Stroke colour">
      <div id="pb-stroke-swatch" style="width:26px;height:26px;border-radius:50%;background:transparent;border:3px solid #8FAF7A;cursor:pointer;flex-shrink:0;box-shadow:0 1px 4px rgba(0,0,0,.08)" onclick="document.getElementById('pb-stroke-c').click()"></div>
      <input type="color" id="pb-stroke-c" value="#8FAF7A" style="position:absolute;opacity:0;width:0;height:0;pointer-events:none" oninput="pbStroke(this.value)">
    </div>

    <div class="pb-sep"></div>

    <!-- Stroke width -->
    <svg width="11" height="11" viewBox="0 0 11 11" style="color:var(--ink-l);flex-shrink:0;opacity:.6"><rect x="0" y="4.5" width="11" height="2" rx="1" fill="currentColor"/></svg>
    <input class="pb-sw" type="range" id="pb-sw" min="0" max="14" value="3" title="Stroke width" oninput="pbStrokeW(this.value)">

    <div class="pb-sep"></div>

    <!-- Opacity -->
    <svg width="11" height="11" viewBox="0 0 11 11" style="color:var(--ink-l);flex-shrink:0;opacity:.6"><circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" stroke-width="1.5" fill="none" opacity=".6"/></svg>
    <input class="pb-opac" type="range" id="pb-opac" min="10" max="100" value="100" title="Opacity" oninput="pbOpacity(this.value)">

    <div class="pb-sep"></div>

    <!-- Font controls (text items) -->
    <span id="pb-font-group" style="display:flex;align-items:center;gap:4px">
      <!-- Font name button — opens font panel -->
      <button class="pb-btn" id="pb-font-name-btn" onclick="openFontPanel()"
        style="padding:0 10px;width:auto;min-width:90px;font-size:11px;font-weight:600;border:1px solid var(--border);border-radius:7px;height:28px;background:var(--cream);justify-content:space-between;gap:6px"
        title="Font">
        <span id="pb-font-label">Cormorant</span>
        <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 2l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
      </button>
      <!-- Decrease size -->
      <button class="pb-btn" onclick="pbSizeStep(-1)" title="Decrease size" style="width:22px;height:22px;font-size:14px">−</button>
      <input class="pb-size" type="number" id="pb-font-sz" value="24" min="8" max="120"
        oninput="pbFontSize(this.value)" title="Font size"
        style="width:42px;text-align:center;border:1px solid var(--border);border-radius:6px;padding:3px 4px;font-size:12px;font-weight:600;background:var(--cream)">
      <!-- Increase size -->
      <button class="pb-btn" onclick="pbSizeStep(1)" title="Increase size" style="width:22px;height:22px;font-size:14px">+</button>
      <div class="pb-sep"></div>
      <!-- Text color button — opens color picker for text -->
      <button class="pb-btn" onclick="openTextColorPicker()" title="Text colour"
        style="width:28px;height:28px;position:relative;padding:0">
        <span style="font-size:12px;font-weight:800;color:var(--ink-m)">A</span>
        <div id="pb-text-color-bar" style="position:absolute;bottom:3px;left:4px;right:4px;height:3px;border-radius:2px;background:#3F5A45"></div>
      </button>
      <div class="pb-sep"></div>
      <button class="pb-btn" id="pb-bold" onclick="pbBold()" title="Bold" style="font-weight:800;font-size:12px">B</button>
      <button class="pb-btn" id="pb-italic" onclick="pbItalic()" title="Italic" style="font-style:italic;font-size:12px">I</button>
      <button class="pb-btn" id="pb-underline" onclick="pbUnderline()" title="Underline" style="text-decoration:underline;font-size:12px">U</button>
      <button class="pb-btn" id="pb-strike" onclick="pbStrike()" title="Strikethrough" style="text-decoration:line-through;font-size:12px">S</button>
    </span>

    <span id="pb-img-group" style="display:flex;align-items:center;gap:3px">
      <div class="pb-sep" id="pb-img-sep"></div>
      <button class="pb-btn" onclick="openEditPanel()" title="Edit image">
        <svg viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M1 9l3-3 3 3 2-2 4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </span>

    <div class="pb-sep"></div>

    <!-- Layer -->
    <button class="pb-btn" onclick="bringFront()" title="Bring to front">
      <svg viewBox="0 0 14 14" fill="none"><rect x="3" y="4" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="1" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5" opacity=".35"/></svg>
    </button>
    <button class="pb-btn" onclick="sendBack()" title="Send to back">
      <svg viewBox="0 0 14 14" fill="none"><rect x="3" y="1" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="4" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5" opacity=".35"/></svg>
    </button>

    <!-- Flip -->
    <button class="pb-btn" onclick="flipH()" title="Flip horizontal">
      <svg viewBox="0 0 14 14" fill="none"><path d="M7 1v12M3 4l-2 3 2 3M11 4l2 3-2 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>

    <!-- Delete (quick access) -->
    <div class="pb-sep"></div>
    <button class="pb-btn" onclick="delSelected()" title="Delete" style="color:#c04040">
      <svg viewBox="0 0 14 14" fill="none"><path d="M2 4h10M5 4V2h4v2M5.5 6.5v4M8.5 6.5v4M3 4l.7 7.3A1 1 0 0 0 4.7 12h4.6a1 1 0 0 0 1-.7L11 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
    </button>

  </div>

  <!-- RIGHT: Actions -->
  <div class="top-right">
    <input class="board-name-inp" id="board-title-right" value="My Kids Room" placeholder="Board name…" spellcheck="false" style="font-size:13px;min-width:130px;max-width:200px;display:none">
    <button class="tbtn c-clear" onclick="clearBoard()">Clear</button>
    <button class="tbtn c-export" onclick="exportPNG()">Export PNG</button>
    <button class="tbtn c-save" onclick="saveBoard()">Save</button>
  </div>

  <input type="file" id="file-inp" accept="image/*" multiple style="position:fixed;top:-1000px;left:-1000px;opacity:0;pointer-events:none" onchange="handleFiles(event)">
</div>

<!-- EDIT IMAGE PANEL -->
<div class="edit-panel" id="edit-panel">
  <div class="ep-head">
    <h3>Edit Image</h3>
    <div class="ep-close" onclick="closeEditPanel()">&#10005;</div>
  </div>
  <div class="ep-scroll">
    <div class="ep-sec">
      <div class="ep-sec-title">Adjust</div>
      <div class="adj-row"><label>Brightness</label><input type="range" id="adj-bright" min="-100" max="100" value="0" oninput="applyAdjust()"><span class="adj-val" id="adj-bright-v">0</span></div>
      <div class="adj-row"><label>Contrast</label><input type="range" id="adj-con" min="-100" max="100" value="0" oninput="applyAdjust()"><span class="adj-val" id="adj-con-v">0</span></div>
      <div class="adj-row"><label>Saturation</label><input type="range" id="adj-sat" min="-100" max="100" value="0" oninput="applyAdjust()"><span class="adj-val" id="adj-sat-v">0</span></div>
      <div class="adj-row"><label>Warmth</label><input type="range" id="adj-warm" min="-100" max="100" value="0" oninput="applyAdjust()"><span class="adj-val" id="adj-warm-v">0</span></div>
      <div class="adj-row"><label>Blur</label><input type="range" id="adj-blur" min="0" max="20" value="0" oninput="applyAdjust()"><span class="adj-val" id="adj-blur-v">0</span></div>
    </div>
    <div class="ep-sec">
      <div class="ep-sec-title">Filters</div>
      <div class="ep-grid" id="ep-filters"></div>
    </div>
    <div class="ep-sec">
      <div class="ep-sec-title">Effects</div>
      <div class="ep-grid" id="ep-effects"></div>
    </div>
  </div>
</div>

<div class="main">

<!-- ═══ RAIL ═══ -->
<div class="rail">
  <!-- Tool actions -->
  <button class="rbt on" id="tt-select" onclick="setTool('select')" title="Select (V)">
    <svg viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.7"><path d="M5 3l14 9-7 2-3 7z" stroke-linejoin="round"/></svg>
    Select
  </button>
  <button class="rbt" id="tt-draw" onclick="setTool('draw')" title="Draw (D)">
    <svg viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.7"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke-linejoin="round"/></svg>
    Draw
  </button>
  <button class="rbt" onclick="addText()" title="Add Text (T)">
    <svg viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.7"><path d="M4 7V4h16v3M9 20h6M12 4v16" stroke-linecap="round"/></svg>
    Text
  </button>
  <button class="rbt" onclick="addSticky('#F7F3EE')" title="Add Note">
    <svg viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 8h10M7 12h7" stroke-linecap="round"/></svg>
    Note
  </button>
  <button class="rbt" onclick="triggerUpload()" title="Upload Image">
    <svg viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="#999"/><path d="M21 15l-5-5L5 21" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Upload
  </button>
  <div class="r-sep"></div>
  <!-- Panel openers -->
  <button class="rbt" id="rb-shop" onclick="openPanel('shop',this)" title="Products">
    <svg viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.7"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
    Shop
  </button>
  <button class="rbt" id="rb-elements" onclick="openPanel('elements',this)" title="Elements">
    <svg viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.7"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke-linecap="round"/></svg>
    Items
  </button>
  <button class="rbt" id="rb-shapes" onclick="openPanel('shapes',this)" title="Shapes">
    <svg viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.7"><polygon points="12,3 22,20 2,20" stroke-linejoin="round"/></svg>
    Shapes
  </button>
  <button class="rbt" id="rb-draw" onclick="openPanel('draw',this)" title="Draw">
    <svg viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.7"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke-linejoin="round"/><path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" stroke-linejoin="round"/></svg>
    Draw
  </button>
  <button class="rbt" id="rb-notes" onclick="openPanel('notes',this)" title="Notes">
    <svg viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 8h10M7 12h10M7 16h6" stroke-linecap="round"/></svg>
    Notes
  </button>
  <div class="r-sep"></div>
  <button class="rbt" id="rb-styles" onclick="openPanel('styles',this)" title="Styles">
    <svg viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18" fill="var(--cream)"/></svg>
    Styles
  </button>
</div>

<!-- ═══ SLIDE PANEL ═══ -->
<div class="panel" id="panel">
  <div class="panel-head">
    <span class="panel-head-title" id="panel-title">Shop Products</span>
    <span class="panel-head-close" onclick="closePanel()">&#10005;</span>
  </div>

  <!-- SHOP -->
  <div class="pscroll" id="pnl-shop">
    <div class="sec-lbl">Category</div>
    <div class="cpills">
      <div class="cpill on" onclick="filterCat('all',this)">All</div>
      <div class="cpill" onclick="filterCat('blocks',this)">Blocks</div>
      <div class="cpill" onclick="filterCat('motor',this)">Motor</div>
      <div class="cpill" onclick="filterCat('furniture',this)">Furniture</div>
      <div class="cpill" onclick="filterCat('storage',this)">Storage</div>
      <div class="cpill" onclick="filterCat('diy',this)">DIY</div>
    </div>
    <div class="prod-grid" id="prod-grid"></div>
    <div class="sec-lbl" style="margin-top:12px">Your Photos</div>
    <div class="upload-zone" id="up-zone" onclick="triggerUpload()"
      ondragover="event.preventDefault();event.stopPropagation();this.style.borderColor='var(--sage)';this.style.background='var(--sage-l)'"
      ondragleave="this.style.borderColor='';this.style.background=''"
      ondrop="handleDropUpload(event)">
      <strong>Drop photos here</strong>
      or <span style="color:var(--sage-d);text-decoration:underline;cursor:pointer">click to browse</span>
    </div>
    <div class="prod-grid" id="upload-grid"></div>
  </div>

  <!-- ELEMENTS -->
  <div class="pscroll hidden" id="pnl-elements">

    <!-- WASHI TAPES -->
    <div class="sec-lbl">Washi Tapes</div>
    <div class="el-grid" style="grid-template-columns:1fr 1fr;gap:6px">
      <div class="el-chip wide" draggable="true" ondragstart="dg(event,'washi-pink','')" style="padding:0;overflow:hidden;height:36px;cursor:grab">
        <div style="width:100%;height:100%;background:repeating-linear-gradient(90deg,#f2a8b8 0,#f2a8b8 8px,#e8d0d8 8px,#e8d0d8 16px);opacity:.9;border-radius:6px"></div>
      </div>
      <div class="el-chip wide" draggable="true" ondragstart="dg(event,'washi-sage','')" style="padding:0;overflow:hidden;height:36px;cursor:grab">
        <div style="width:100%;height:100%;background:repeating-linear-gradient(90deg,#8FAF7A 0,#8FAF7A 8px,#c5dab8 8px,#c5dab8 16px);opacity:.85;border-radius:6px"></div>
      </div>
      <div class="el-chip wide" draggable="true" ondragstart="dg(event,'washi-wood','')" style="padding:0;overflow:hidden;height:36px;cursor:grab">
        <div style="width:100%;height:100%;background:repeating-linear-gradient(90deg,#D8C3A5 0,#D8C3A5 8px,#e8d5bc 8px,#e8d5bc 16px);border-radius:6px"></div>
      </div>
      <div class="el-chip wide" draggable="true" ondragstart="dg(event,'washi-cream','')" style="padding:0;overflow:hidden;height:36px;cursor:grab">
        <div style="width:100%;height:100%;background:repeating-linear-gradient(90deg,#e8e0d0 0,#e8e0d0 8px,#f5f0e8 8px,#f5f0e8 16px);border:1px solid #ddd;border-radius:6px"></div>
      </div>
      <div class="el-chip wide" draggable="true" ondragstart="dg(event,'washi-blush','')" style="padding:0;overflow:hidden;height:36px;cursor:grab">
        <div style="width:100%;height:100%;background:repeating-linear-gradient(90deg,#E8A4B4 0,#E8A4B4 8px,#fad8e0 8px,#fad8e0 16px);border-radius:6px"></div>
      </div>
      <div class="el-chip wide" draggable="true" ondragstart="dg(event,'washi-dark','')" style="padding:0;overflow:hidden;height:36px;cursor:grab">
        <div style="width:100%;height:100%;background:repeating-linear-gradient(90deg,#3F5A45 0,#3F5A45 8px,#5a7d62 8px,#5a7d62 16px);border-radius:6px"></div>
      </div>
      <div class="el-chip wide" draggable="true" ondragstart="dg(event,'washi-dot','')" style="padding:0;overflow:hidden;height:36px;cursor:grab">
        <div style="width:100%;height:100%;background:radial-gradient(circle,#E8A4B4 2px,transparent 2px) 0 0/12px 12px,#fdf0f4;border-radius:6px"></div>
      </div>
      <div class="el-chip wide" draggable="true" ondragstart="dg(event,'washi-stripe','')" style="padding:0;overflow:hidden;height:36px;cursor:grab">
        <div style="width:100%;height:100%;background:repeating-linear-gradient(135deg,#8FAF7A 0,#8FAF7A 4px,#EBF2E5 4px,#EBF2E5 12px);border-radius:6px"></div>
      </div>
    </div>

    <!-- TAPE STRIPS (sticky tape look) -->
    <div class="sec-lbl" style="margin-top:8px">Tape Strips</div>
    <div class="el-grid" style="grid-template-columns:1fr 1fr;gap:6px">
      <div class="el-chip wide" draggable="true" ondragstart="dg(event,'tape-clear','')" style="padding:4px 8px;cursor:grab;background:rgba(200,210,230,.25);border:1px solid rgba(150,170,200,.4);backdrop-filter:blur(2px);text-align:center;font-size:9px;color:var(--ink-l)">Clear Tape</div>
      <div class="el-chip wide" draggable="true" ondragstart="dg(event,'tape-kraft','')" style="padding:4px 8px;cursor:grab;background:#c4a882;border:none;text-align:center;font-size:9px;color:#6b4c2a">Kraft Tape</div>
      <div class="el-chip wide" draggable="true" ondragstart="dg(event,'tape-white','')" style="padding:4px 8px;cursor:grab;background:rgba(255,255,255,.9);border:1px solid #ddd;text-align:center;font-size:9px;color:var(--ink-l)">White Tape</div>
      <div class="el-chip wide" draggable="true" ondragstart="dg(event,'tape-red','')" style="padding:4px 8px;cursor:grab;background:#e04040;border:none;text-align:center;font-size:9px;color:#fff">Red Tape</div>
    </div>

    <!-- POLAROID FRAMES -->
    <div class="sec-lbl" style="margin-top:8px">Polaroid Frames</div>
    <div class="el-grid" style="grid-template-columns:1fr 1fr 1fr;gap:6px">
      <div class="el-chip" onclick="addPolaroid('classic')" style="cursor:pointer;padding:4px;aspect-ratio:1">
        <div style="width:100%;height:100%;background:#fff;border:1px solid #ddd;border-radius:2px;display:flex;flex-direction:column;padding:3px 3px 8px">
          <div style="flex:1;background:#f0f0f0;border-radius:1px"></div>
        </div>
      </div>
      <div class="el-chip" onclick="addPolaroid('cream')" style="cursor:pointer;padding:4px;aspect-ratio:1">
        <div style="width:100%;height:100%;background:#f5f0e5;border:1px solid #ddd;border-radius:2px;display:flex;flex-direction:column;padding:3px 3px 8px">
          <div style="flex:1;background:#e8e0cc;border-radius:1px"></div>
        </div>
      </div>
      <div class="el-chip" onclick="addPolaroid('shadow')" style="cursor:pointer;padding:4px;aspect-ratio:1">
        <div style="width:100%;height:100%;background:#fff;border:1px solid #ddd;border-radius:2px;box-shadow:3px 3px 0 #ddd;display:flex;flex-direction:column;padding:3px 3px 8px">
          <div style="flex:1;background:#222;border-radius:1px"></div>
        </div>
      </div>
      <div class="el-chip" onclick="addPolaroid('pink')" style="cursor:pointer;padding:4px;aspect-ratio:1">
        <div style="width:100%;height:100%;background:#fff;border:3px solid #E8A4B4;border-radius:2px;display:flex;flex-direction:column;padding:2px 2px 7px">
          <div style="flex:1;background:#fdf0f4;border-radius:1px"></div>
        </div>
      </div>
      <div class="el-chip" onclick="addPolaroid('sage')" style="cursor:pointer;padding:4px;aspect-ratio:1">
        <div style="width:100%;height:100%;background:#fff;border:3px solid #8FAF7A;border-radius:2px;display:flex;flex-direction:column;padding:2px 2px 7px">
          <div style="flex:1;background:#EBF2E5;border-radius:1px"></div>
        </div>
      </div>
      <div class="el-chip" onclick="addPolaroid('dark')" style="cursor:pointer;padding:4px;aspect-ratio:1">
        <div style="width:100%;height:100%;background:#2a2a2a;border:1px solid #111;border-radius:2px;display:flex;flex-direction:column;padding:3px 3px 8px">
          <div style="flex:1;background:#111;border-radius:1px"></div>
        </div>
      </div>
      <!-- More from screenshot 2 -->
      <div class="el-chip" onclick="addPolaroid('kraft')" style="cursor:pointer;padding:4px;aspect-ratio:1">
        <div style="width:100%;height:100%;background:#C8B89A;border:1px solid #b0a080;border-radius:2px;display:flex;flex-direction:column;padding:3px 3px 8px">
          <div style="flex:1;background:#a89070;border-radius:1px"></div>
        </div>
      </div>
      <div class="el-chip" onclick="addPolaroid('tape')" style="cursor:pointer;padding:4px;aspect-ratio:1;position:relative">
        <div style="position:absolute;top:-4px;left:50%;transform:translateX(-50%);width:40%;height:10px;background:#8FAF7A;opacity:.7;border-radius:1px;z-index:2"></div>
        <div style="width:100%;height:100%;background:#fff;border:1px solid #ddd;border-radius:2px;display:flex;flex-direction:column;padding:5px 3px 8px">
          <div style="flex:1;background:#f0f0f0;border-radius:1px"></div>
        </div>
      </div>
      <div class="el-chip" onclick="addPolaroid('stack')" style="cursor:pointer;padding:4px;aspect-ratio:1;position:relative">
        <div style="position:absolute;inset:4px;background:#fff;border:1px solid #ddd;transform:rotate(4deg)"></div>
        <div style="position:absolute;inset:4px;background:#fff;border:1px solid #ddd;transform:rotate(-3deg)"></div>
        <div style="position:relative;width:100%;height:100%;background:#fff;border:1px solid #ddd;border-radius:1px;display:flex;flex-direction:column;padding:3px 3px 8px">
          <div style="flex:1;background:#f0f0f0"></div>
        </div>
      </div>
    </div>

    <!-- CHECKER PATTERNS -->
    <div class="sec-lbl" style="margin-top:8px">Checker Patterns</div>
    <div class="el-grid" style="grid-template-columns:1fr 1fr 1fr;gap:6px">
      <div class="el-chip" draggable="true" ondragstart="dg(event,'checker-pink','')" style="padding:0;aspect-ratio:1;overflow:hidden;cursor:grab;border-radius:8px">
        <div style="width:100%;height:100%;background:repeating-conic-gradient(#F2A8B8 0% 25%,#fff 0% 50%) 0 0/16px 16px"></div>
      </div>
      <div class="el-chip" draggable="true" ondragstart="dg(event,'checker-sage','')" style="padding:0;aspect-ratio:1;overflow:hidden;cursor:grab;border-radius:8px">
        <div style="width:100%;height:100%;background:repeating-conic-gradient(#8FAF7A 0% 25%,#EBF2E5 0% 50%) 0 0/16px 16px"></div>
      </div>
      <div class="el-chip" draggable="true" ondragstart="dg(event,'checker-bw','')" style="padding:0;aspect-ratio:1;overflow:hidden;cursor:grab;border-radius:8px">
        <div style="width:100%;height:100%;background:repeating-conic-gradient(#222 0% 25%,#fff 0% 50%) 0 0/16px 16px"></div>
      </div>
      <div class="el-chip" draggable="true" ondragstart="dg(event,'checker-blush','')" style="padding:0;aspect-ratio:1;overflow:hidden;cursor:grab;border-radius:8px">
        <div style="width:100%;height:100%;background:repeating-conic-gradient(#E8A4B4 0% 25%,#fdf0f4 0% 50%) 0 0/16px 16px"></div>
      </div>
      <div class="el-chip" draggable="true" ondragstart="dg(event,'checker-wood','')" style="padding:0;aspect-ratio:1;overflow:hidden;cursor:grab;border-radius:8px">
        <div style="width:100%;height:100%;background:repeating-conic-gradient(#D8C3A5 0% 25%,#f5f0e8 0% 50%) 0 0/16px 16px"></div>
      </div>
      <div class="el-chip" draggable="true" ondragstart="dg(event,'checker-dark','')" style="padding:0;aspect-ratio:1;overflow:hidden;cursor:grab;border-radius:8px">
        <div style="width:100%;height:100%;background:repeating-conic-gradient(#3F5A45 0% 25%,#EBF2E5 0% 50%) 0 0/16px 16px"></div>
      </div>
      <!-- Extra checker colors from screenshot -->
      <div class="el-chip" draggable="true" ondragstart="dg(event,'checker-blue-yellow','')" style="padding:0;aspect-ratio:1;overflow:hidden;cursor:grab;border-radius:8px">
        <div style="width:100%;height:100%;background:repeating-conic-gradient(#5080E0 0% 25%,#F5E070 0% 50%) 0 0/16px 16px"></div>
      </div>
      <div class="el-chip" draggable="true" ondragstart="dg(event,'checker-lavender','')" style="padding:0;aspect-ratio:1;overflow:hidden;cursor:grab;border-radius:8px">
        <div style="width:100%;height:100%;background:repeating-conic-gradient(#B8A8E8 0% 25%,#E8E0F8 0% 50%) 0 0/16px 16px"></div>
      </div>
      <div class="el-chip" draggable="true" ondragstart="dg(event,'checker-red-blk','')" style="padding:0;aspect-ratio:1;overflow:hidden;cursor:grab;border-radius:8px;border:2px solid #e04040">
        <div style="width:100%;height:100%;background:repeating-conic-gradient(#222 0% 25%,#fff 0% 50%) 0 0/16px 16px"></div>
      </div>
      <div class="el-chip" draggable="true" ondragstart="dg(event,'checker-light-blue','')" style="padding:0;aspect-ratio:1;overflow:hidden;cursor:grab;border-radius:8px;border:2px solid #b0c8e8">
        <div style="width:100%;height:100%;background:repeating-conic-gradient(#88B8E8 0% 25%,#E8F0F8 0% 50%) 0 0/16px 16px"></div>
      </div>
      <div class="el-chip" draggable="true" ondragstart="dg(event,'checker-red','')" style="padding:0;aspect-ratio:1;overflow:hidden;cursor:grab;border-radius:8px">
        <div style="width:100%;height:100%;background:repeating-conic-gradient(#C03040 0% 25%,#FFC8CC 0% 50%) 0 0/16px 16px"></div>
      </div>
      <div class="el-chip" draggable="true" ondragstart="dg(event,'checker-blue-soft','')" style="padding:0;aspect-ratio:1;overflow:hidden;cursor:grab;border-radius:8px;border:2px solid #f5d020">
        <div style="width:100%;height:100%;background:repeating-conic-gradient(#7890E8 0% 25%,#F5F8FF 0% 50%) 0 0/16px 16px"></div>
      </div>
      <div class="el-chip" draggable="true" ondragstart="dg(event,'checker-green-dark','')" style="padding:0;aspect-ratio:1;overflow:hidden;cursor:grab;border-radius:8px">
        <div style="width:100%;height:100%;background:repeating-conic-gradient(#1A5030 0% 25%,#D0E8D8 0% 50%) 0 0/16px 16px"></div>
      </div>
    </div>

    <!-- DECORATIVE LABELS -->
    <div class="sec-lbl" style="margin-top:8px">Labels</div>
    <div class="el-grid" style="grid-template-columns:1fr 1fr;gap:6px">
      <div class="el-chip wide" draggable="true" ondragstart="dg(event,'label-ribbon','')" style="padding:0;height:38px;overflow:hidden;cursor:grab;display:flex;align-items:center;justify-content:center">
        <svg viewBox="0 0 120 30" width="100%" height="100%">
          <path d="M4,2h112l-10,13 10,13H4l10-13z" fill="#e04040" stroke="none"/>
          <text x="60" y="19" font-size="9" fill="#fff" text-anchor="middle" font-family="DM Sans,sans-serif" font-weight="600">LABEL</text>
        </svg>
      </div>
      <div class="el-chip wide" draggable="true" ondragstart="dg(event,'label-tag','')" style="padding:0;height:38px;overflow:hidden;cursor:grab;display:flex;align-items:center;justify-content:center">
        <svg viewBox="0 0 100 30" width="100%" height="100%">
          <rect x="4" y="2" width="88" height="26" rx="4" fill="#3F5A45"/>
          <circle cx="12" cy="15" r="3" fill="#fff" opacity=".7"/>
          <text x="55" y="19" font-size="9" fill="#fff" text-anchor="middle" font-family="DM Sans,sans-serif" font-weight="600">TAG</text>
        </svg>
      </div>
      <div class="el-chip wide" draggable="true" ondragstart="dg(event,'label-flower','')" style="padding:0;height:38px;overflow:hidden;cursor:grab;display:flex;align-items:center;justify-content:center">
        <svg viewBox="0 0 120 30" width="100%" height="100%">
          <rect x="12" y="4" width="96" height="22" rx="4" fill="#FFD166"/>
          <path d="M14,15 a8,8 0 1,0 0-.1z" fill="#F6B8A6"/>
          <text x="65" y="19" font-size="8" fill="#3F5A45" text-anchor="middle" font-family="DM Sans,sans-serif" font-weight="600">NOTE</text>
        </svg>
      </div>
      <div class="el-chip wide" draggable="true" ondragstart="dg(event,'label-scroll','')" style="padding:0;height:38px;overflow:hidden;cursor:grab;display:flex;align-items:center;justify-content:center">
        <svg viewBox="0 0 120 30" width="100%" height="100%">
          <path d="M8,4 C4,4 4,26 8,26h104V6H8z M8,4 C12,4 12,26 8,26" fill="#D8C3A5" stroke="#b8a080" stroke-width="1"/>
          <text x="62" y="19" font-size="8" fill="#3F5A45" text-anchor="middle" font-family="Cormorant Garamond,serif" font-style="italic">scroll</text>
        </svg>
      </div>
      <div class="el-chip wide" draggable="true" ondragstart="dg(event,'label-banner','')" style="padding:0;height:38px;overflow:hidden;cursor:grab;display:flex;align-items:center;justify-content:center">
        <svg viewBox="0 0 120 28" width="100%" height="100%">
          <path d="M4,2h112v20l-8,-8H12l-8,8z" fill="#8FAF7A"/>
          <text x="60" y="16" font-size="8" fill="#fff" text-anchor="middle" font-family="DM Sans,sans-serif" font-weight="700">BANNER</text>
        </svg>
      </div>
      <div class="el-chip wide" draggable="true" ondragstart="dg(event,'label-stamp','')" style="padding:0;height:38px;overflow:hidden;cursor:grab;display:flex;align-items:center;justify-content:center">
        <svg viewBox="0 0 80 30" width="100%" height="100%">
          <rect x="4" y="4" width="72" height="22" rx="11" fill="none" stroke="#3F5A45" stroke-width="2.5" stroke-dasharray="3,2"/>
          <text x="40" y="19" font-size="8" fill="#3F5A45" text-anchor="middle" font-family="DM Sans,sans-serif" font-weight="700">STAMP</text>
        </svg>
      </div>
    </div>

    <!-- CLASSIC ELEMENTS -->
    <div class="sec-lbl" style="margin-top:8px">Classic</div>
    <div class="el-grid">
      <div class="el-chip" draggable="true" ondragstart="dg(event,'sticker','&#11088;')"><span class="ei">&#11088;</span>Star</div>
      <div class="el-chip" draggable="true" ondragstart="dg(event,'sticker','&#127752;')"><span class="ei">&#127752;</span>Rainbow</div>
      <div class="el-chip" draggable="true" ondragstart="dg(event,'sticker','&#127880;')"><span class="ei">&#127880;</span>Bow</div>
      <div class="el-chip" draggable="true" ondragstart="dg(event,'sticker','&#128640;')"><span class="ei">&#128640;</span>Rocket</div>
      <div class="el-chip" draggable="true" ondragstart="dg(event,'sticker','&#129419;')"><span class="ei">&#129419;</span>Butterfly</div>
      <div class="el-chip" draggable="true" ondragstart="dg(event,'sticker','&#127803;')"><span class="ei">&#127803;</span>Flower</div>
      <div class="el-chip" draggable="true" ondragstart="dg(event,'sticker','&#129409;')"><span class="ei">&#129409;</span>Lion</div>
      <div class="el-chip" draggable="true" ondragstart="dg(event,'sticker','&#128024;')"><span class="ei">&#128024;</span>Elephant</div>
      <div class="el-chip" draggable="true" ondragstart="dg(event,'sticker','&#129513;')"><span class="ei">&#129513;</span>Puzzle</div>
      <div class="el-chip" draggable="true" ondragstart="dg(event,'sticker','&#127912;')"><span class="ei">&#127912;</span>Art</div>
      <div class="el-chip" draggable="true" ondragstart="dg(event,'sticker','&#127775;')"><span class="ei">&#127775;</span>Glow</div>
      <div class="el-chip" draggable="true" ondragstart="dg(event,'sticker','&#127968;')"><span class="ei">&#127968;</span>Home</div>
    </div>

    <!-- COLOUR BLOBS -->
    <div class="sec-lbl" style="margin-top:8px">Colour Blobs</div>
    <div class="swatch-row" id="blob-row"></div>

    <!-- TEXT -->
    <div class="sec-lbl" style="margin-top:8px">Text</div>
    <div class="el-grid">
      <div class="el-chip wide" draggable="true" ondragstart="dg(event,'heading','')" style="font-family:'Cormorant Garamond',serif;font-size:16px;color:var(--sage-d)">Heading Text</div>
      <div class="el-chip wide" draggable="true" ondragstart="dg(event,'caption','')" style="font-size:8px;letter-spacing:2.5px;text-transform:uppercase;font-weight:600;color:var(--ink-l)">CAPTION TEXT</div>
    </div>

  </div>

  <!-- SHAPES -->
  <div class="pscroll hidden" id="pnl-shapes">
    <div class="sh-cat">Basic</div>
    <div class="sh-grid">
      <div class="sh-btn" onclick="addShape('rect')" title="Rect"><svg viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="1" stroke="#8FAF7A" stroke-width="2"/></svg></div>
      <div class="sh-btn" onclick="addShape('roundrect')" title="Rounded"><svg viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="5" stroke="#8FAF7A" stroke-width="2"/></svg></div>
      <div class="sh-btn" onclick="addShape('circle')" title="Circle"><svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#8FAF7A" stroke-width="2"/></svg></div>
      <div class="sh-btn" onclick="addShape('triangle')" title="Triangle"><svg viewBox="0 0 20 20" fill="none"><polygon points="10,2 18,18 2,18" stroke="#8FAF7A" stroke-width="1.8"/></svg></div>
      <div class="sh-btn" onclick="addShape('diamond')" title="Diamond"><svg viewBox="0 0 20 20" fill="none"><polygon points="10,1 19,10 10,19 1,10" stroke="#8FAF7A" stroke-width="1.8"/></svg></div>
    </div>
    <div class="sh-cat">Polygons</div>
    <div class="sh-grid">
      <div class="sh-btn" onclick="addShape('pentagon')"><svg viewBox="0 0 20 20" fill="none"><polygon points="10,1 19,7.6 15.6,18 4.4,18 1,7.6" stroke="#3F5A45" stroke-width="1.8"/></svg></div>
      <div class="sh-btn" onclick="addShape('hexagon')"><svg viewBox="0 0 20 20" fill="none"><polygon points="10,1 18,5.5 18,14.5 10,19 2,14.5 2,5.5" stroke="#3F5A45" stroke-width="1.8"/></svg></div>
      <div class="sh-btn" onclick="addShape('octagon')"><svg viewBox="0 0 20 20" fill="none"><polygon points="6,1 14,1 19,6 19,14 14,19 6,19 1,14 1,6" stroke="#3F5A45" stroke-width="1.8"/></svg></div>
      <div class="sh-btn" onclick="addShape('cross')"><svg viewBox="0 0 20 20" fill="none"><path d="M8,2h4v6h6v4h-6v6h-4v-6H2v-4h6z" stroke="#8FAF7A" stroke-width="1.5"/></svg></div>
      <div class="sh-btn" onclick="addShape('parallelogram')"><svg viewBox="0 0 20 20" fill="none"><polygon points="5,4 19,4 15,16 1,16" stroke="#8FAF7A" stroke-width="1.8"/></svg></div>
    </div>
    <div class="sh-cat">Stars</div>
    <div class="sh-grid">
      <div class="sh-btn" onclick="addShape('star')"><svg viewBox="0 0 20 20" fill="none"><polygon points="10,1 12.5,7.5 19.5,7.8 14.2,12.3 16,19 10,15 4,19 5.8,12.3 0.5,7.8 7.5,7.5" stroke="#D8C3A5" stroke-width="1.5"/></svg></div>
      <div class="sh-btn" onclick="addShape('star4')"><svg viewBox="0 0 20 20" fill="none"><polygon points="10,1 12,8 19,10 12,12 10,19 8,12 1,10 8,8" stroke="#D8C3A5" stroke-width="1.5"/></svg></div>
      <div class="sh-btn" onclick="addShape('star6')"><svg viewBox="0 0 20 20" fill="none"><polygon points="10,1 12,7 18,7 13,11 15,17 10,13 5,17 7,11 2,7 8,7" stroke="#D8C3A5" stroke-width="1.5"/></svg></div>
      <div class="sh-btn" onclick="addShape('burst')"><svg viewBox="0 0 20 20" fill="none"><polygon points="10,1 11.5,7 16,3.5 13.5,9 20,9.5 14.5,12 18,17.5 12,14.5 11,20 9,14.5 2,17 5.5,12 1,9.5 7.5,9 4,3.5 9,7" stroke="#E8A4B4" stroke-width="1.2"/></svg></div>
      <div class="sh-btn" onclick="addShape('ribbon')"><svg viewBox="0 0 20 20" fill="none"><polygon points="10,1 12.5,7.5 19.5,8 15,12 16.5,19 10,15.5 3.5,19 5,12 0.5,8 7.5,7.5" stroke="#D8C3A5" stroke-width="1.5"/></svg></div>
    </div>
    <div class="sh-cat">Arrows</div>
    <div class="sh-grid">
      <div class="sh-btn" onclick="addShape('arrow-r')"><svg viewBox="0 0 20 16" fill="none"><path d="M1,5h13v-4l5,7-5,7v-4H1z" stroke="#8FAF7A" stroke-width="1.5"/></svg></div>
      <div class="sh-btn" onclick="addShape('arrow-l')"><svg viewBox="0 0 20 16" fill="none"><path d="M19,5H6v-4L1,8l5,7v-4h13z" stroke="#8FAF7A" stroke-width="1.5"/></svg></div>
      <div class="sh-btn" onclick="addShape('arrow-u')"><svg viewBox="0 0 16 20" fill="none"><path d="M5,19V6h-4l7-5 7,5h-4v13z" stroke="#3F5A45" stroke-width="1.5"/></svg></div>
      <div class="sh-btn" onclick="addShape('arrow-d')"><svg viewBox="0 0 16 20" fill="none"><path d="M5,1v13h-4l7,5 7-5h-4V1z" stroke="#3F5A45" stroke-width="1.5"/></svg></div>
      <div class="sh-btn" onclick="addShape('dbl-arrow')"><svg viewBox="0 0 20 14" fill="none"><path d="M1,7l4-5v3h10v-3l4,5-4,5v-3H5v3z" stroke="#8FAF7A" stroke-width="1.5"/></svg></div>
    </div>
    <div class="sh-cat">Speech &amp; Hearts</div>
    <div class="sh-grid">
      <div class="sh-btn" onclick="addShape('speech')"><svg viewBox="0 0 20 18" fill="none"><path d="M2,2h16v10H8l-4,5v-5H2z" stroke="#8FAF7A" stroke-width="1.5"/></svg></div>
      <div class="sh-btn" onclick="addShape('thought')"><svg viewBox="0 0 20 18" fill="none"><ellipse cx="10" cy="6" rx="8" ry="5" stroke="#3F5A45" stroke-width="1.5"/><circle cx="7" cy="13" r="1.5" stroke="#3F5A45" stroke-width="1.2"/><circle cx="5" cy="17" r="1" stroke="#3F5A45" stroke-width="1.2"/></svg></div>
      <div class="sh-btn" onclick="addShape('cloud')"><svg viewBox="0 0 20 14" fill="none"><path d="M4.5,12 A4,4 0 0,1 4,4.5 A3.5,3.5 0 0,1 10.5,2.5 A4,4 0 0,1 18,6 A3,3 0 0,1 16,12z" stroke="#3F5A45" stroke-width="1.5"/></svg></div>
      <div class="sh-btn" onclick="addShape('heart')"><svg viewBox="0 0 20 18" fill="none"><path d="M10,16C10,16 2,10.5 2,5.5 A4,4 0 0,1 10,4 A4,4 0 0,1 18,5.5 C18,10.5 10,16 10,16z" stroke="#E8A4B4" stroke-width="1.5"/></svg></div>
      <div class="sh-btn" onclick="addShape('flower')"><svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3" stroke="#E8A4B4" stroke-width="1.5"/><ellipse cx="10" cy="4" rx="2.5" ry="3" stroke="#E8A4B4" stroke-width="1.2"/><ellipse cx="10" cy="16" rx="2.5" ry="3" stroke="#E8A4B4" stroke-width="1.2"/><ellipse cx="4" cy="10" rx="3" ry="2.5" stroke="#E8A4B4" stroke-width="1.2"/><ellipse cx="16" cy="10" rx="3" ry="2.5" stroke="#E8A4B4" stroke-width="1.2"/></svg></div>
    </div>
    <div class="sh-cat">Lines &amp; Banners</div>
    <div class="sh-grid">
      <div class="sh-btn" onclick="addShape('line')"><svg viewBox="0 0 20 8" fill="none"><line x1="1" y1="4" x2="19" y2="4" stroke="#8FAF7A" stroke-width="2.5"/></svg></div>
      <div class="sh-btn" onclick="addShape('banner1')"><svg viewBox="0 0 20 12" fill="none"><path d="M1,1h18v8l-3,-3H4l-3,3z" stroke="#3F5A45" stroke-width="1.5"/></svg></div>
      <div class="sh-btn" onclick="addShape('banner2')"><svg viewBox="0 0 20 16" fill="none"><path d="M2,2h12l5,6-5,6H2z" stroke="#8FAF7A" stroke-width="1.5"/></svg></div>
      <div class="sh-btn" onclick="addShape('oval')"><svg viewBox="0 0 20 12" fill="none"><ellipse cx="10" cy="6" rx="9" ry="5" stroke="#3F5A45" stroke-width="1.5"/></svg></div>
      <div class="sh-btn" onclick="addShape('frame')"><svg viewBox="0 0 20 20" fill="none"><rect x="1" y="1" width="18" height="18" stroke="#8FAF7A" stroke-width="2"/><rect x="4" y="4" width="12" height="12" stroke="#8FAF7A" stroke-width="1"/></svg></div>
    </div>
  </div>

  <!-- DRAW -->
  <div class="pscroll hidden" id="pnl-draw">
    <div class="sec-lbl">Tool</div>
    <div class="dt-list">
      <div class="dt-btn on" id="dt-pen" onclick="selDT('pen',this)"><div class="dt-icon">&#9998;</div><div><div class="dt-name">Pen</div><div class="dt-desc">Fine lines</div></div></div>
      <div class="dt-btn" id="dt-marker" onclick="selDT('marker',this)"><div class="dt-icon">&#128396;</div><div><div class="dt-name">Marker</div><div class="dt-desc">Bold strokes</div></div></div>
      <div class="dt-btn" id="dt-highlighter" onclick="selDT('highlighter',this)"><div class="dt-icon">&#128397;</div><div><div class="dt-name">Highlighter</div><div class="dt-desc">50% opacity</div></div></div>
      <div class="dt-btn" id="dt-eraser" onclick="selDT('eraser',this)"><div class="dt-icon">&#10063;</div><div><div class="dt-name">Eraser</div><div class="dt-desc">Remove marks</div></div></div>
    </div>
    <div class="sec-lbl" style="margin-top:12px">Size</div>
    <div class="ctrl-row">
      <label>Brush</label>
      <input type="range" id="brush-sz" min="1" max="40" value="4" oninput="updBrush(this.value)">
      <span class="val" id="brush-val">4</span>
    </div>
    <div class="sec-lbl">Colour</div>
    <div class="ctrl-row">
      <label>Pick</label>
      <input type="color" id="draw-color-inp" value="#3F5A45" oninput="updDrawColor(this.value)">
    </div>
    <div class="dc-row" id="draw-cols"></div>
    <div class="sec-lbl" style="margin-top:12px">Actions</div>
    <div class="btn-grid">
      <div class="sm-btn" onclick="undoDraw()">Undo</div>
      <div class="sm-btn" onclick="clearDraw()">Clear All</div>
    </div>
  </div>

  <!-- NOTES -->
  <div class="pscroll hidden" id="pnl-notes">
    <div class="sec-lbl">Colour</div>
    <div class="note-grid" id="note-grid"></div>
    <div class="sec-lbl">Quick Add</div>
    <div class="el-grid">
      <div class="el-chip wide" onclick="addSticky('#F7F3EE')" style="cursor:pointer">Cream Note</div>
      <div class="el-chip wide" onclick="addSticky('#EBF2E5')" style="cursor:pointer;background:var(--sage-l)">Sage Note</div>
      <div class="el-chip wide" onclick="addSticky('#FDF0F4')" style="cursor:pointer;background:var(--blush-l)">Blush Note</div>
      <div class="el-chip wide" onclick="addSticky('#FEF3EF')" style="cursor:pointer;background:var(--peach-l)">Peach Note</div>
      <div class="el-chip wide" onclick="addSticky('#F5F0E8')" style="cursor:pointer;background:var(--wood-l)">Wood Note</div>
      <div class="el-chip wide" onclick="addSticky('#3F5A45')" style="cursor:pointer;background:var(--sage-d);color:#fff">Forest Note</div>
    </div>
  </div>

  <!-- STYLES -->
  <div class="pscroll hidden" id="pnl-styles">

    <!-- BOARD BACKGROUND -->
    <div class="sec-lbl">Board Background</div>
    <div class="bg-grid" id="bg-grid"></div>

    <!-- PALETTE -->
    <div class="sec-lbl" style="margin-top:10px">Palette</div>
    <div class="palette-row" id="palette-row"></div>

    <!-- FRAME -->
    <div class="sec-lbl" style="margin-top:10px">Frame</div>
    <div class="frame-grid" id="frame-grid"></div>

    <!-- COLOUR PICKER trigger -->
    <div class="sec-lbl" style="margin-top:10px">Colour Picker</div>
    <div class="btn-grid" style="margin-bottom:10px">
      <div class="sm-btn" onclick="openCpick('fill',this)" style="display:flex;align-items:center;gap:5px">
        <div id="cpick-fill-preview" style="width:14px;height:14px;border-radius:3px;background:#EBF2E5;border:1px solid var(--border);flex-shrink:0"></div>
        Fill colour
      </div>
      <div class="sm-btn" onclick="openCpick('stroke',this)" style="display:flex;align-items:center;gap:5px">
        <div id="cpick-stroke-preview" style="width:14px;height:14px;border-radius:3px;background:transparent;border:2.5px solid #8FAF7A;flex-shrink:0"></div>
        Stroke colour
      </div>
    </div>

    <!-- STROKE WIDTH + OPACITY -->
    <div class="style-sec">
      <div class="style-row">
        <label>Stroke W</label>
        <input type="range" id="stroke-w-inp" min="0" max="14" value="3" oninput="applyStrokeW(this.value)">
      </div>
      <div class="style-row">
        <label>Opacity</label>
        <input type="range" id="opac-inp" min="10" max="100" value="100" oninput="applyOpacity(this.value)">
      </div>
    </div>

    <!-- LAYER + TRANSFORM -->
    <div class="sec-lbl">Layer &amp; Transform</div>
    <div class="btn-grid">
      <div class="sm-btn" onclick="bringFront()">Bring Front</div>
      <div class="sm-btn" onclick="sendBack()">Send Back</div>
      <div class="sm-btn" onclick="flipH()">&#8596; Flip H</div>
      <div class="sm-btn" onclick="flipV()">&#8597; Flip V</div>
      <div class="sm-btn" onclick="dupeSelected()">Duplicate</div>
      <div class="sm-btn danger" onclick="delSelected()">Delete</div>
    </div>

    <!-- IMAGE FILTER -->
    <div class="sec-lbl" style="margin-top:10px">Image Filter</div>
    <div class="btn-grid">
      <div class="sm-btn" onclick="applyFilter('none')">Original</div>
      <div class="sm-btn" onclick="applyFilter('grayscale(100%)')">B&amp;W</div>
      <div class="sm-btn" onclick="applyFilter('sepia(60%)')">Sepia</div>
      <div class="sm-btn" onclick="applyFilter('brightness(1.15) saturate(1.3)')">Vivid</div>
      <div class="sm-btn" onclick="applyFilter('contrast(1.2) brightness(.92)')">Matte</div>
      <div class="sm-btn" onclick="applyFilter('sepia(30%) saturate(1.2)')">Warm</div>
    </div>

    <!-- IMAGE BORDER -->
    <div class="sec-lbl" style="margin-top:10px">Image Border</div>
    <div class="btn-grid">
      <div class="sm-btn" onclick="applyBorder('none')">None</div>
      <div class="sm-btn" onclick="applyBorder('4px solid #8FAF7A')">Sage</div>
      <div class="sm-btn" onclick="applyBorder('4px solid #E8A4B4')">Blush</div>
      <div class="sm-btn" onclick="applyBorder('10px solid #fff')">White Mat</div>
      <div class="sm-btn" onclick="applyBorder('3px dashed #8FAF7A')">Dashed</div>
      <div class="sm-btn" onclick="applyBorder('6px double #D8C3A5')">Double</div>
    </div>
  </div>

  <!-- COLOUR PICKER MODAL (shared) -->
  <!-- FONT PANEL -->
  <div class="font-panel" id="font-panel">
    <div class="fp-head">
      <h3>Font</h3>
      <button class="fp-close" onclick="closeFontPanel()">&#10005;</button>
    </div>
    <div class="fp-tabs">
      <div class="fp-tab on" id="fp-tab-font" onclick="switchFpTab('font',this)">Font</div>
      <div class="fp-tab" id="fp-tab-styles" onclick="switchFpTab('styles',this)">Text styles</div>
    </div>
    <div class="fp-search">
      <input class="fp-search-inp" id="fp-search" placeholder='Try "Calligraphy" or "Open Sans"' oninput="filterFonts(this.value)">
    </div>
    <div class="fp-cats" id="fp-cats">
      <div class="fp-cat on" onclick="filterFontCat('all',this)">All</div>
      <div class="fp-cat" onclick="filterFontCat('serif',this)">Serif</div>
      <div class="fp-cat" onclick="filterFontCat('sans',this)">Sans-serif</div>
      <div class="fp-cat" onclick="filterFontCat('display',this)">Display</div>
      <div class="fp-cat" onclick="filterFontCat('mono',this)">Mono</div>
    </div>
    <div class="fp-scroll" id="fp-scroll">
      <div id="fp-font-tab-content">
        <div class="fp-section-title" style="display:flex;align-items:center;gap:6px">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M3 4h8M3 7h6M3 10h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          Document fonts
        </div>
        <div id="fp-doc-fonts"></div>
        <div class="fp-section-title" style="display:flex;align-items:center;gap:6px;margin-top:4px">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 11L7 3l5 8M4 8h6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Recommended fonts
        </div>
        <div id="fp-all-fonts"></div>
      </div>
    </div>
  </div>

  <!-- COLOR PICKER MODAL -->
  <div class="cpick-overlay" id="cpick-overlay" onclick="if(event.target===this)closeCpick()">
    <div class="cpick-modal" id="cpick-modal">
      <span class="cpick-close-btn" onclick="closeCpick()">&#10005;</span>

      <!-- Gradient canvas picker -->
      <div class="cpick-canvas-wrap" id="cpick-canvas-wrap">
        <canvas id="cpick-canvas" width="228" height="130"></canvas>
        <div class="cpick-canvas-cursor" id="cpick-cursor"></div>
      </div>

      <!-- Hue slider -->
      <div class="cpick-hue-wrap" id="cpick-hue-wrap">
        <div class="cpick-hue-thumb" id="cpick-hue-thumb"></div>
      </div>

      <!-- RGB + Hex inputs -->
      <div class="cpick-inputs">
        <div class="cpick-preview-dot" id="cpick-preview"></div>
        <div class="cpick-rgb-box">
          <input class="cpick-rgb-inp" id="cpick-r" type="number" min="0" max="255" value="63" oninput="cpickRGBInput()">
          <div class="cpick-rgb-lbl">R</div>
        </div>
        <div class="cpick-rgb-box">
          <input class="cpick-rgb-inp" id="cpick-g" type="number" min="0" max="255" value="90" oninput="cpickRGBInput()">
          <div class="cpick-rgb-lbl">G</div>
        </div>
        <div class="cpick-rgb-box">
          <input class="cpick-rgb-inp" id="cpick-b" type="number" min="0" max="255" value="69" oninput="cpickRGBInput()">
          <div class="cpick-rgb-lbl">B</div>
        </div>
        <div class="cpick-hex-box">
          <input class="cpick-hex-inp2" id="cpick-hex2" value="#3F5A45" oninput="cpickHex2Input(this.value)" maxlength="7">
          <div class="cpick-rgb-lbl" style="text-align:center">HEX</div>
        </div>
      </div>

      <!-- Search -->
      <div class="cpick-search-wrap">
        <span class="cpick-search-icon">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="5" cy="5" r="3.5" stroke="currentColor" stroke-width="1.3"/><line x1="8" y1="8" x2="11" y2="11" stroke="currentColor" stroke-width="1.3"/></svg>
        </span>
        <input class="cpick-search" id="cpick-search" placeholder='Try "blue" or "#00c4cc"' oninput="cpickSearch(this.value)">
      </div>

      <!-- Document colours -->
      <div class="cpick-sec">
        <div class="cpick-sec-title">Document colours</div>
        <div class="cpick-row" id="cpick-doc-row">
          <div class="cpick-sw add-btn" title="Custom colour" onclick="document.getElementById('cpick-native-inp').click()">+</div>
          <div class="cpick-sw transparent" title="Transparent" onclick="cpickApply('transparent')"></div>
        </div>
        <input type="color" id="cpick-native-inp" value="#3F5A45" style="position:absolute;opacity:0;width:0;height:0" oninput="cpickNativeInput(this.value)">
      </div>

      <!-- Kiddies Kingdom brand -->
      <div class="cpick-sec">
        <div class="cpick-sec-title" style="display:flex;align-items:center;justify-content:space-between">
          <span style="display:flex;align-items:center;gap:6px">
            <svg width="14" height="14" viewBox="0 0 32 20" fill="none">
              <path d="M3 19 A13 13 0 0 1 29 19" stroke="#E07060" stroke-width="4" stroke-linecap="round"/>
              <path d="M7 19 A9 9 0 0 1 25 19" stroke="#E8A96A" stroke-width="4" stroke-linecap="round"/>
              <path d="M11 19 A5 5 0 0 1 21 19" stroke="#7A95A8" stroke-width="4" stroke-linecap="round"/>
            </svg>
            Kiddies Kingdom
          </span>
          <span style="font-size:10px;color:var(--sage-d);cursor:pointer;font-weight:600">Edit</span>
        </div>
        <div class="cpick-brand-sub">Colors from Kiddies Kingdom brand</div>
        <div class="cpick-row" id="cpick-brand-row"></div>
      </div>

      <!-- Photo colours (auto-extracted from uploaded images) -->
      <div class="cpick-sec" id="cpick-photo-sec" style="display:none">
        <div class="cpick-sec-title" style="display:flex;align-items:center;justify-content:space-between">
          <span style="display:flex;align-items:center;gap:6px">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.4"/><circle cx="5" cy="5" r="1.5" fill="currentColor" opacity=".5"/><path d="M1 10l3-3 3 3 2-2 4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Photo colours
          </span>
          <span style="font-size:10px;color:var(--sage-d);cursor:pointer;font-weight:600">See all</span>
        </div>
        <div class="cpick-row" id="cpick-photo-row"></div>
      </div>

      <!-- Default solid colours -->
      <div class="cpick-sec">
        <div class="cpick-sec-title" style="display:flex;align-items:center;justify-content:space-between">
          Default solid colours
          <span style="font-size:10px;color:var(--sage-d);cursor:pointer;font-weight:600">See all</span>
        </div>
        <div class="cpick-row solid-grid" id="cpick-solid-row"></div>
      </div>

      <!-- Default gradient colours -->
      <div class="cpick-sec">
        <div class="cpick-sec-title" style="display:flex;align-items:center;justify-content:space-between">
          Default gradient colours
          <span style="font-size:10px;color:var(--sage-d);cursor:pointer;font-weight:600">See all</span>
        </div>
        <div class="cpick-row grad-grid" id="cpick-grad-row"></div>
      </div>

    </div>
  </div>
</div>

<!-- ═══ CANVAS ═══ -->
<div class="canvas-wrap" id="canvas-wrap"
  ondragover="event.preventDefault();document.getElementById('drop-overlay').classList.add('show')"
  ondragleave="document.getElementById('drop-overlay').classList.remove('show')"
  ondrop="onBoardDrop(event)"
  onmousedown="onBoardMD(event)">
  <div id="drop-overlay" class="drop-overlay"></div>
  <div class="hint-wrap" id="hint-wrap">
    <div class="hint-icon">
      <svg viewBox="0 0 32 32" fill="none">
        <path d="M16 28C16 28 5 20 5 11A11 11 0 0 1 27 11C27 20 16 28 16 28Z" fill="#EBF2E5" stroke="#8FAF7A" stroke-width="1.5"/>
        <path d="M16 28C16 28 21 17 27 11" stroke="#3F5A45" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M16 28C16 28 11 18 5 12" stroke="#3F5A45" stroke-width="1" stroke-linecap="round" opacity=".5"/>
      </svg>
    </div>
    <div class="hint-h">Start your moodboard</div>
    <div class="hint-p">Drag products from the Shop panel<br>or double-click to add text anywhere</div>
  </div>
  <div id="board-canvas"></div>
  <canvas id="draw-canvas"></canvas>
</div>

</div><!-- /main -->

<!-- ═══ BROWSE PRODUCTS MODAL ═══ -->
<div class="browse-overlay" id="browse-overlay" onclick="if(event.target===this)closeBrowse()">
  <div class="browse-modal">
    <div class="bm-head">
      <div class="bm-head-top">
        <div class="bm-title">Browse Products from Kiddies Kingdom</div>
        <div class="bm-close" onclick="closeBrowse()">&#10005;</div>
      </div>
      <!-- Search -->
      <div class="bm-search-row">
        <div class="bm-search-wrap">
          <span class="bm-search-icon">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" stroke-width="1.5"/><line x1="9.5" y1="9.5" x2="13" y2="13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </span>
          <input class="bm-search-inp" id="bm-search-inp" placeholder="Search products..." oninput="bmFilter()" onkeydown="if(event.key==='Enter')bmFilter()">
        </div>
        <button class="bm-search-btn" onclick="bmFilter()">Search</button>
      </div>
      <!-- Collection + Age filters -->
      <div class="bm-filter-row" style="margin-top:10px">
        <span class="bm-filter-label">Collection:</span>
        <select class="bm-collection-sel" id="bm-collection" onchange="bmFilter()">
          <option value="">All Collections</option>
          <option value="blocks">Open-Ended Play</option>
          <option value="motor">Motor Skill Toys</option>
          <option value="montessori">Montessori &amp; Learning</option>
          <option value="pretend">Pretend Play</option>
          <option value="furniture">Kids Furniture</option>
          <option value="storage">Organisers &amp; Storage</option>
          <option value="diy">DIY Kits</option>
          <option value="games">Games</option>
          <option value="dollhouse">Dollhouses &amp; Playsets</option>
          <option value="active">Active Play</option>
        </select>
        <span class="bm-filter-label" style="margin-left:6px">Age:</span>
        <div class="bm-age-pill on" data-age="" onclick="bmAgeFilter('',this)">All</div>
        <div class="bm-age-pill" data-age="0-1" onclick="bmAgeFilter('0-1',this)">0–1</div>
        <div class="bm-age-pill" data-age="1-3" onclick="bmAgeFilter('1-3',this)">1–3</div>
        <div class="bm-age-pill" data-age="3-6" onclick="bmAgeFilter('3-6',this)">3–6</div>
        <div class="bm-age-pill" data-age="6-12" onclick="bmAgeFilter('6-12',this)">6+</div>
      </div>
    </div>
    <div class="bm-results-bar">
      <div>Showing <span id="bm-count">0</span> products</div>
      <div style="font-size:10px;color:var(--ink-l)">Click a product to add to canvas</div>
    </div>
    <div class="bm-grid-wrap">
      <div class="bm-grid" id="bm-grid"></div>
    </div>
  </div>
</div>

<div class="statusbar">
  <div class="st-dot"></div>
  <span id="st-count">0 items</span>
  <span>&middot;</span>
  <span id="st-msg">Drag products to begin · double-click canvas to add text</span>
  <span class="st-kk">kiddieskingdom.in</span>
</div>

<div class="toast" id="toast"></div>

<script>
// ───────────────────────────────────────────────
//  PRODUCTS  (with prices from site)
// ───────────────────────────────────────────────
// ── Collection label map ──
const CAT_LABELS = {
  blocks:'Open-Ended Play', motor:'Motor Skill Toys',
  montessori:'Montessori & Learning', pretend:'Pretend Play',
  furniture:'Kids Furniture', storage:'Organisers & Storage',
  diy:'DIY Kits', games:'Games', dollhouse:'Dollhouses & Playsets',
  active:'Active Play'
};

const PRODUCTS = [
  // Open-Ended Play / Blocks
  {name:'15-Piece Castle Blocks Set',  col:'blocks',   cat:'Open-Ended Play',  age:'3-10', ageN:[3,10],  price:'₹2,999', url:'https://kiddieskingdom.in/shop/15-piece-classical-castle-block-set',    img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fwooden-blocks-02%2F8.png&w=640&q=75',   alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fwooden-blocks-02%2F1.png&w=640&q=75'},
  {name:'64-Piece Natural Wood Blocks',col:'blocks',   cat:'Open-Ended Play',  age:'2-10', ageN:[2,10],  price:'₹4,999', url:'https://kiddieskingdom.in/shop/64-piece-wooden-building-blocks-set',      img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fwooden-blocks-01%2F9.png&w=640&q=75',   alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fwooden-blocks-01%2F1.png&w=640&q=75'},
  {name:'47-Piece Natural Wood Blocks',col:'blocks',   cat:'Open-Ended Play',  age:'2-8',  ageN:[2,8],   price:'₹1,500', url:'https://kiddieskingdom.in/shop/47-piece-pure-nature-wooden-blocks',        img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fwooden-blocks-03%2F8.png&w=640&q=75',   alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fwooden-blocks-03%2F1.png&w=640&q=75'},
  {name:'Castle Building Blocks Set',  col:'blocks',   cat:'Open-Ended Play',  age:'3-10', ageN:[3,10],  price:'₹1,999', url:'https://kiddieskingdom.in/shop/medieval-castle-building-blocks',            img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fwooden-blocks-04%2F8.png&w=640&q=75',   alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fwooden-blocks-04%2F1.png&w=640&q=75'},
  {name:'Starter Blocks Set',          col:'blocks',   cat:'Open-Ended Play',  age:'2-8',  ageN:[2,8],   price:'₹2,499', url:'https://kiddieskingdom.in/shop/core-four-starter-block-set',               img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fwooden-blocks-05%2F8.png&w=640&q=75',   alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fwooden-blocks-05%2F1.png&w=640&q=75'},
  {name:'First Blocks Set',            col:'blocks',   cat:'Open-Ended Play',  age:'2-6',  ageN:[2,6],   price:'₹1,799', url:'https://kiddieskingdom.in/shop/beginner-wooden-block-set-flat-plank',       img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fwooden-blocks-06%2F6.png&w=640&q=75',   alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fwooden-blocks-06%2F1.png&w=640&q=75'},
  // Motor Skill
  {name:'Rainbow Peg Board',           col:'motor',    cat:'Motor Skill Toys', age:'1-6',  ageN:[1,6],   price:'₹2,199', url:'https://kiddieskingdom.in/shop/rainbow-pegboard',                          img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-MK-06-1.png&w=640&q=75',            alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-MK-06-2.png&w=640&q=75'},
  {name:'Brown Stair Set',             col:'motor',    cat:'Motor Skill Toys', age:'1-6',  ageN:[1,6],   price:'₹1,999', url:'https://kiddieskingdom.in/shop/brown-stair-blocks',                         img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-MK-05-1.png&w=640&q=75',            alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-MK-05-2.png&w=640&q=75'},
  {name:'Red Rods Set',                col:'motor',    cat:'Motor Skill Toys', age:'1-6',  ageN:[1,6],   price:'₹1,999', url:'https://kiddieskingdom.in/shop/red-rod-steps-sticks-set',                   img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-MK-04-1.png&w=640&q=75',            alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-MK-04-2.png&w=640&q=75'},
  {name:'Fruit Stacker',               col:'motor',    cat:'Motor Skill Toys', age:'1-6',  ageN:[1,6],   price:'₹899',   url:'https://kiddieskingdom.in/shop/fruit-stacker-set',                          img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-MK-03-1.png&w=640&q=75',            alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-MK-03-2.png&w=640&q=75'},
  {name:'Rocket Shape Sorter',         col:'motor',    cat:'Motor Skill Toys', age:'1-6',  ageN:[1,6],   price:'₹1,299', url:'https://kiddieskingdom.in/shop/rocket-shape-sorter',                        img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-MK-02-1.png&w=640&q=75',            alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-MK-02-2.png&w=640&q=75'},
  {name:'Color Stacking Blocks',       col:'motor',    cat:'Motor Skill Toys', age:'1-6',  ageN:[1,6],   price:'₹799',   url:'https://kiddieskingdom.in/shop/color-square-stacker',                       img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-MK-01-1.png&w=640&q=75',            alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-MK-01-2.png&w=640&q=75'},
  // Kids Furniture
  {name:'Montessori Cloud Shelf',      col:'furniture',cat:'Kids Furniture',   age:'3-9',  ageN:[3,9],   price:'₹10,090',url:'https://kiddieskingdom.in/shop/toddler-cloud-shelf',                        img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FToddler%20Cloud%20Shelf.jpg&w=640&q=75', alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FToddler%20Cloud%20Shelf2.jpg&w=640&q=75'},
  {name:'Ratatouille Chair',           col:'furniture',cat:'Kids Furniture',   age:'3-9',  ageN:[3,9],   price:'₹7,690', url:'https://kiddieskingdom.in/shop/ratatouille-chair',                           img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fchair.webp&w=640&q=75',                 alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Fchair.webp&w=640&q=75'},
  {name:'Butterfly Chair',             col:'furniture',cat:'Kids Furniture',   age:'3-9',  ageN:[3,9],   price:'₹7,690', url:'https://kiddieskingdom.in/shop/lili-fly-g-butterfly-chair',                  img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Flilifly.WEBP&w=640&q=75',               alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Flilifly2.WEBP&w=640&q=75'},
  {name:'Kids Round Table',            col:'furniture',cat:'Kids Furniture',   age:'3-9',  ageN:[3,9],   price:'₹9,500', url:'https://kiddieskingdom.in/shop/childrens-round-table',                       img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Froundtable.WEBP&w=640&q=75',            alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Froundtable2.WEBP&w=640&q=75'},
  // Storage
  {name:'Bus Bookshelf',               col:'storage',  cat:'Organisers & Storage',age:'3-9',ageN:[3,9],  price:'₹12,500',url:'https://kiddieskingdom.in/shop/bus-book-shelf',                              img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FBus%20Book%20Shelf.jpg&w=640&q=75',     alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FBus%20Book%20Shelf2.jpg&w=640&q=75'},
  {name:'Peg Board Organiser',         col:'storage',  cat:'Organisers & Storage',age:'3-9',ageN:[3,9],  price:'₹32,000',url:'https://kiddieskingdom.in/shop/pegboard',                                    img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FPegboard%201.webp&w=640&q=75',          alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FPegboard%202.webp&w=640&q=75'},
  {name:'Alphabet Shelf Letter G',     col:'storage',  cat:'Organisers & Storage',age:'0-12',ageN:[0,12],price:'₹15,499',url:'https://kiddieskingdom.in/shop/alphabet-shelf-letter-g',                    img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Falphabet-shelf-g%2Fmain.jpg&w=640&q=75', alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Falphabet-shelf-g%2Fcolors.jpg&w=640&q=75'},
  {name:'Alphabet Shelf Letter A',     col:'storage',  cat:'Organisers & Storage',age:'0-12',ageN:[0,12],price:'₹15,499',url:'https://kiddieskingdom.in/shop/alphabet-shelf-letter-a',                    img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Falphabet-shelf-a%2Fmain.jpg&w=640&q=75', alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2Falphabet-shelf-a%2Fcolors.jpg&w=640&q=75'},
  // DIY
  {name:'DIY Tree Painting Kit',       col:'diy',      cat:'DIY Kits',         age:'3-9',  ageN:[3,9],   price:'₹1,200', url:'https://kiddieskingdom.in/shop/diy-tree-painting-kit',                       img:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-DY-03-1.png&w=640&q=75',            alt:'https://kiddieskingdom.in/_next/image?url=%2Fproducts%2FKK-DY-03-4.png&w=640&q=75'},
];

const SHAPES = {
  rect:         {vb:'0 0 120 80',  s:'<rect x="3" y="3" width="114" height="74" rx="4" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  roundrect:    {vb:'0 0 120 80',  s:'<rect x="3" y="3" width="114" height="74" rx="24" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  circle:       {vb:'0 0 120 120', s:'<ellipse cx="60" cy="60" rx="57" ry="57" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  triangle:     {vb:'0 0 120 120', s:'<polygon points="60,4 116,116 4,116" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  diamond:      {vb:'0 0 120 120', s:'<polygon points="60,4 116,60 60,116 4,60" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  pentagon:     {vb:'0 0 120 120', s:'<polygon points="60,4 114,43 92,110 28,110 6,43" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  hexagon:      {vb:'0 0 120 120', s:'<polygon points="60,4 110,32 110,88 60,116 10,88 10,32" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  octagon:      {vb:'0 0 120 120', s:'<polygon points="38,4 82,4 116,38 116,82 82,116 38,116 4,82 4,38" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  cross:        {vb:'0 0 120 120', s:'<path d="M42,4h36v38h38v36h-38v38h-36v-38H4v-36h38z" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  parallelogram:{vb:'0 0 120 80',  s:'<polygon points="30,4 116,4 90,76 4,76" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  star:         {vb:'0 0 120 120', s:'<polygon points="60,4 73,43 114,43 82,68 93,107 60,84 27,107 38,68 6,43 47,43" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  star4:        {vb:'0 0 120 120', s:'<polygon points="60,4 68,52 116,60 68,68 60,116 52,68 4,60 52,52" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  star6:        {vb:'0 0 120 120', s:'<polygon points="60,4 70,40 105,20 85,55 116,60 85,65 105,100 70,80 60,116 50,80 15,100 35,65 4,60 35,55 15,20 50,40" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  burst:        {vb:'0 0 120 120', s:'<polygon points="60,4 65,44 94,18 77,52 116,50 84,68 108,94 72,82 74,116 56,88 40,116 44,80 8,92 34,68 4,44 42,56 22,22 52,44" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  ribbon:       {vb:'0 0 120 120', s:'<polygon points="60,4 76,50 118,52 86,80 98,118 60,94 22,118 34,80 2,52 44,50" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  'arrow-r':    {vb:'0 0 120 80',  s:'<path d="M4,28h78v-18l36,30-36,30v-18H4z" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  'arrow-l':    {vb:'0 0 120 80',  s:'<path d="M116,28H38v-18L2,40l36,30v-18h78z" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  'arrow-u':    {vb:'0 0 80 120',  s:'<path d="M28,116V38H10L40,2l30,36H52v78z" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  'arrow-d':    {vb:'0 0 80 120',  s:'<path d="M28,4v78H10l30,36 30-36H52V4z" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  'dbl-arrow':  {vb:'0 0 120 80',  s:'<path d="M4,40l28-30v16h56V10l28,30-28,30V54H32v16z" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  speech:       {vb:'0 0 120 100', s:'<path d="M4,4h112v68H54l-24,24V72H4z" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  thought:      {vb:'0 0 120 120', s:'<ellipse cx="60" cy="50" rx="56" ry="38" fill="__F__" stroke="__S__" stroke-width="__W__"/><circle cx="44" cy="96" r="8" fill="__F__" stroke="__S__" stroke-width="__W__"/><circle cx="30" cy="112" r="5" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  cloud:        {vb:'0 0 120 90',  s:'<path d="M30,80 a24,24 0 0,1 0-48 a18,18 0 0,1 36-4 a28,28 0 0,1 46,26 a20,20 0 0,1 -2,26z" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  heart:        {vb:'0 0 120 110', s:'<path d="M60,100C60,100 4,68 4,34 a28,28 0 0,1 56-6 a28,28 0 0,1 56,6C116,68 60,100 60,100z" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  flower:       {vb:'0 0 120 120', s:'<circle cx="60" cy="60" r="18" fill="__F__" stroke="__S__" stroke-width="__W__"/><ellipse cx="60" cy="22" rx="16" ry="20" fill="__F__" stroke="__S__" stroke-width="__W__"/><ellipse cx="60" cy="98" rx="16" ry="20" fill="__F__" stroke="__S__" stroke-width="__W__"/><ellipse cx="22" cy="60" rx="20" ry="16" fill="__F__" stroke="__S__" stroke-width="__W__"/><ellipse cx="98" cy="60" rx="20" ry="16" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  line:         {vb:'0 0 120 20',  s:'<line x1="4" y1="10" x2="116" y2="10" stroke="__S__" stroke-width="__W__" stroke-linecap="round"/>'},
  banner1:      {vb:'0 0 120 70',  s:'<path d="M4,4h112v48l-16,-16H20l-16,16z" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  banner2:      {vb:'0 0 120 120', s:'<path d="M4,4h88l24,56-24,56H4z" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  oval:         {vb:'0 0 120 60',  s:'<ellipse cx="60" cy="30" rx="56" ry="26" fill="__F__" stroke="__S__" stroke-width="__W__"/>'},
  frame:        {vb:'0 0 120 120', s:'<rect x="4" y="4" width="112" height="112" fill="__F__" stroke="__S__" stroke-width="__W__"/><rect x="16" y="16" width="88" height="88" fill="white" stroke="__S__" stroke-width="2"/>'},
};

function mkSVG(type, f, s, w) {
  const d = SHAPES[type]; if (!d) return '';
  return \`<svg viewBox="\${d.vb}" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" data-type="\${type}" data-f="\${f}" data-s="\${s}" data-w="\${w}">\${d.s.replace(/__F__/g,f).replace(/__S__/g,s).replace(/__W__/g,w)}</svg>\`;
}

const BLOB_COLORS   = ['#8FAF7A','#E8A4B4','#F6B8A6','#D8C3A5','#3F5A45','#F7F3EE','#B5CEAC','#EBF2E5'];
const FILL_COLORS   = ['#EBF2E5','#FDF0F4','#FEF3EF','#F5F0E8','#E8A4B4','#8FAF7A','#ffffff','#3F5A45'];
const DRAW_COLORS   = ['#3F5A45','#2A3828','#8FAF7A','#E8A4B4','#F6B8A6','#D8C3A5','#B5CEAC','#ffffff'];
const NOTE_COLORS   = ['#F7F3EE','#EBF2E5','#FDF0F4','#FEF3EF','#F5F0E8','#3F5A45','#E8A4B4','#8FAF7A','#D8C3A5'];
// ── BOARD BACKGROUNDS ──
const BG_BOARDS = [
  {label:'Cream',      bg:'#F7F3EE',           style:'background:#F7F3EE'},
  {label:'Sage Mist',  bg:'linear-gradient(135deg,#EBF2E5 0%,#F7F3EE 100%)', style:'background:linear-gradient(135deg,#EBF2E5 0%,#F7F3EE 100%)'},
  {label:'Blush Glow', bg:'linear-gradient(135deg,#FDF0F4 0%,#F7F3EE 100%)', style:'background:linear-gradient(135deg,#FDF0F4 0%,#F7F3EE 100%)'},
  {label:'Peach Dawn',  bg:'linear-gradient(135deg,#FEF3EF 0%,#FDF0F4 100%)', style:'background:linear-gradient(135deg,#FEF3EF 0%,#FDF0F4 100%)'},
  {label:'Blush Fade',  bg:'linear-gradient(160deg,#FDF0F4 0%,#F7F3EE 60%,#FEF3EF 100%)', style:'background:linear-gradient(160deg,#FDF0F4 0%,#F7F3EE 60%,#FEF3EF 100%)'},
  {label:'Dot Grid',   bg:'', style:"background:radial-gradient(circle,#D8C3A5 1.2px,transparent 1.2px) 0 0/18px 18px,#F7F3EE"},
  {label:'Checker',    bg:'', style:"background:repeating-conic-gradient(#F0EBE3 0% 25%,#F7F3EE 0% 50%) 0 0/18px 18px"},
  {label:'Stripes',    bg:'', style:"background:repeating-linear-gradient(45deg,#EBF2E5 0,#EBF2E5 1.5px,#F7F3EE 1.5px,#F7F3EE 14px)"},
  {label:'Forest',     bg:'#2A3828', style:'background:#2A3828'},
  {label:'White',      bg:'#FFFFFF', style:'background:#FFFFFF'},
  {label:'Blush Pink', bg:'#FDF0F4', style:'background:#FDF0F4'},
  {label:'Sage Green', bg:'#EBF2E5', style:'background:#EBF2E5'},
];

// ── PALETTE COLOURS (brand + extras) ──
const KK_PALETTE = [
  '#E8A4B4','#C4738A','#8FAF7A','#3F5A45','#F7F3EE',
  '#2A3828','#FFD166','#D8C3A5','#F6B8A6','#B5CEAC',
];

// ── FRAME PRESETS ──
const FRAME_PRESETS = [
  {label:'No Frame', wide:true, fn:()=>removeFrame()},
  {label:'Scallop',  icon:'〜',  fn:()=>applyFrame('scallop')},
  {label:'Stripes',  icon:'▦',   fn:()=>applyFrame('stripes')},
  {label:'Dots',     icon:'⁘',   fn:()=>applyFrame('dots')},
  {label:'Rounded',  icon:'▢',   fn:()=>applyFrame('rounded')},
  {label:'Shadow',   icon:'◨',   fn:()=>applyFrame('shadow')},
];

// ── COLOUR PICKER DATA ──
const SOLID_COLORS = [
  '#000000','#404040','#606060','#808080','#A0A0A0','#C0C0C0','#E0E0E0','#FFFFFF',
  '#FF0000','#FF4444','#FF69B4','#E488DD','#B44FCC','#8B44CC','#5533CC','#3333CC',
  '#009999','#00BBBB','#00DDDD','#44AAFF','#2266FF','#1144CC','#002299','#001177',
  '#00AA44','#44CC66','#88EE66','#CCEE44','#FFCC00','#FF9900','#FF6600','#FF3300',
];
const GRAD_COLORS = [
  'linear-gradient(135deg,#000,#666)',
  'linear-gradient(135deg,#999,#eee)',
  'linear-gradient(135deg,#fff,#ccc)',
  'linear-gradient(135deg,#88EE66,#009944)',
  'linear-gradient(135deg,#AA7700,#FFD166)',
  'linear-gradient(135deg,#9B59B6,#E8A4B4)',
  'linear-gradient(135deg,#1a1a3e,#3a3a7e)',
  'linear-gradient(135deg,#a8edea,#fed6e3)',
  'linear-gradient(135deg,#ff6b6b,#ffeaa7)',
  'linear-gradient(135deg,#a29bfe,#fd79a8)',
  'linear-gradient(135deg,#6c5ce7,#a29bfe)',
  'linear-gradient(135deg,#00b09b,#96c93d)',
  'linear-gradient(135deg,#f7971e,#ffd200)',
  'linear-gradient(135deg,#ee0979,#ff6a00)',
  'linear-gradient(135deg,#3f2b96,#a8c0ff)',
  'linear-gradient(135deg,#56ab2f,#a8e063)',
  'linear-gradient(135deg,#f953c6,#b91d73)',
  'linear-gradient(135deg,#0575e6,#021b79)',
  'linear-gradient(135deg,#fc5c7d,#6a3093)',
  'linear-gradient(135deg,#11998e,#38ef7d)',
  'linear-gradient(135deg,#f64f59,#c471ed,#12c2e9)',
];

// ─── STATE ───
let SEL=null, DRAG=null, zC=10, uid=0, items={};
let mvS=null, rzS=null, rtS=null;
let tool='select', dtool='pen', dcolor='#3F5A45', bsize=4;
let dhist=[], isdrw=false, dctx=null, curPanel='shop';

// ─── INIT ───

// ════════════════════════════════════════
//  FONT PANEL
// ════════════════════════════════════════
const ALL_FONTS = [
  // Serif
  {name:'Cormorant Garamond', family:"'Cormorant Garamond',serif",   cat:'serif'},
  {name:'Playfair Display',   family:"'Playfair Display',serif",     cat:'serif'},
  {name:'Lora',               family:"'Lora',serif",                 cat:'serif'},
  {name:'Georgia',            family:"Georgia,serif",                cat:'serif'},
  {name:'Palatino',           family:"'Palatino',serif",             cat:'serif'},
  {name:'Times New Roman',    family:"'Times New Roman',serif",      cat:'serif'},
  // Sans-serif
  {name:'DM Sans',            family:"'DM Sans',sans-serif",         cat:'sans'},
  {name:'Raleway',            family:"'Raleway',sans-serif",         cat:'sans'},
  {name:'Nunito',             family:"'Nunito',sans-serif",          cat:'sans'},
  {name:'Quicksand',          family:"'Quicksand',sans-serif",       cat:'sans'},
  {name:'Oswald',             family:"'Oswald',sans-serif",          cat:'sans'},
  {name:'Arial',              family:"Arial,sans-serif",             cat:'sans'},
  {name:'Helvetica',          family:"Helvetica,sans-serif",         cat:'sans'},
  {name:'Verdana',            family:"Verdana,sans-serif",           cat:'sans'},
  {name:'Trebuchet MS',       family:"'Trebuchet MS',sans-serif",    cat:'sans'},
  {name:'Tahoma',             family:"Tahoma,sans-serif",            cat:'sans'},
  // Display / Handwriting
  {name:'Dancing Script',     family:"'Dancing Script',cursive",     cat:'display'},
  {name:'Pacifico',           family:"'Pacifico',cursive",           cat:'display'},
  {name:'Caveat',             family:"'Caveat',cursive",             cat:'display'},
  {name:'Satisfy',            family:"'Satisfy',cursive",            cat:'display'},
  {name:'Impact',             family:"Impact,sans-serif",            cat:'display'},
  {name:'Comic Sans MS',      family:"'Comic Sans MS',cursive",      cat:'display'},
  // Mono
  {name:'Courier New',        family:"'Courier New',monospace",      cat:'mono'},
  {name:'Lucida Console',     family:"'Lucida Console',monospace",   cat:'mono'},
];
const DOC_FONTS = new Set(["'Cormorant Garamond',serif","'DM Sans',sans-serif"]);
let _currentFontCat = 'all';
let _currentFontFamily = "'Cormorant Garamond',serif";

function buildFontPanel() {
  buildFontList(ALL_FONTS);
  buildDocFonts();
}
function buildDocFonts() {
  const c = document.getElementById('fp-doc-fonts'); if(!c) return;
  c.innerHTML='';
  DOC_FONTS.forEach(fam => {
    const f = ALL_FONTS.find(x=>x.family===fam)||{name:fam.split(',')[0].replace(/'/g,''),family:fam};
    appendFontItem(c, f);
  });
}
function buildFontList(fonts) {
  const c = document.getElementById('fp-all-fonts'); if(!c) return;
  c.innerHTML='';
  fonts.forEach(f => appendFontItem(c, f));
}
function appendFontItem(container, f) {
  const d = document.createElement('div');
  d.className='fp-font-item'+(f.family===_currentFontFamily?' on':'');
  d.innerHTML=\`<span class="fp-font-name" style="font-family:\${f.family}">\${f.name}</span>\${f.family===_currentFontFamily?'<span class="fp-font-check">✓</span>':''}\`;
  d.addEventListener('click',()=>{
    _currentFontFamily=f.family;
    DOC_FONTS.add(f.family);
    pbFontFamily(f.family);
    const label=document.getElementById('pb-font-label');
    if(label)label.textContent=f.name.length>12?f.name.slice(0,10)+'…':f.name;
    buildFontPanel();
    closeFontPanel();
  });
  container.appendChild(d);
}
function filterFonts(q) {
  const q2=q.toLowerCase();
  const filtered=ALL_FONTS.filter(f=>
    f.name.toLowerCase().includes(q2)||
    (_currentFontCat==='all'||f.cat===_currentFontCat)
  );
  buildFontList(filtered);
}
function filterFontCat(cat,el) {
  _currentFontCat=cat;
  document.querySelectorAll('.fp-cat').forEach(x=>x.classList.remove('on'));
  el.classList.add('on');
  const filtered=cat==='all'?ALL_FONTS:ALL_FONTS.filter(f=>f.cat===cat);
  buildFontList(filtered);
}
function switchFpTab(tab,el) {
  document.querySelectorAll('.fp-tab').forEach(x=>x.classList.remove('on'));
  el.classList.add('on');
}
function openFontPanel() {
  document.getElementById('font-panel').classList.add('open');
  setTimeout(()=>document.getElementById('fp-search').focus(),100);
}
function closeFontPanel() {
  document.getElementById('font-panel').classList.remove('open');
}

// ── Extra text formatting ──
function pbUnderline() {
  if(!SEL) return;
  const el=document.getElementById(SEL);if(!el)return;
  const btn=document.getElementById('pb-underline');
  const on=btn.classList.toggle('on');
  el.querySelectorAll('[contenteditable]').forEach(t=>{
    t.style.textDecoration = on ? 'underline' : (document.getElementById('pb-strike').classList.contains('on')?'line-through':'none');
  });
}
function pbStrike() {
  if(!SEL) return;
  const el=document.getElementById(SEL);if(!el)return;
  const btn=document.getElementById('pb-strike');
  const on=btn.classList.toggle('on');
  el.querySelectorAll('[contenteditable]').forEach(t=>{
    t.style.textDecoration = on ? 'line-through' : (document.getElementById('pb-underline').classList.contains('on')?'underline':'none');
  });
}
function pbSizeStep(d) {
  const inp=document.getElementById('pb-font-sz');if(!inp)return;
  const cur=parseInt(inp.value)||24;
  const nv=Math.max(8,Math.min(120,cur+d));
  inp.value=nv; pbFontSize(nv);
}
function openTextColorPicker() {
  _cpickTarget='fill'; // fill = text colour when text selected
  buildCpick(); positionCpick();
  document.getElementById('cpick-overlay').classList.add('open');
}

// ════════════════════════════════════════
//  CANVAS COLOR PICKER (gradient + hue)
// ════════════════════════════════════════
let _cpickHue = 120;  // start on green
let _cpickSV = {s:0.3, v:0.9};
let _cpickDragging = null;

function initCpickCanvas() {
  const wrap = document.getElementById('cpick-canvas-wrap');
  const hueWrap = document.getElementById('cpick-hue-wrap');
  if (!wrap || !hueWrap) return;
  wrap.addEventListener('mousedown', e=>{_cpickDragging='sv'; cpickSVDrag(e);});
  hueWrap.addEventListener('mousedown', e=>{_cpickDragging='hue'; cpickHueDrag(e);});
  document.addEventListener('mousemove', e=>{
    if(_cpickDragging==='sv') cpickSVDrag(e);
    else if(_cpickDragging==='hue') cpickHueDrag(e);
  });
  document.addEventListener('mouseup', ()=>{_cpickDragging=null;});
  drawCpickCanvas();
}
function drawCpickCanvas() {
  const cvs = document.getElementById('cpick-canvas');if(!cvs)return;
  const ctx = cvs.getContext('2d');
  const w=cvs.offsetWidth||228, h=cvs.offsetHeight||130;
  cvs.width=w; cvs.height=h;
  // base hue color
  const baseColor = hsvToHex(_cpickHue,1,1);
  // white to hue gradient (horizontal)
  const gH = ctx.createLinearGradient(0,0,w,0);
  gH.addColorStop(0,'#fff'); gH.addColorStop(1,baseColor);
  ctx.fillStyle=gH; ctx.fillRect(0,0,w,h);
  // transparent to black gradient (vertical)
  const gV = ctx.createLinearGradient(0,0,0,h);
  gV.addColorStop(0,'rgba(0,0,0,0)'); gV.addColorStop(1,'#000');
  ctx.fillStyle=gV; ctx.fillRect(0,0,w,h);
  // cursor position
  const cur = document.getElementById('cpick-cursor');
  if(cur){ cur.style.left=(_cpickSV.s*100)+'%'; cur.style.top=((1-_cpickSV.v)*100)+'%'; }
  syncCpickColor();
}
function cpickSVDrag(e) {
  const wrap=document.getElementById('cpick-canvas-wrap');if(!wrap)return;
  const r=wrap.getBoundingClientRect();
  _cpickSV.s=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));
  _cpickSV.v=Math.max(0,Math.min(1,1-(e.clientY-r.top)/r.height));
  drawCpickCanvas();
}
function cpickHueDrag(e) {
  const wrap=document.getElementById('cpick-hue-wrap');if(!wrap)return;
  const r=wrap.getBoundingClientRect();
  const pct=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));
  _cpickHue=Math.round(pct*360);
  const thumb=document.getElementById('cpick-hue-thumb');
  if(thumb)thumb.style.left=(pct*100)+'%';
  drawCpickCanvas();
}
function syncCpickColor() {
  const hex=hsvToHex(_cpickHue,_cpickSV.s,_cpickSV.v);
  const rgb=hexToRgb(hex);
  const hexInp=document.getElementById('cpick-hex2');
  if(hexInp)hexInp.value=hex.toUpperCase();
  if(rgb){
    const r=document.getElementById('cpick-r');if(r)r.value=rgb.r;
    const g=document.getElementById('cpick-g');if(g)g.value=rgb.g;
    const b=document.getElementById('cpick-b');if(b)b.value=rgb.b;
  }
  const prev=document.getElementById('cpick-preview');
  if(prev)prev.style.background=hex;
  // live apply
  if(_cpickDragging) cpickApply(hex);
}
function cpickRGBInput() {
  const r=parseInt(document.getElementById('cpick-r').value)||0;
  const g=parseInt(document.getElementById('cpick-g').value)||0;
  const b=parseInt(document.getElementById('cpick-b').value)||0;
  const hex='#'+[r,g,b].map(n=>Math.max(0,Math.min(255,n)).toString(16).padStart(2,'0')).join('');
  updateCpickFromHex(hex);
}
function cpickHex2Input(v) {
  if(v.match(/^#[0-9a-fA-F]{6}$/)) updateCpickFromHex(v);
}
function updateCpickFromHex(hex) {
  const rgb=hexToRgb(hex);if(!rgb)return;
  const hsv=rgbToHsv(rgb.r,rgb.g,rgb.b);
  _cpickHue=hsv.h; _cpickSV={s:hsv.s,v:hsv.v};
  const thumb=document.getElementById('cpick-hue-thumb');
  if(thumb)thumb.style.left=(_cpickHue/360*100)+'%';
  drawCpickCanvas();
  cpickApply(hex);
}
function cpickNativeInput(v) { updateCpickFromHex(v); }
function cpickSearch(q) {
  // filter the visible swatches — highlight matching ones
  // simple: just filter solid colors
  const q2=q.toLowerCase();
  if(!q2){buildCpickSolid();return;}
  const filtered=SOLID_COLORS.filter(c=>c.toLowerCase().includes(q2));
  const r=document.getElementById('cpick-solid-row');
  r.innerHTML='';
  filtered.forEach(c=>{
    const s=document.createElement('div');s.className='cpick-sw';s.style.background=c;s.title=c;
    if(c==='#FFFFFF')s.style.boxShadow='0 0 0 1.5px #ccc';
    s.addEventListener('click',()=>cpickApply(c));r.appendChild(s);
  });
}
function positionCpick(anchorEl) {
  const modal=document.getElementById('cpick-modal');if(!modal)return;
  if(anchorEl) {
    const r=anchorEl.getBoundingClientRect();
    const left=Math.min(r.left, window.innerWidth-270);
    const top=Math.min(r.bottom+6, window.innerHeight-500);
    modal.style.top=top+'px'; modal.style.left=left+'px';
  } else {
    modal.style.top='60px'; modal.style.left='280px';
  }
}

// Color math helpers
function hsvToHex(h,s,v) {
  let r,g,b;const i=Math.floor(h/60)%6,f=h/60-Math.floor(h/60),p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s);
  if(i===0){r=v;g=t;b=p;}else if(i===1){r=q;g=v;b=p;}else if(i===2){r=p;g=v;b=t;}
  else if(i===3){r=p;g=q;b=v;}else if(i===4){r=t;g=p;b=v;}else{r=v;g=p;b=q;}
  return '#'+[r,g,b].map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join('');
}
function hexToRgb(hex) {
  const m=hex.replace('#','').match(/.{2}/g);if(!m||m.length<3)return null;
  return {r:parseInt(m[0],16),g:parseInt(m[1],16),b:parseInt(m[2],16)};
}
function rgbToHsv(r,g,b) {
  r/=255;g/=255;b/=255;
  const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;
  let h=0,s=max===0?0:d/max,v=max;
  if(d!==0){
    if(max===r)h=(g-b)/d+(g<b?6:0);
    else if(max===g)h=(b-r)/d+2;
    else h=(r-g)/d+4;
    h/=6;
  }
  return {h:Math.round(h*360),s,v};
}

// Override openCpick to also draw canvas and init hue from current color


// ════════════════════════════════════════
//  BROWSE PRODUCTS MODAL
// ════════════════════════════════════════
let _bmAgeFilter = '';

function openBrowse() {
  document.getElementById('browse-overlay').classList.add('open');
  bmRender(PRODUCTS);
  setTimeout(()=>document.getElementById('bm-search-inp').focus(), 200);
}
function closeBrowse() {
  document.getElementById('browse-overlay').classList.remove('open');
}

function bmFilter() {
  const q = (document.getElementById('bm-search-inp').value||'').toLowerCase().trim();
  const col = document.getElementById('bm-collection').value;
  let results = PRODUCTS.filter(p => {
    const matchQ  = !q || p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q);
    const matchCol = !col || p.col === col;
    const matchAge = !_bmAgeFilter || bmAgeMatch(p.ageN, _bmAgeFilter);
    return matchQ && matchCol && matchAge;
  });
  bmRender(results);
}

function bmAgeMatch(ageN, filter) {
  if (!ageN) return true;
  const ranges = {'0-1':[0,1],'1-3':[1,3],'3-6':[3,6],'6-12':[6,99]};
  const [lo,hi] = ranges[filter]||[0,99];
  return ageN[0] <= hi && ageN[1] >= lo;
}

function bmAgeFilter(age, el) {
  _bmAgeFilter = age;
  document.querySelectorAll('.bm-age-pill').forEach(p=>p.classList.remove('on'));
  el.classList.add('on');
  bmFilter();
}

function bmRender(products) {
  const grid = document.getElementById('bm-grid');
  const countEl = document.getElementById('bm-count');
  grid.innerHTML = '';
  if (countEl) countEl.textContent = products.length;

  if (products.length === 0) {
    grid.innerHTML = '<div class="bm-empty" style="grid-column:1/-1"><svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" stroke="#E2D9CE" stroke-width="2"/><path d="M14 26c1.5-3 5-5 6-5s4.5 2 6 5" stroke="#8A9B88" stroke-width="1.5" stroke-linecap="round"/><circle cx="15" cy="17" r="2" fill="#8A9B88"/><circle cx="25" cy="17" r="2" fill="#8A9B88"/></svg><div>No products found</div><div style="font-size:11px">Try a different search or filter</div></div>';
    return;
  }

  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'bm-card';

    // Image with graceful fallback
    const imgSrc = p.img;
    const altSrc = p.alt;

    card.innerHTML = \`
      <div class="bm-card-img-wrap">
        <img src="\${imgSrc}"
          onerror="this.onerror=null;this.src='\${altSrc}';this.onerror=function(){this.style.display='none';this.parentNode.innerHTML='<div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0ede8\\'><svg width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 40 40\\' fill=\\'none\\'><rect x=\\'4\\' y=\\'4\\' width=\\'32\\' height=\\'32\\' rx=\\'4\\' stroke=\\'#D8C3A5\\' stroke-width=\\'2\\'/><circle cx=\\'15\\' cy=\\'16\\' r=\\'3\\' fill=\\'#D8C3A5\\'/><path d=\\'M4 28l10-8 8 8 5-5 9 9\\' stroke=\\'#D8C3A5\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'/></svg></div>'};"
          loading="lazy" alt="\${p.name}">
        <div class="bm-card-cat">\${p.cat}</div>
        <div class="bm-card-add">+</div>
      </div>
      <div class="bm-card-body">
        <div class="bm-card-name">\${p.name}</div>
        <div class="bm-card-meta">
          <div class="bm-card-price">\${p.price}</div>
          <div class="bm-card-age">\${p.age} yrs</div>
        </div>
      </div>\`;

    card.addEventListener('click', () => {
      bmAddToCanvas(p, card);
    });

    grid.appendChild(card);
  });
}

function bmAddToCanvas(p, cardEl) {
  // Add flash feedback
  const flash = document.createElement('div');
  flash.className = 'bm-added-flash';
  flash.textContent = '✓';
  cardEl.style.position = 'relative';
  cardEl.appendChild(flash);
  setTimeout(() => flash.remove(), 600);

  // Add to canvas
  const bc = document.getElementById('board-canvas');
  const r = bc.getBoundingClientRect();
  // Scatter placement so multiple products don't stack
  const x = r.width * (0.3 + Math.random() * 0.4);
  const y = r.height * (0.25 + Math.random() * 0.35);
  spawnProduct(p, x, y);
  refHint(); refCount();
  toast('Added to board — close modal to arrange');
}

// Keyboard: Escape closes browse modal
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    if (document.getElementById('browse-overlay').classList.contains('open')) {
      closeBrowse();
    }
  }
}, true);


function init() {
  renderProducts(PRODUCTS);
  buildRow('blob-row', BLOB_COLORS, c => { DRAG={type:'blob',color:c}; }, true);
  buildBGs();
  buildPalette();
  buildFrames();
  buildNoteGrid();
  buildDrawColors();
  buildFontPanel();
  initDrawCanvas();
  initCpickCanvas();
  openPanel('shop', document.getElementById('rb-shop'));
}

function renderProducts(arr) {
  const g = document.getElementById('prod-grid');
  g.innerHTML = '';
  arr.forEach(p => {
    const d = document.createElement('div');
    d.className = 'prod-card';
    d.draggable = true;
    d.innerHTML = \`<img src="\${p.img}" onerror="this.src='\${p.alt}'" loading="lazy">
      <div class="pc-cat">\${p.age}</div>
      <div class="pc-name">\${p.name}</div>
      <div class="pc-price">\${p.price}</div>\`;
    const img = d.querySelector('img');
    d.addEventListener('mouseenter', () => img.src = p.alt);
    d.addEventListener('mouseleave', () => img.src = p.img);
    d.addEventListener('dragstart', () => { DRAG = {type:'product', p}; });
    d.addEventListener('dragend', hideDOL);
    g.appendChild(d);
  });
}
function filterCat(cat, el) {
  document.querySelectorAll('.cpill').forEach(x => x.classList.remove('on'));
  el.classList.add('on');
  renderProducts(cat==='all' ? PRODUCTS : PRODUCTS.filter(p=>p.cat===cat));
}

function buildRow(id, colors, clickFn, draggable) {
  const r = document.getElementById(id);
  if (!r) return;
  colors.forEach(c => {
    const s = document.createElement('div');
    s.className = 'csw';
    s.style.background = c;
    if (c === '#ffffff' || c === '#F7F3EE') s.style.boxShadow = '0 0 0 1.5px #ccc';
    if (draggable) { s.draggable = true; s.addEventListener('dragstart', () => { DRAG={type:'blob',color:c}; }); }
    s.addEventListener('click', () => clickFn(c));
    r.appendChild(s);
  });
}
// ── BUILD BACKGROUND GRID ──
function buildBGs() {
  const g = document.getElementById('bg-grid');
  if (!g) return;
  g.innerHTML = '';
  BG_BOARDS.forEach((b, i) => {
    const d = document.createElement('div');
    d.className = 'bg-thumb' + (i===0?' on':'');
    d.style.cssText = b.style;
    // special patterns need inline style for thumb preview
    if (b.label==='Dot Grid') d.style.cssText = "background:radial-gradient(circle,#D8C3A5 1.2px,transparent 1.2px) 0 0/6px 6px,#F7F3EE;border-radius:12px;cursor:pointer;border:2.5px solid transparent;box-shadow:0 1px 6px rgba(42,56,40,.1);transition:all .18s;aspect-ratio:1;position:relative;overflow:hidden;flex-shrink:0";
    if (b.label==='Checker') d.style.cssText = "background:repeating-conic-gradient(#F0EBE3 0% 25%,#F7F3EE 0% 50%) 0 0/8px 8px;border-radius:12px;cursor:pointer;border:2.5px solid transparent;box-shadow:0 1px 6px rgba(42,56,40,.1);transition:all .18s;aspect-ratio:1;position:relative;overflow:hidden;flex-shrink:0";
    if (b.label==='Stripes') d.style.cssText = "background:repeating-linear-gradient(45deg,#EBF2E5 0,#EBF2E5 2px,#F7F3EE 2px,#F7F3EE 8px);border-radius:12px;cursor:pointer;border:2.5px solid transparent;box-shadow:0 1px 6px rgba(42,56,40,.1);transition:all .18s;aspect-ratio:1;position:relative;overflow:hidden;flex-shrink:0";
    const lbl = document.createElement('div');lbl.className='bg-thumb-label';lbl.textContent=b.label;
    d.appendChild(lbl);
    d.addEventListener('click', () => {
      document.querySelectorAll('.bg-thumb').forEach(x=>x.classList.remove('on'));
      d.classList.add('on');
      const bc = document.getElementById('board-canvas');
      const bgVal = b.style.startsWith('background:') ? b.style.slice('background:'.length).trim() : b.style;
      bc.style.background = bgVal;
    });
    g.appendChild(d);
  });
}

// ── BUILD PALETTE ROW ──
function buildPalette() {
  const r = document.getElementById('palette-row');
  if (!r) return;
  KK_PALETTE.forEach(c => {
    const d = document.createElement('div');
    d.className = 'pal-dot';
    d.style.background = c;
    if (c==='#F7F3EE') d.style.boxShadow='0 0 0 1.5px #ccc';
    d.title = c;
    d.addEventListener('click', () => {
      if (SEL) applyFill(c);
      else { document.getElementById('board-canvas').style.background=c; }
    });
    r.appendChild(d);
  });
}

// ── BUILD FRAME GRID ──
function buildFrames() {
  const g = document.getElementById('frame-grid');
  if (!g) return;
  g.innerHTML = '';
  FRAME_PRESETS.forEach(f => {
    const d = document.createElement('div');
    d.className = 'frame-opt' + (f.wide?' wide':'') + (f.label==='No Frame'?' on':'');
    if (f.wide) {
      d.innerHTML = '<div class="frame-preview"></div>' + f.label;
    } else {
      d.innerHTML = '<span class="fi">' + f.icon + '</span>' + f.label;
    }
    d.addEventListener('click', () => {
      document.querySelectorAll('.frame-opt').forEach(x=>x.classList.remove('on'));
      d.classList.add('on');
      f.fn();
    });
    g.appendChild(d);
  });
}
function removeFrame() {
  const bc = document.getElementById('board-canvas');
  bc.style.borderRadius='';bc.style.outline='';bc.style.boxShadow='';bc.style.padding='';
}
function applyFrame(type) {
  const bc = document.getElementById('board-canvas');
  if(type==='rounded'){bc.style.borderRadius='28px';bc.style.outline='';bc.style.boxShadow='';}
  else if(type==='shadow'){bc.style.boxShadow='inset 0 0 60px rgba(42,56,40,.15)';bc.style.borderRadius='';}
  else if(type==='scallop'){bc.style.borderRadius='2px';bc.style.boxShadow='0 0 0 8px #F7F3EE, 0 0 0 12px var(--sage-l)';}
  else if(type==='stripes'){bc.style.outline='8px solid';bc.style.outlineStyle='dashed';bc.style.outlineColor='var(--sage)';}
  else if(type==='dots'){bc.style.outline='6px dotted var(--sage-d)';}
}

// ── COLOUR PICKER ──
let _cpickTarget = 'fill';
const _docColors = new Set();

function openCpick(target, anchorEl) {
  _cpickTarget = target;
  buildCpick();
  let currentColor = '#3F5A45';
  if(SEL){
    const el=document.getElementById(SEL);
    if(el){
      const svg=el.querySelector('svg[data-type]');
      if(target==='fill'&&svg) currentColor=svg.dataset.f||'#EBF2E5';
      else if(target==='stroke'&&svg) currentColor=svg.dataset.s||'#8FAF7A';
      const text=el.querySelector('[contenteditable]');
      if(text&&target==='fill') currentColor=text.style.color||'#3F5A45';
    }
  }
  const hex=currentColor.startsWith('#')?currentColor:'#3F5A45';
  try{ updateCpickFromHex(hex); }catch(e){}
  positionCpick(anchorEl||null);
  document.getElementById('cpick-overlay').classList.add('open');
}
function closeCpick() {
  document.getElementById('cpick-overlay').classList.remove('open');
}
function cpickApply(color) {
  if (_cpickTarget==='fill') {
    pbFill(color);
    const inp = document.getElementById('pb-fill'); if(inp) inp.value = rgbToHex(color);
  } else if (_cpickTarget==='stroke') {
    pbStroke(color);
    const inp = document.getElementById('pb-stroke-c'); if(inp) inp.value = rgbToHex(color);
  } else if (_cpickTarget==='canvas') {
    document.getElementById('board-canvas').style.background = color;
  }
  if(color!=='transparent'){ _docColors.add(color); buildCpickDocRow(); }
  const hexInp = document.getElementById('cpick-hex-inp'); if(hexInp) hexInp.value = color;
  closeCpick();
}
function cpickHexInput(v) {
  if(v.match(/^#[0-9a-fA-F]{6}$/)) {
    document.getElementById('cpick-native-inp').value=v;
    cpickApply(v);
  }
}
function cpickNativeInput(v) {
  document.getElementById('cpick-hex-inp').value=v;
  cpickApply(v);
}
function buildCpick() {
  buildCpickDocRow();
  buildCpickBrand();
  buildCpickSolid();
  buildCpickGrad();
}
function buildCpickDocRow() {
  const r = document.getElementById('cpick-doc-row');
  // keep first 2 static buttons, remove dynamic swatches
  while(r.children.length>2) r.removeChild(r.lastChild);
  _docColors.forEach(c => {
    const s = document.createElement('div');
    s.className='cpick-sw'; s.style.background=c; s.title=c;
    s.addEventListener('click',()=>cpickApply(c));
    r.appendChild(s);
  });
}
function buildCpickBrand() {
  const r = document.getElementById('cpick-brand-row');
  r.innerHTML='';
  KK_PALETTE.forEach(c => {
    const s = document.createElement('div');
    s.className='cpick-sw'; s.style.background=c; s.title=c;
    if(c==='#F7F3EE')s.style.boxShadow='0 0 0 1.5px #ccc';
    s.addEventListener('click',()=>cpickApply(c));
    r.appendChild(s);
  });
}
function buildCpickSolid() {
  const r = document.getElementById('cpick-solid-row');
  r.innerHTML='';
  SOLID_COLORS.forEach(c => {
    const s = document.createElement('div');
    s.className='cpick-sw'; s.style.background=c; s.title=c;
    if(c==='#FFFFFF')s.style.boxShadow='0 0 0 1.5px #ccc';
    s.addEventListener('click',()=>cpickApply(c));
    r.appendChild(s);
  });
}
function buildCpickGrad() {
  const r = document.getElementById('cpick-grad-row');
  r.innerHTML='';
  GRAD_COLORS.forEach(g => {
    const s = document.createElement('div');
    s.className='cpick-sw grad'; s.style.background=g;
    s.addEventListener('click',()=>{
      // for gradients, apply to board background instead if no item selected
      if(SEL){ const el=document.getElementById(SEL); if(el){ const b=el.querySelector('.bi-blob'); if(b)b.style.background=g; } }
      else { document.getElementById('board-canvas').style.background=g; }
      closeCpick();
    });
    r.appendChild(s);
  });
}
function buildNoteGrid() {
  const g = document.getElementById('note-grid');
  NOTE_COLORS.forEach(c => {
    const d = document.createElement('div');
    d.className = 'note-swatch';
    d.style.background = c;
    d.style.color = c==='#3F5A45'||c==='#2A3828'?'#fff':'#2A3828';
    d.textContent = 'Aa';
    d.style.fontFamily = "'Cormorant Garamond',serif";
    d.style.fontWeight = '600';
    d.addEventListener('click', () => addSticky(c));
    g.appendChild(d);
  });
}
function buildDrawColors() {
  const r = document.getElementById('draw-cols');
  DRAW_COLORS.forEach(c => {
    const d = document.createElement('div');
    d.className = 'draw-col' + (c===dcolor?' on':'');
    d.style.background = c;
    if (c==='#ffffff') d.style.boxShadow='0 0 0 1px #ccc';
    d.addEventListener('click', () => {
      dcolor = c;
      document.getElementById('draw-color-inp').value = c==='#ffffff'?'#ffffff':c;
      document.querySelectorAll('.draw-col').forEach(x=>x.classList.remove('on'));
      d.classList.add('on');
    });
    r.appendChild(d);
  });
}

// ─── PANEL ───
const PTITLES = {shop:'Shop Products', elements:'Elements', shapes:'Shapes', draw:'Draw Tools', notes:'Sticky Notes', styles:'Styles'};
function openPanel(name, btn) {
  document.querySelectorAll('.rbt').forEach(b=>b.classList.remove('on'));
  if (btn) btn.classList.add('on');
  if (curPanel===name && !document.getElementById('panel').classList.contains('closed')) { closePanel(); return; }
  curPanel = name;
  document.querySelectorAll('[id^=pnl-]').forEach(p=>p.classList.add('hidden'));
  document.getElementById('pnl-'+name).classList.remove('hidden');
  document.getElementById('panel-title').textContent = PTITLES[name]||name;
  document.getElementById('panel').classList.remove('closed');
}
function closePanel() {
  document.getElementById('panel').classList.add('closed');
  document.querySelectorAll('.rbt').forEach(b=>b.classList.remove('on'));
  curPanel='';
}

// ─── DRAW ───
function initDrawCanvas() {
  const cvs=document.getElementById('draw-canvas'), w=document.getElementById('canvas-wrap');
  cvs.width=w.offsetWidth; cvs.height=w.offsetHeight;
  dctx=cvs.getContext('2d');
  cvs.addEventListener('mousedown',startDraw);
  cvs.addEventListener('mousemove',moveDraw);
  cvs.addEventListener('mouseup',endDraw);
  cvs.addEventListener('mouseleave',endDraw);
}
function setTool(t) {
  tool=t;
  // update rail tool buttons
  document.querySelectorAll('[id^=tt-]').forEach(b=>b.classList.remove('on'));
  const b=document.getElementById('tt-'+t); if(b)b.classList.add('on');
  const cvs=document.getElementById('draw-canvas');
  if(t==='draw'){cvs.classList.add('active');openPanel('draw',document.getElementById('rb-draw'));}
  else{cvs.classList.remove('active');}
}
function selDT(t,el){dtool=t;document.querySelectorAll('.dt-btn').forEach(d=>d.classList.remove('on'));el.classList.add('on');}
function updBrush(v){bsize=parseInt(v);document.getElementById('brush-val').textContent=v;}
function updDrawColor(c){dcolor=c;}
let ldx=0,ldy=0;
function startDraw(e){if(tool!=='draw')return;isdrw=true;const r=document.getElementById('draw-canvas').getBoundingClientRect();ldx=e.clientX-r.left;ldy=e.clientY-r.top;dctx.beginPath();dctx.moveTo(ldx,ldy);}
function moveDraw(e){
  if(!isdrw)return;
  const r=document.getElementById('draw-canvas').getBoundingClientRect();
  const x=e.clientX-r.left,y=e.clientY-r.top;
  dctx.lineCap='round';dctx.lineJoin='round';
  if(dtool==='eraser'){dctx.globalCompositeOperation='destination-out';dctx.lineWidth=bsize*3;dctx.strokeStyle='rgba(0,0,0,1)';dctx.globalAlpha=1;}
  else{dctx.globalCompositeOperation='source-over';dctx.lineWidth=dtool==='marker'?bsize*2.5:bsize;dctx.globalAlpha=dtool==='highlighter'?0.4:1;dctx.strokeStyle=dcolor;}
  dctx.lineTo(x,y);dctx.stroke();dctx.beginPath();dctx.moveTo(x,y);ldx=x;ldy=y;
}
function endDraw(){if(!isdrw)return;isdrw=false;dctx.globalAlpha=1;dctx.globalCompositeOperation='source-over';dhist.push(dctx.getImageData(0,0,dctx.canvas.width,dctx.canvas.height));if(dhist.length>40)dhist.shift();}
function undoDraw(){dhist.pop();if(dhist.length>0)dctx.putImageData(dhist[dhist.length-1],0,0);else dctx.clearRect(0,0,dctx.canvas.width,dctx.canvas.height);toast('Drawing undone');}
function clearDraw(){dctx.clearRect(0,0,dctx.canvas.width,dctx.canvas.height);dhist=[];toast('Drawing cleared');}

// ─── DRAG/DROP ───
function dg(e,type,val){DRAG={type,val};e.dataTransfer.effectAllowed='copy';}
function hideDOL(){document.getElementById('drop-overlay').classList.remove('show');}
function onBoardDrop(e){
  e.preventDefault();hideDOL();if(!DRAG)return;
  const w=document.getElementById('canvas-wrap'),r=w.getBoundingClientRect();
  const x=e.clientX-r.left,y=e.clientY-r.top;
  const d={...DRAG};DRAG=null;
  if(d.type==='product')spawnProduct(d.p,x,y);
  else if(d.type==='blob')spawnBlob(d.color,x,y);
  else if(d.type==='sticker')spawnSticker(d.val,x,y);
  else if(d.type==='upload')spawnUpload(d.url,d.name,x,y);
  else spawnEl(d.type,x,y);
  refHint();refCount();
}
function onBoardMD(e){if(e.target.id==='canvas-wrap'||e.target.id==='board-canvas'||e.target.closest('.hint-wrap'))deselectAll();}

// ─── MOUNT ───
function mkId(){return 'b'+(++uid);}
function mount(el,id,x,y,w,h){
  el.id=id;el.className='bitem';
  el.style.left=(x-w/2)+'px';el.style.top=(y-h/2)+'px';
  el.style.width=w+'px';el.style.height=h+'px';
  el.style.zIndex=++zC;
  items[id]={rot:0,sx:1,sy:1,locked:false};
  attachH(el,id);
  document.getElementById('board-canvas').appendChild(el);
  el.addEventListener('mousedown',ev=>onItemMD(ev,id));
  selectItem(id);
}
function attachH(el,id){
  // ── MOVE HANDLE (top-left, 4-arrow icon) ──
  const mh=document.createElement('div');
  mh.className='move-handle';
  mh.title='Drag to move';
  mh.innerHTML='<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 1v12M4 4l3-3 3 3M4 10l3 3 3-3M1 7h12M4 4l-3 3 3 3M10 4l3 3-3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  mh.addEventListener('mousedown', e => {
    e.stopPropagation(); e.preventDefault();
    selectItem(id);
    el.classList.add('dragging');
    const wrap=document.getElementById('canvas-wrap'), wr=wrap.getBoundingClientRect();
    mvS={id, ox:e.clientX-wr.left-parseInt(el.style.left), oy:e.clientY-wr.top-parseInt(el.style.top)};
  });
  el.appendChild(mh);

  // ── INLINE QUICK BAR (below item, Canva style) ──
  const tb=document.createElement('div');tb.className='tbar';
  tb.innerHTML=
    '<button class="tb del" data-a="del" title="Delete">'+
      '<svg viewBox="0 0 14 14" fill="none" width="13" height="13"><path d="M2 4h10M5 4V2h4v2M5.5 6.5v4M8.5 6.5v4M3 4l.7 7.3A1 1 0 0 0 4.7 12h4.6a1 1 0 0 0 1-.7L11 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>'+
    '</button>'+
    '<span class="t-sep"></span>'+
    '<button class="tb" data-a="fwd" title="Bring forward">'+
      '<svg viewBox="0 0 14 14" fill="none" width="13" height="13"><rect x="4" y="5" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="2" y="1" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5" opacity=".45"/></svg>'+
    '</button>'+
    '<button class="tb" data-a="bwd" title="Send backward">'+
      '<svg viewBox="0 0 14 14" fill="none" width="13" height="13"><rect x="4" y="1" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="2" y="5" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5" opacity=".45"/></svg>'+
    '</button>'+
    '<span class="t-sep"></span>'+
    '<button class="tb" data-a="dup" title="Duplicate (Ctrl+D)">'+
      '<svg viewBox="0 0 14 14" fill="none" width="13" height="13"><rect x="4" y="4" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M1 10V2a1 1 0 0 1 1-1h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'+
    '</button>'+
    '<button class="tb" data-a="lk" title="Lock/Unlock">'+
      '<svg viewBox="0 0 14 14" fill="none" width="13" height="13"><rect x="3" y="6" width="8" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M5 6V4a2 2 0 1 1 4 0v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'+
    '</button>'+
    '<span class="t-sep"></span>'+
    '<button class="tb" data-a="rl" title="Rotate left 15°">'+
      '<svg viewBox="0 0 14 14" fill="none" width="13" height="13"><path d="M2 7A5 5 0 1 1 7 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M2 4v3h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'+
    '</button>'+
    '<button class="tb" data-a="rr" title="Rotate right 15°">'+
      '<svg viewBox="0 0 14 14" fill="none" width="13" height="13"><path d="M12 7A5 5 0 1 0 7 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 4v3h-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'+
    '</button>';
  tb.addEventListener('mousedown',e=>e.stopPropagation());
  tb.addEventListener('click',e=>{
    const a=e.target.closest('[data-a]');if(!a)return;e.stopPropagation();
    const act=a.dataset.a;
    if(act==='rl')rotI(id,-15);
    if(act==='rr')rotI(id,15);
    if(act==='dup')dupeI(id);
    if(act==='lk')lockI(id);
    if(act==='fwd'){document.getElementById(id).style.zIndex=++zC;}
    if(act==='bwd'){const e2=document.getElementById(id);e2.style.zIndex=Math.max(1,parseInt(e2.style.zIndex||10)-2);}
    if(act==='del')removeI(id);
  });
  el.appendChild(tb);
  // rotate handle
  const rh=document.createElement('div');rh.className='rot-handle';rh.innerHTML='&#8635;';
  rh.addEventListener('mousedown',e=>{e.stopPropagation();e.preventDefault();startRot(e,id);});
  el.appendChild(rh);
  // 8 resize handles
  ['nw','nm','ne','wm','em','sw','sm','se'].forEach(pos=>{
    const r=document.createElement('div');r.className='rh '+pos;
    r.addEventListener('mousedown',e=>{e.stopPropagation();e.preventDefault();startRz(e,id,pos);});
    el.appendChild(r);
  });
  // right-click context menu
  el.addEventListener('contextmenu',e=>{e.preventDefault();e.stopPropagation();showCtxMenu(e,id);});
}

// ─── SPAWN ───
function spawnProduct(p,x,y){
  const id=mkId(),el=document.createElement('div');
  const imgSrc = p.img || '';
  const altSrc = p.alt || imgSrc;
  const pol=Math.random()>.45;
  const onerr = \`this.onerror=null;this.src='\${altSrc}'\`;
  if(pol){
    el.innerHTML=\`<div class="bi-pol"><img src="\${imgSrc}" onerror="\${onerr}"><div class="pl">\${p.name}</div></div>\`;
  } else {
    el.innerHTML=\`<div class="bi-img"><img src="\${imgSrc}" onerror="\${onerr}" style="width:100%;height:100%;object-fit:cover;display:block"></div>\`;
  }
  mount(el,id,x,y,165,165);
}
function spawnBlob(c,x,y){const id=mkId();const sz=50+Math.random()*70|0;const el=document.createElement('div');el.innerHTML=\`<div class="bi-blob" style="background:\${c}"></div>\`;mount(el,id,x,y,sz,sz);}
function spawnSticker(v,x,y){const id=mkId(),el=document.createElement('div');el.innerHTML=\`<div class="bi-sticker">\${v}</div>\`;mount(el,id,x,y,72,72);}
function mked(tag,cls,txt,bg,fg){const d=document.createElement(tag);d.className=cls;d.contentEditable='true';d.spellcheck=false;d.textContent=txt;if(bg)d.style.background=bg;if(fg)d.style.color=fg;d.addEventListener('mousedown',e=>e.stopPropagation());return d;}
function spawnEl(type,x,y){
  const id=mkId(),el=document.createElement('div');

  // ── WASHI TAPES ──
  const WASHI_STYLES = {
    'washi-pink':  'repeating-linear-gradient(90deg,#f2a8b8 0,#f2a8b8 10px,#e8d0d8 10px,#e8d0d8 20px)',
    'washi-sage':  'repeating-linear-gradient(90deg,#8FAF7A 0,#8FAF7A 10px,#c5dab8 10px,#c5dab8 20px)',
    'washi-wood':  'repeating-linear-gradient(90deg,#D8C3A5 0,#D8C3A5 10px,#e8d5bc 10px,#e8d5bc 20px)',
    'washi-cream': 'repeating-linear-gradient(90deg,#e8e0d0 0,#e8e0d0 10px,#f5f0e8 10px,#f5f0e8 20px)',
    'washi-blush': 'repeating-linear-gradient(90deg,#E8A4B4 0,#E8A4B4 10px,#fad8e0 10px,#fad8e0 20px)',
    'washi-dark':  'repeating-linear-gradient(90deg,#3F5A45 0,#3F5A45 10px,#5a7d62 10px,#5a7d62 20px)',
    'washi-dot':   'radial-gradient(circle,#E8A4B4 2.5px,transparent 2.5px) 0 0/14px 14px,#fdf0f4',
    'washi-stripe':'repeating-linear-gradient(135deg,#8FAF7A 0,#8FAF7A 4px,#EBF2E5 4px,#EBF2E5 14px)',
    'washi':       'repeating-linear-gradient(90deg,#8FAF7A 0,#8FAF7A 10px,#FFD93D 10px,#FFD93D 20px)',
  };
  if (WASHI_STYLES[type]) {
    el.innerHTML=\`<div style="width:100%;height:100%;background:\${WASHI_STYLES[type]};border-radius:2px;opacity:.88"></div>\`;
    mount(el,id,x,y,160,22); return;
  }

  // ── TAPE STRIPS ──
  if (type==='tape-clear'){
    el.innerHTML=\`<div style="width:100%;height:100%;background:rgba(200,210,230,.3);border:1px solid rgba(150,170,200,.35);border-radius:2px;backdrop-filter:blur(1px)"></div>\`;
    mount(el,id,x,y,120,22); return;
  }
  if (type==='tape-kraft'){
    el.innerHTML=\`<div style="width:100%;height:100%;background:#c4a882;border-radius:2px;opacity:.9"></div>\`;
    mount(el,id,x,y,120,22); return;
  }
  if (type==='tape-white'){
    el.innerHTML=\`<div style="width:100%;height:100%;background:rgba(255,255,255,.92);border:1px solid #ddd;border-radius:2px"></div>\`;
    mount(el,id,x,y,120,22); return;
  }
  if (type==='tape-red'){
    el.innerHTML=\`<div style="width:100%;height:100%;background:#e04040;border-radius:2px;opacity:.9"></div>\`;
    mount(el,id,x,y,120,22); return;
  }

  // ── CHECKER PATTERNS ──
  const CHECKER_STYLES = {
    'checker-pink':       ['#F2A8B8','#fff'],
    'checker-sage':       ['#8FAF7A','#EBF2E5'],
    'checker-bw':         ['#222','#fff'],
    'checker-blush':      ['#E8A4B4','#fdf0f4'],
    'checker-wood':       ['#D8C3A5','#f5f0e8'],
    'checker-dark':       ['#3F5A45','#EBF2E5'],
    'checker-blue-yellow':['#5080E0','#F5E070'],
    'checker-lavender':   ['#B8A8E8','#E8E0F8'],
    'checker-red-blk':    ['#222','#fff'],
    'checker-light-blue': ['#88B8E8','#E8F0F8'],
    'checker-red':        ['#C03040','#FFC8CC'],
    'checker-blue-soft':  ['#7890E8','#F5F8FF'],
    'checker-green-dark': ['#1A5030','#D0E8D8'],
  };
  if (CHECKER_STYLES[type]) {
    const [c1,c2]=CHECKER_STYLES[type];
    el.innerHTML=\`<div style="width:100%;height:100%;background:repeating-conic-gradient(\${c1} 0% 25%,\${c2} 0% 50%) 0 0/20px 20px;border-radius:6px"></div>\`;
    mount(el,id,x,y,160,160); return;
  }

  // ── DECORATIVE LABELS ──
  const LABEL_SVGS = {
    'label-ribbon': {w:200,h:52,svg:\`<svg viewBox="0 0 200 52" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><path d="M6,4h188l-16,22 16,22H6l16-22z" fill="#e04040"/><text x="100" y="31" font-size="14" fill="#fff" text-anchor="middle" font-family="DM Sans,sans-serif" font-weight="700">LABEL</text></svg>\`},
    'label-tag':    {w:180,h:50,svg:\`<svg viewBox="0 0 180 50" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect x="4" y="4" width="172" height="42" rx="6" fill="#3F5A45"/><circle cx="18" cy="25" r="5" fill="#fff" opacity=".7"/><text x="100" y="30" font-size="13" fill="#fff" text-anchor="middle" font-family="DM Sans,sans-serif" font-weight="600">TAG</text></svg>\`},
    'label-flower': {w:200,h:50,svg:\`<svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect x="18" y="6" width="176" height="38" rx="6" fill="#FFD166"/><ellipse cx="18" cy="25" rx="14" ry="14" fill="#F6B8A6"/><text x="112" y="30" font-size="12" fill="#3F5A45" text-anchor="middle" font-family="DM Sans,sans-serif" font-weight="700">NOTE</text></svg>\`},
    'label-scroll': {w:200,h:50,svg:\`<svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><path d="M14,4 C6,4 6,46 14,46h172V6H14z M14,4 C22,4 22,46 14,46" fill="#D8C3A5" stroke="#b8a080" stroke-width="1.5"/><text x="106" y="30" font-size="13" fill="#3F5A45" text-anchor="middle" font-family="Cormorant Garamond,serif" font-style="italic" font-size="15">scroll</text></svg>\`},
    'label-banner': {w:200,h:48,svg:\`<svg viewBox="0 0 200 48" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><path d="M4,4h192v32l-14,-14H18l-14,14z" fill="#8FAF7A"/><text x="100" y="26" font-size="13" fill="#fff" text-anchor="middle" font-family="DM Sans,sans-serif" font-weight="700">BANNER</text></svg>\`},
    'label-stamp':  {w:160,h:52,svg:\`<svg viewBox="0 0 160 52" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect x="4" y="4" width="152" height="44" rx="22" fill="none" stroke="#3F5A45" stroke-width="3" stroke-dasharray="5,3"/><text x="80" y="31" font-size="13" fill="#3F5A45" text-anchor="middle" font-family="DM Sans,sans-serif" font-weight="700">STAMP</text></svg>\`},
  };
  if (LABEL_SVGS[type]) {
    const {w,h,svg}=LABEL_SVGS[type];
    el.innerHTML=svg; mount(el,id,x,y,w,h); return;
  }

  // ── ORIGINAL ELEMENTS ──
  if(type==='tape'){el.innerHTML='<div class="bi-tape"></div>';mount(el,id,x,y,110,22);return;}
  if(type==='washi'){el.innerHTML='<div class="bi-washi"></div>';mount(el,id,x,y,130,18);return;}
  if(type==='tag'){const d=mked('div','bi-tag','Montessori','#3F5A45','#fff');el.appendChild(d);mount(el,id,x,y,130,34);setTimeout(()=>d.focus(),50);return;}
  if(type==='badge'){const d=mked('div','bi-badge','Natural Toy','#8FAF7A','#fff');el.appendChild(d);mount(el,id,x,y,130,32);setTimeout(()=>d.focus(),50);return;}
  if(type==='bubble'){const d=mked('div','bi-bubble','So cute!');el.appendChild(d);mount(el,id,x,y,130,38);setTimeout(()=>d.focus(),50);return;}
  if(type==='heading'){const d=mked('div','bi-text','Kids Room');el.appendChild(d);mount(el,id,x,y,200,52);setTimeout(()=>d.focus(),50);return;}
  if(type==='caption'){const d=mked('div','bi-caption','MONTESSORI INSPIRED');el.appendChild(d);mount(el,id,x,y,220,26);setTimeout(()=>d.focus(),50);return;}
}

// ── POLAROID FRAME SPAWNER ──
function addPolaroid(style) {
  const id=mkId(), el=document.createElement('div');
  const bc=document.getElementById('board-canvas');
  const r=bc.getBoundingClientRect();
  const x=r.width/2, y=r.height/2;

  const STYLES = {
    classic: {bg:'#fff',    border:'1px solid #ddd', shadow:'0 6px 20px rgba(0,0,0,.15)', captionColor:'#888', imgBg:'#f0f0f0'},
    cream:   {bg:'#f5f0e5', border:'1px solid #ddd', shadow:'0 6px 20px rgba(0,0,0,.12)', captionColor:'#a08060', imgBg:'#e8e0cc'},
    shadow:  {bg:'#fff',    border:'1px solid #ddd', shadow:'6px 6px 0 #ccc, 0 6px 20px rgba(0,0,0,.1)', captionColor:'#888', imgBg:'#222'},
    pink:    {bg:'#fff',    border:'4px solid #E8A4B4', shadow:'0 6px 20px rgba(232,164,180,.3)', captionColor:'#c4687a', imgBg:'#fdf0f4'},
    sage:    {bg:'#fff',    border:'4px solid #8FAF7A', shadow:'0 6px 20px rgba(143,175,122,.3)', captionColor:'#5e7d5f', imgBg:'#EBF2E5'},
    dark:    {bg:'#1a1a1a', border:'1px solid #000',   shadow:'0 6px 20px rgba(0,0,0,.5)',   captionColor:'#666',  imgBg:'#111'},
    kraft:   {bg:'#C8B89A', border:'1px solid #a08060',shadow:'0 6px 20px rgba(0,0,0,.15)', captionColor:'#7a6040', imgBg:'#a08060'},
    tape:    {bg:'#fff',    border:'1px solid #ddd', shadow:'0 6px 20px rgba(0,0,0,.15)', captionColor:'#888', imgBg:'#f0f0f0', tape:true},
    stack:   {bg:'#fff',    border:'1px solid #ddd', shadow:'0 6px 20px rgba(0,0,0,.15)', captionColor:'#888', imgBg:'#f0f0f0', stack:true},
  };
  const s=STYLES[style]||STYLES.classic;
  const iconColor = (style==='dark'||style==='shadow')?'#444':'#ccc';
  const imgIcon = \`<svg width="28" height="22" viewBox="0 0 28 22" fill="none"><rect x="1" y="1" width="26" height="20" rx="2" stroke="\${iconColor}" stroke-width="1.5" stroke-dasharray="3,2"/><circle cx="9" cy="8" r="2" fill="\${iconColor}"/><path d="M1 16l6-5 5 5 4-4 11 8" stroke="\${iconColor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>\`;
  let wrapper = '';
  if (s.stack) {
    wrapper = \`<div style="position:relative;width:100%;height:100%">
      <div style="position:absolute;inset:0;background:#fff;border:1px solid #ddd;transform:rotate(5deg);box-shadow:2px 2px 6px rgba(0,0,0,.1)"></div>
      <div style="position:absolute;inset:0;background:#fff;border:1px solid #ddd;transform:rotate(-4deg);box-shadow:2px 2px 6px rgba(0,0,0,.1)"></div>
      <div class="bi-pol" style="position:relative;background:#fff;border:1px solid #ddd;box-shadow:0 6px 20px rgba(0,0,0,.2)">
        <div style="width:100%;height:calc(100% - 32px);background:#f0f0f0;display:flex;align-items:center;justify-content:center">\${imgIcon}</div>
        <div class="pl" style="color:#888;font-style:italic">drag image here</div>
      </div></div>\`;
  } else {
    const tapeHtml = s.tape ? \`<div style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);width:44%;height:16px;background:#8FAF7A;opacity:.65;border-radius:2px;z-index:3"></div>\` : '';
    wrapper = \`<div style="position:relative">\${tapeHtml}<div class="bi-pol" style="background:\${s.bg};border:\${s.border};box-shadow:\${s.shadow}">
      <div style="width:100%;height:calc(100% - 32px);background:\${s.imgBg};display:flex;align-items:center;justify-content:center">\${imgIcon}</div>
      <div class="pl" style="color:\${s.captionColor};font-style:italic">drag image here</div>
    </div></div>\`;
  }
  el.innerHTML = wrapper;
  mount(el,id,x,y,170,200);
  refHint(); refCount();
}
function addShape(type){
  const def=SHAPES[type];if(!def)return;
  const id=mkId(),el=document.createElement('div');
  const f='#EBF2E5',s='#8FAF7A',w=3;
  el.innerHTML=mkSVG(type,f,s,w);
  const bc=document.getElementById('board-canvas'),r=bc.getBoundingClientRect();
  const flat=['line','arrow-r','arrow-l','dbl-arrow','banner1','oval','rect','roundrect','parallelogram'].includes(type);
  mount(el,id,r.width/2,r.height/2,130,flat?50:130);
  refHint();refCount();
}
function addText(){const bc=document.getElementById('board-canvas'),r=bc.getBoundingClientRect();spawnEl('heading',r.width/2,r.height/2);refHint();refCount();}
function addSticky(c='#F7F3EE'){
  const id=mkId(),bc=document.getElementById('board-canvas'),r=bc.getBoundingClientRect(),el=document.createElement('div');
  const d=document.createElement('div');d.className='bi-sticky';d.contentEditable='true';d.spellcheck=false;d.textContent='Type here...';
  d.style.background=c;d.style.color=(c==='#3F5A45'||c==='#2A3828')?'#fff':'#2A3828';
  d.addEventListener('mousedown',e=>e.stopPropagation());
  el.appendChild(d);mount(el,id,r.width/2,r.height/2,165,115);setTimeout(()=>d.focus(),50);refHint();refCount();
}

// ─── UPLOAD ───
function triggerUpload(){
  // ensure shop panel is open so user sees the upload grid
  openPanel('shop', document.getElementById('rb-shop'));
  // scroll to upload zone
  setTimeout(()=>{
    const uz = document.getElementById('up-zone');
    if(uz) uz.scrollIntoView({behavior:'smooth', block:'center'});
  }, 300);
  document.getElementById('file-inp').click();
}
function handleDropUpload(e){
  e.preventDefault();e.stopPropagation();
  const uz=document.getElementById('up-zone');
  if(uz){uz.style.borderColor='';uz.style.background='';}
  Array.from(e.dataTransfer.files).filter(f=>f.type.startsWith('image/')).forEach(readF);
}
function handleFiles(e){
  const files=Array.from(e.target.files);
  if(!files.length)return;
  files.forEach(readF);
  e.target.value=''; // reset so same file can be re-selected
}
function readF(file){
  const r=new FileReader();
  r.onload=ev=>addUpCard(ev.target.result, file.name.replace(/\\.[^.]+$/,''));
  r.readAsDataURL(file);
}
function addUpCard(url, name){
  // Switch to shop panel so user sees uploaded image
  openPanel('shop', document.getElementById('rb-shop'));
  const g=document.getElementById('upload-grid');
  if(!g){ console.warn('upload-grid not found'); return; }
  const d=document.createElement('div');
  d.className='prod-card';
  d.draggable=true;
  d.innerHTML=\`
    <img src="\${url}" style="width:100%;aspect-ratio:1;object-fit:cover;display:block;pointer-events:none">
    <div class="pc-name" style="padding:5px 7px;font-size:9px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${name}</div>\`;
  // drag to board
  d.addEventListener('dragstart', (e)=>{
    DRAG = {type:'upload', url, name};
    e.dataTransfer.effectAllowed='copy';
  });
  d.addEventListener('dragend', hideDOL);
  // single click to place on canvas center
  d.addEventListener('click', ()=>{
    const bc=document.getElementById('board-canvas');
    const r=bc.getBoundingClientRect();
    spawnUpload(url, name, r.width/2, r.height/2);
    refHint(); refCount();
    toast('Image placed on board — drag to reposition');
  });
  g.appendChild(d);
  // scroll to show it
  setTimeout(()=>d.scrollIntoView({behavior:'smooth',block:'nearest'}), 100);
  toast('✓ Photo uploaded — click to place or drag to board');
}
function spawnUpload(url, name, x, y){
  const id=mkId(), el=document.createElement('div');
  el.innerHTML=\`<div class="bi-img"><img src="\${url}" alt="\${name}" style="width:100%;height:100%;object-fit:cover;display:block"></div>\`;
  mount(el, id, x, y, 200, 200);
}

// ─── MOUSE ───
function onItemMD(e,id){
  if(tool==='draw')return;if(e.target.classList.contains('rh'))return;if(e.target.classList.contains('rot-handle'))return;if(e.target.closest('.tbar'))return;if(e.target.getAttribute('contenteditable')==='true')return;if(items[id]?.locked)return;
  e.stopPropagation();e.preventDefault();selectItem(id);
  const el=document.getElementById(id),w=document.getElementById('canvas-wrap'),wr=w.getBoundingClientRect();
  el.classList.add('dragging');
  mvS={id,ox:e.clientX-wr.left-parseInt(el.style.left),oy:e.clientY-wr.top-parseInt(el.style.top)};
}
document.addEventListener('mousemove',e=>{
  if(mvS){const w=document.getElementById('canvas-wrap'),wr=w.getBoundingClientRect(),el=document.getElementById(mvS.id);if(!el)return;el.style.left=(e.clientX-wr.left-mvS.ox)+'px';el.style.top=(e.clientY-wr.top-mvS.oy)+'px';}
  if(rzS){const{id,pos,ox,oy,ow,oh,ol,ot}=rzS,el=document.getElementById(id);if(!el)return;const dx=e.clientX-ox,dy=e.clientY-oy;let nw=ow,nh=oh,nl=ol,nt=ot;if(pos.includes('e'))nw=Math.max(30,ow+dx);if(pos.includes('w')){nw=Math.max(30,ow-dx);nl=ol+ow-nw;}if(pos.includes('s'))nh=Math.max(24,oh+dy);if(pos.includes('n')){nh=Math.max(24,oh-dy);nt=ot+oh-nh;}el.style.width=nw+'px';el.style.height=nh+'px';el.style.left=nl+'px';el.style.top=nt+'px';}
  if(rtS){const{id,cx,cy}=rtS,el=document.getElementById(id);if(!el)return;items[id].rot=Math.atan2(e.clientY-cy,e.clientX-cx)*180/Math.PI+90;apTr(el,id);}
});
document.addEventListener('mouseup',()=>{
  mvS=rzS=rtS=null;
  document.querySelectorAll('.bitem.dragging').forEach(e=>e.classList.remove('dragging'));
});
function startRz(e,id,pos){const el=document.getElementById(id);rzS={id,pos,ox:e.clientX,oy:e.clientY,ow:el.offsetWidth,oh:el.offsetHeight,ol:parseInt(el.style.left),ot:parseInt(el.style.top)};}
function startRot(e,id){const el=document.getElementById(id),r=el.getBoundingClientRect();rtS={id,cx:r.left+r.width/2,cy:r.top+r.height/2};}
function apTr(el,id){const{rot=0,sx=1,sy=1}=items[id];el.style.transform=\`rotate(\${rot}deg) scaleX(\${sx}) scaleY(\${sy})\`;}

// ─── ACTIONS ───
function selectItem(id){
  deselectAll();SEL=id;
  const el=document.getElementById(id);
  if(el){el.classList.add('sel');el.style.zIndex=++zC;}
  showPropBar(id);
  setMsg('Selected — drag to move · teal dot = rotate · corners = resize');
}
function deselectAll(){
  SEL=null;
  document.querySelectorAll('.bitem').forEach(e=>e.classList.remove('sel'));
  hidePropBar();
  closeEditPanel();
}

// ── CONTEXTUAL PROPERTY BAR ──
function showPropBar(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const pb = document.getElementById('prop-bar');
  const bn = document.getElementById('board-name-zone');
  pb.classList.add('vis');
  bn.style.opacity = '0'; bn.style.pointerEvents = 'none';

  const hasImg = el.querySelector('.bi-img,.bi-pol');
  const hasText = el.querySelector('[contenteditable]');
  const hasSvg = el.querySelector('svg[data-type]');
  const hasSticky = el.querySelector('.bi-sticky');

  // show/hide font group
  const fg = document.getElementById('pb-font-group');
  const ig = document.getElementById('pb-img-group');
  fg.style.display = (hasText||hasSticky) ? 'flex' : 'none';
  ig.style.display = hasImg ? 'flex' : 'none';

  // sync fill swatch
  let fillColor = '#EBF2E5';
  if (hasSvg) fillColor = hasSvg.dataset.f || '#EBF2E5';
  else if (hasSticky) fillColor = hasSticky.style.background || '#F7F3EE';
  else if (el.querySelector('.bi-blob')) fillColor = el.querySelector('.bi-blob').style.background || '#8FAF7A';
  else if (hasText) fillColor = hasText.style.color || '#3F5A45';
  const fillSwatch = document.getElementById('pb-fill-swatch');
  const fillInp = document.getElementById('pb-fill');
  if(fillSwatch) fillSwatch.style.background = fillColor;
  try{ if(fillInp) fillInp.value = rgbToHex(fillColor); }catch(e){}

  // sync stroke swatch
  let strokeColor = '#8FAF7A';
  if (hasSvg) strokeColor = hasSvg.dataset.s || '#8FAF7A';
  const strokeSwatch = document.getElementById('pb-stroke-swatch');
  const strokeInp = document.getElementById('pb-stroke-c');
  if(strokeSwatch) strokeSwatch.style.borderColor = strokeColor;
  try{ if(strokeInp) strokeInp.value = rgbToHex(strokeColor); }catch(e){}

  // sync opacity
  const opacInp = document.getElementById('pb-opac');
  if(opacInp) opacInp.value = Math.round((parseFloat(el.style.opacity)||1)*100);

  // sync font size if text
  if (hasText) {
    try {
      const sz = parseInt(window.getComputedStyle(hasText).fontSize)||24;
      const szInp = document.getElementById('pb-font-sz');
      if(szInp) szInp.value = sz;
    } catch(e){}
  }
}
function hidePropBar() {
  document.getElementById('prop-bar').classList.remove('vis');
  const bn = document.getElementById('board-name-zone');
  bn.style.opacity = ''; bn.style.pointerEvents = '';
}

// prop bar handlers
function pbFill(c) {
  document.getElementById('pb-fill-swatch').style.background = c;
  // update cpick preview
  const cp = document.getElementById('cpick-fill-preview'); if(cp) cp.style.background = c;
  if (!SEL) {
    // change canvas bg if nothing selected
    document.getElementById('board-canvas').style.background = c;
    return;
  }
  applyFill(c);
}
function pbStroke(c) {
  document.getElementById('pb-stroke-swatch').style.borderColor = c;
  const cp = document.getElementById('cpick-stroke-preview'); if(cp) cp.style.borderColor = c;
  if (!SEL) return;
  applyStroke(c);
}
function pbStrokeW(v) { if (SEL) applyStrokeW(v); }
function pbOpacity(v) { if (SEL) applyOpacity(v); }
function pbFontFamily(v) {
  if (!SEL) return;
  const el = document.getElementById(SEL);
  if (!el) return;
  el.querySelectorAll('[contenteditable]').forEach(t => t.style.fontFamily = v);
}
function pbFontSize(v) {
  if (!SEL) return;
  const el = document.getElementById(SEL);
  if (!el) return;
  el.querySelectorAll('[contenteditable]').forEach(t => t.style.fontSize = v + 'px');
}
function pbBold() {
  if (!SEL) return;
  const el = document.getElementById(SEL);
  if (!el) return;
  const btn = document.getElementById('pb-bold');
  const on = btn.classList.toggle('on');
  el.querySelectorAll('[contenteditable]').forEach(t => t.style.fontWeight = on ? '800' : '');
}
function pbItalic() {
  if (!SEL) return;
  const el = document.getElementById(SEL);
  if (!el) return;
  const btn = document.getElementById('pb-italic');
  const on = btn.classList.toggle('on');
  el.querySelectorAll('[contenteditable]').forEach(t => t.style.fontStyle = on ? 'italic' : '');
}

// ── CONTEXT MENU ──
let _ctxId = null;
function showCtxMenu(e, id) {
  hideCtxMenu();
  _ctxId = id;
  selectItem(id);
  const m = document.createElement('div');
  m.className = 'ctx-menu'; m.id = 'ctx-menu';
  const items = [
    {icon:'⎘', label:'Copy',       kb:'⌘C',  act:'copy'},
    {icon:'⎒', label:'Copy style', kb:'⌥⌘C', act:'copystyle'},
    {icon:'⎗', label:'Paste',      kb:'⌘V',  act:'paste'},
    {icon:'⧉', label:'Duplicate',  kb:'⌘D',  act:'dup'},
    null,
    {icon:'↑', label:'Bring to front', kb:'',act:'fwd'},
    {icon:'↓', label:'Send to back',   kb:'',act:'bwd'},
    null,
    {icon:'🔒',label:'Lock',       kb:'',    act:'lk'},
    null,
    {icon:'✕', label:'Delete',     kb:'⌫',   act:'del', danger:true},
  ];
  items.forEach(it => {
    if (!it) { const s=document.createElement('div');s.className='ctx-sep';m.appendChild(s); return; }
    const d=document.createElement('div');d.className='ctx-item'+(it.danger?' danger':'');
    d.innerHTML=\`<span class="ctx-icon">\${it.icon}</span><span>\${it.label}</span>\${it.kb?\`<span class="ctx-kb">\${it.kb}</span>\`:''}\`;
    d.addEventListener('click',()=>{ hideCtxMenu(); execCtx(it.act); });
    m.appendChild(d);
  });
  m.style.left = Math.min(e.clientX, window.innerWidth-200)+'px';
  m.style.top  = Math.min(e.clientY, window.innerHeight-300)+'px';
  document.body.appendChild(m);
  setTimeout(()=>document.addEventListener('click',hideCtxMenu,{once:true}),50);
}
function hideCtxMenu(){const m=document.getElementById('ctx-menu');if(m)m.remove();}
function execCtx(act){
  const id=_ctxId;if(!id)return;
  if(act==='copy'){_clipboard=id; toast('Copied');}
  if(act==='paste'&&_clipboard)dupeI(_clipboard);
  if(act==='copystyle'){_styleClip=id; toast('Style copied');}
  if(act==='dup')dupeI(id);
  if(act==='del')removeI(id);
  if(act==='fwd'){const el=document.getElementById(id);if(el)el.style.zIndex=++zC;}
  if(act==='bwd'){const el=document.getElementById(id);if(el)el.style.zIndex=Math.max(1,parseInt(el.style.zIndex||10)-2);}
  if(act==='lk')lockI(id);
}
let _clipboard=null, _styleClip=null;

// ── EDIT IMAGE PANEL ──
let _editTarget=null;
function openEditPanel(){
  if(!SEL)return;
  _editTarget=SEL;
  buildEpFilters();
  buildEpEffects();
  document.getElementById('edit-panel').classList.add('open');
}
function closeEditPanel(){document.getElementById('edit-panel').classList.remove('open');}

const EP_FILTERS=[
  {label:'None',    filter:'none',                          emoji:'🖼'},
  {label:'Fresco',  filter:'sepia(30%) saturate(1.3) brightness(1.05)', emoji:'🎨'},
  {label:'Belvedere',filter:'contrast(1.15) brightness(.96) saturate(.85)',emoji:'🏛'},
  {label:'Fade',    filter:'brightness(1.1) saturate(.7)',  emoji:'🌫'},
  {label:'B&W',     filter:'grayscale(100%)',               emoji:'⬛'},
  {label:'Sepia',   filter:'sepia(70%)',                    emoji:'🟫'},
  {label:'Vivid',   filter:'brightness(1.2) saturate(1.6)', emoji:'✨'},
  {label:'Matte',   filter:'contrast(1.2) brightness(.9)',  emoji:'🫧'},
  {label:'Warm',    filter:'sepia(25%) saturate(1.2) hue-rotate(-5deg)',emoji:'🌅'},
];
const EP_EFFECTS=[
  {label:'None',    fn:()=>'',           emoji:'○'},
  {label:'Shadow',  fn:()=>'drop-shadow(4px 6px 12px rgba(0,0,0,.35))', emoji:'🌑'},
  {label:'Glow',    fn:()=>'drop-shadow(0 0 12px rgba(143,175,122,.8))', emoji:'💚'},
  {label:'Blur',    fn:()=>'blur(3px)',  emoji:'💭'},
  {label:'Duotone', fn:()=>'sepia(1) hue-rotate(60deg) saturate(2)', emoji:'🎭'},
  {label:'Vignette',fn:()=>'brightness(.85) contrast(1.1)', emoji:'🔲'},
];

function buildEpFilters(){
  const g=document.getElementById('ep-filters');g.innerHTML='';
  EP_FILTERS.forEach(f=>{
    const t=document.createElement('div');t.className='ep-tile';
    t.innerHTML=\`<div class="ep-tile-preview" style="font-size:26px">\${f.emoji}</div><div class="ep-tile-label">\${f.label}</div>\`;
    t.addEventListener('click',()=>{
      g.querySelectorAll('.ep-tile').forEach(x=>x.classList.remove('on'));t.classList.add('on');
      applyFilter(f.filter);updateAdjust();
    });
    g.appendChild(t);
  });
}
function buildEpEffects(){
  const g=document.getElementById('ep-effects');g.innerHTML='';
  EP_EFFECTS.forEach(f=>{
    const t=document.createElement('div');t.className='ep-tile';
    t.innerHTML=\`<div class="ep-tile-preview" style="font-size:26px">\${f.emoji}</div><div class="ep-tile-label">\${f.label}</div>\`;
    t.addEventListener('click',()=>{
      g.querySelectorAll('.ep-tile').forEach(x=>x.classList.remove('on'));t.classList.add('on');
      const el=document.getElementById(_editTarget||SEL);if(!el)return;
      const eff=f.fn();const base=el.dataset.baseFilter||'none';
      el.style.filter=base+(eff?' '+eff:'');
    });
    g.appendChild(t);
  });
}

function applyAdjust(){
  const el=document.getElementById(_editTarget||SEL);if(!el)return;
  const br=parseInt(document.getElementById('adj-bright').value)||0;
  const co=parseInt(document.getElementById('adj-con').value)||0;
  const sa=parseInt(document.getElementById('adj-sat').value)||0;
  const wa=parseInt(document.getElementById('adj-warm').value)||0;
  const bl=parseInt(document.getElementById('adj-blur').value)||0;
  document.getElementById('adj-bright-v').textContent=br;
  document.getElementById('adj-con-v').textContent=co;
  document.getElementById('adj-sat-v').textContent=sa;
  document.getElementById('adj-warm-v').textContent=wa;
  document.getElementById('adj-blur-v').textContent=bl;
  const brf=1+(br/100), cof=1+(co/100), saf=1+(sa/100);
  const hue=wa*0.6;
  let f=\`brightness(\${brf}) contrast(\${cof}) saturate(\${saf})\`;
  if(hue!==0)f+=\` hue-rotate(\${hue}deg)\`;
  if(bl>0)f+=\` blur(\${bl*0.3}px)\`;
  el.dataset.baseFilter=f;
  el.style.filter=f;
}
function updateAdjust(){
  // reset sliders when filter button clicked
  ['adj-bright','adj-con','adj-sat','adj-warm','adj-blur'].forEach(id=>{
    document.getElementById(id).value=0;
  });
  ['adj-bright-v','adj-con-v','adj-sat-v','adj-warm-v','adj-blur-v'].forEach(id=>{
    document.getElementById(id).textContent='0';
  });
}

// ── UTILITY ──
function rgbToHex(c) {
  if(!c)return'#EBF2E5';
  if(c.startsWith('#'))return c.length===7?c:c;
  // rgb(r,g,b) → #rrggbb
  const m=c.match(/\\d+/g);
  if(!m||m.length<3)return'#EBF2E5';
  return '#'+m.slice(0,3).map(n=>parseInt(n).toString(16).padStart(2,'0')).join('');
}
function removeI(id){const el=document.getElementById(id);if(!el)return;el.style.transition='opacity .18s,transform .18s';el.style.opacity='0';el.style.transform=(el.style.transform||'')+' scale(.85)';setTimeout(()=>{el.remove();delete items[id];if(SEL===id)SEL=null;refCount();refHint();},200);}
function rotI(id,d){if(!items[id])return;items[id].rot=(items[id].rot||0)+d;apTr(document.getElementById(id),id);}
function dupeI(id){
  const el=document.getElementById(id);if(!el)return;
  const cl=el.cloneNode(true);const nid=mkId();cl.id=nid;
  cl.style.left=(parseInt(el.style.left)+22)+'px';cl.style.top=(parseInt(el.style.top)+22)+'px';
  cl.style.zIndex=++zC;items[nid]={...items[id]};
  cl.querySelectorAll('.tbar,.rot-handle,.rh,.move-handle').forEach(h=>h.remove());
  attachH(cl,nid);document.getElementById('board-canvas').appendChild(cl);
  cl.addEventListener('mousedown',ev=>onItemMD(ev,nid));selectItem(nid);refCount();
}
function lockI(id){if(!items[id])return;items[id].locked=!items[id].locked;const el=document.getElementById(id);if(el)el.style.cursor=items[id].locked?'not-allowed':'move';toast(items[id].locked?'Item locked':'Item unlocked');}
function dupeSelected(){if(SEL)dupeI(SEL);}
function delSelected(){if(SEL)removeI(SEL);else toast('Select an item first');}
function bringFront(){if(SEL){const el=document.getElementById(SEL);if(el)el.style.zIndex=++zC;}}
function sendBack(){if(SEL){const el=document.getElementById(SEL);if(el)el.style.zIndex=Math.max(1,parseInt(el.style.zIndex||10)-2);}}
function flipH(){if(!SEL||!items[SEL])return;items[SEL].sx=(items[SEL].sx||1)*-1;apTr(document.getElementById(SEL),SEL);}
function flipV(){if(!SEL||!items[SEL])return;items[SEL].sy=(items[SEL].sy||1)*-1;apTr(document.getElementById(SEL),SEL);}
function applyFill(c){
  if(c&&c!=='transparent'){ _docColors.add(c); }
  if(!SEL){ toast('Select an item first'); return; }
  const el=document.getElementById(SEL); if(!el) return;
  // SVG shapes
  const svg=el.querySelector('svg[data-type]');
  if(svg){
    const t=svg.dataset.type;
    el.innerHTML=mkSVG(t,c,svg.dataset.s||'#8FAF7A',svg.dataset.w||3);
    attachH(el,SEL);
    return;
  }
  // colour blob
  const blob=el.querySelector('.bi-blob'); if(blob){ blob.style.background=c; return; }
  // sticky notes
  const sticky=el.querySelector('.bi-sticky'); if(sticky){ sticky.style.background=c; return; }
  // text / editable elements — change text color
  const editable=el.querySelector('[contenteditable]');
  if(editable){ editable.style.color=c; return; }
  // image items — change border color as tint
  const img=el.querySelector('.bi-img,.bi-pol');
  if(img){ img.style.borderColor=c; return; }
  // fallback: background of the wrapper
  el.style.background=c;
}
function applyStroke(c){
  if(!SEL) return;
  const el=document.getElementById(SEL); if(!el) return;
  const svg=el.querySelector('svg[data-type]');
  if(svg){
    const t=svg.dataset.type;
    el.innerHTML=mkSVG(t,svg.dataset.f||'#EBF2E5',c,svg.dataset.w||3);
    attachH(el,SEL); return;
  }
  // bubble border color
  const bubble=el.querySelector('.bi-bubble'); if(bubble){ bubble.style.borderColor=c; bubble.style.color=c; return; }
  // text / editable: border or outline
  const editable=el.querySelector('[contenteditable]');
  if(editable){ el.style.outline='2px solid '+c; return; }
  // images: border
  const img=el.querySelector('.bi-img,.bi-pol');
  if(img){ img.style.border='3px solid '+c; return; }
}
function applyStrokeW(v){
  if(!SEL)return;const el=document.getElementById(SEL);const svg=el&&el.querySelector('svg[data-type]');
  if(!svg)return;const t=svg.dataset.type;el.innerHTML=mkSVG(t,svg.dataset.f||'#EBF2E5',svg.dataset.s||'#8FAF7A',v);attachH(el,SEL);
}
function applyOpacity(v){if(!SEL)return;const el=document.getElementById(SEL);if(el)el.style.opacity=v/100;}
function applyFilter(f){if(!SEL){toast('Select an item first');return;}const el=document.getElementById(SEL);if(el)el.style.filter=f;}
function applyBorder(b){
  if(!SEL){toast('Select an item first');return;}
  const el=document.getElementById(SEL);if(!el)return;
  const inn=el.querySelector('.bi-img,.bi-pol,.bi-sticky');
  if(inn)inn.style.border=b;else el.style.outline=b;
}

// ─── EXPORT ───
function exportPNG(){
  deselectAll();toast('Generating export…');
  const cv=document.getElementById('board-canvas');
  document.querySelectorAll('.tbar,.rot-handle,.rh').forEach(h=>h.style.opacity='0');
  setTimeout(()=>{
    html2canvas(cv,{backgroundColor:null,useCORS:true,scale:2,logging:false,allowTaint:true})
    .then(c=>{
      document.querySelectorAll('.tbar,.rot-handle,.rh').forEach(h=>h.style.opacity='');
      const a=document.createElement('a');a.href=c.toDataURL('image/png');
      a.download=(document.getElementById('board-title').value||'kk-moodboard')+'.png';a.click();
      toast('Exported successfully');
    }).catch(()=>{
      document.querySelectorAll('.tbar,.rot-handle,.rh').forEach(h=>h.style.opacity='');
      toast('Try Cmd+Shift+4 screenshot if blocked');
    });
  },120);
}
function saveBoard(){toast('Board saved');}
function clearBoard(){if(!confirm('Clear the board?'))return;document.getElementById('board-canvas').innerHTML='';items={};uid=0;SEL=null;refHint();refCount();toast('Board cleared');}
function refHint(){document.getElementById('hint-wrap').classList.toggle('gone',document.getElementById('board-canvas').children.length>0);}
function refCount(){const n=document.getElementById('board-canvas').children.length;document.getElementById('st-count').textContent=n+(n===1?' item':' items');}
function setMsg(m){document.getElementById('st-msg').textContent=m;}
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2600);}

// ── KEYBOARD SHORTCUTS ──
document.addEventListener('keydown',e=>{
  const a=document.activeElement;
  if(a&&(a.getAttribute('contenteditable')==='true'||a.tagName==='INPUT'||a.tagName==='SELECT'))return;
  const meta=e.ctrlKey||e.metaKey;

  // Delete / Backspace
  if((e.key==='Delete'||e.key==='Backspace')&&SEL){removeI(SEL);return;}
  // Ctrl+D — duplicate
  if(e.key==='d'&&meta&&SEL){e.preventDefault();dupeI(SEL);return;}
  // Ctrl+C — copy
  if(e.key==='c'&&meta&&SEL){_clipboard=SEL;toast('Copied');return;}
  // Ctrl+V — paste
  if(e.key==='v'&&meta&&_clipboard){e.preventDefault();dupeI(_clipboard);return;}
  // Ctrl+Z — undo draw
  if(e.key==='z'&&meta){e.preventDefault();undoDraw();return;}
  // Ctrl+A — select all (deselect + reselect last)
  if(e.key==='a'&&meta){e.preventDefault();return;}
  // [ ] — rotate 5°
  if(e.key==='['&&SEL)rotI(SEL,-5);
  if(e.key===']'&&SEL)rotI(SEL,5);
  // Escape
  if(e.key==='Escape'){
    closeEditPanel();hideCtxMenu();
    if(tool==='draw')setTool('select');
    else deselectAll();
    return;
  }
  // Arrow keys — nudge (1px, Shift = 10px)
  if(SEL&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){
    e.preventDefault();
    const el=document.getElementById(SEL);if(!el)return;
    const s=e.shiftKey?10:1;
    if(e.key==='ArrowLeft') el.style.left=(parseInt(el.style.left)-s)+'px';
    if(e.key==='ArrowRight')el.style.left=(parseInt(el.style.left)+s)+'px';
    if(e.key==='ArrowUp')   el.style.top=(parseInt(el.style.top)-s)+'px';
    if(e.key==='ArrowDown') el.style.top=(parseInt(el.style.top)+s)+'px';
  }
});

// right-click on canvas background
document.getElementById('board-canvas').addEventListener('contextmenu',e=>{
  if(e.target.id==='board-canvas')e.preventDefault();
});
// double-click to add text
document.getElementById('board-canvas').addEventListener('dblclick',e=>{
  if(e.target.id!=='board-canvas')return;spawnEl('heading',e.offsetX,e.offsetY);refHint();refCount();
});
// resize draw canvas
window.addEventListener('resize',()=>{
  const cvs=document.getElementById('draw-canvas'),w=document.getElementById('canvas-wrap');
  const img=dctx?dctx.getImageData(0,0,cvs.width,cvs.height):null;
  cvs.width=w.offsetWidth;cvs.height=w.offsetHeight;if(img)dctx.putImageData(img,0,0);
});

init();
</script>`

export default function MoodboardPage() {
  const styleRef = useRef<HTMLStyleElement | null>(null)

  useEffect(() => {
    // ── Inject moodboard CSS into <head> ──────────────────────
    if (!styleRef.current) {
      const el = document.createElement('style')
      el.setAttribute('data-kk-moodboard', '1')
      el.textContent = CSS
      document.head.appendChild(el)
      styleRef.current = el
    }

    // ── Boot moodboard JS after html2canvas is available ──────
    function bootEngine() {
      // Remove any previous instance
      document.querySelectorAll('[data-kk-script]').forEach(s => s.remove())
      const script = document.createElement('script')
      script.setAttribute('data-kk-script', '1')
      script.textContent = JS
      document.body.appendChild(script)
    }

    let pollCount = 0
    const poll = setInterval(() => {
      pollCount++
      if (typeof (window as any).html2canvas !== 'undefined' || pollCount > 30) {
        clearInterval(poll)
        bootEngine()
      }
    }, 100)

    // ── Restore saved state from localStorage ─────────────────
    const saved = loadMoodboard()
    if (saved) {
      setTimeout(() => {
        try {
          const titleEl = document.getElementById('board-title') as HTMLInputElement | null
          if (titleEl && saved.title) titleEl.value = saved.title
          const canvas = document.getElementById('board-canvas') as HTMLElement | null
          if (canvas && saved.background) canvas.style.background = saved.background
        } catch {}
      }, 800)
    }

    // ── Auto-save every 30 seconds ────────────────────────────
    const stop = startAutoSave((): MoodboardState => {
      const titleEl = document.getElementById('board-title') as HTMLInputElement | null
      const canvas  = document.getElementById('board-canvas') as HTMLElement | null
      return {
        id: 'default',
        title: titleEl?.value ?? 'My Moodboard',
        background: canvas?.style.background ?? '#F7F3EE',
        items: [],
        updatedAt: new Date().toISOString(),
      }
    })

    return () => {
      clearInterval(poll)
      stop()
      styleRef.current?.remove()
      styleRef.current = null
      document.querySelectorAll('[data-kk-script]').forEach(s => s.remove())
    }
  }, [])

  return (
    <div
      id="kk-moodboard-root"
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'fixed',
        inset: 0,
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
      dangerouslySetInnerHTML={{ __html: BODY }}
    />
  )
}
