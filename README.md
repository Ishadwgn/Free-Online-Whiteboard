# ✏️ Free Online Whiteboard

> A fast, zero-friction, 100% free online collaborative whiteboard with instant access, zero sign-up requirements, and real-time multi-user synchronization.

🌐 **Live Website:** [https://free-online-whiteboard.netlify.app/](https://free-online-whiteboard.netlify.app/)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Netlify](https://img.shields.io/badge/hosted%20on-Netlify-00C7B7.svg)
![Status](https://img.shields.io/badge/status-live-brightgreen.svg)

---

## ✨ Key Features

- **⚡ Zero-Friction & No Sign-Up:** Open and draw within 200ms. No email, passwords, or credit cards required.
- **✏️ Realistic Dynamic Cursors:**
  - Sharp **Pencil cursor** with precision tip hotspot when sketching.
  - **Highlighter cursor** when using the semi-transparent marker.
  - **Eraser cursor** when removing strokes.
- **🔷 12+ Geometric & Diagram Shapes:**
  - ⬜ Rectangle
  - ▢ Rounded Rectangle
  - ⭕ Circle / Ellipse
  - 🔺 Triangle
  - 💎 Diamond (Flowchart Decision)
  - ⭐️ 5-Pointed Star
  - ⬡ Hexagon
  - ➖ Straight Line
  - ➡️ Directional Arrow
  - ↔️ Bidirectional 2-Way Arrow
  - 💬 Speech Callout Bubble
  - 🛢️ Database Cylinder
- **📏 Dynamic Stroke Thickness Stepper:** Continuous `−` / `+` stepper control from ultra-fine 1px to heavy 40px lines.
- **📝 Deletable & Colorable Sticky Notes:**
  - Movable digital cards with 4 pastel color toggles (Yellow, Pink, Blue, Green).
  - 1-click `×` delete button directly on each card.
  - Drag-and-drop with separate editable text body.
- **📐 1-Click Canvas Backgrounds:**
  - Blank White
  - Dot Grid (Bullet journaling)
  - Cartesian Math Coordinate Grid (XY axes)
  - Dark Mode (OLED pitch-black `#18181b` with neon ink)
- **📋 Pre-Built Templates:**
  - Blank Canvas
  - Cartesian Math Coordinate Plane
  - Agile Sprint Retrospective
  - Kanban Board
  - Central Mind Map
  - Cornell Student Note-Taking System
- **👥 Real-Time Multi-User Collaboration:** Instant shareable room URLs (`?room=XYZ`) with live colored cursor badges and synchronized in-memory strokes via WebSockets.
- **💾 High-Res Export:** 2X High-DPI PNG export with clean background, vector SVG export, and JSON project backup.
- **🔍 Full Technical SEO & AI Readiness:** Includes `robots.txt`, `llms.txt`, `sitemap.xml`, `favicon.svg`, `favicon.ico`, `manifest.json`, Open Graph, Twitter Cards, and Schema.org structured data.

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Ishadwgn/Free-Online-Whiteboard.git
cd Free-Online-Whiteboard
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm start
```
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🌐 Live Production Deployment

### Main Production URL:
👉 **[https://free-online-whiteboard.netlify.app/](https://free-online-whiteboard.netlify.app/)**

### Netlify Deployment
This site is pre-configured for zero-config Netlify hosting with `netlify.toml` and `_redirects`.
Pushing to `main` automatically triggers deployment to:
**https://free-online-whiteboard.netlify.app/**

### Backup: GitHub Pages / Vercel / Render
- **GitHub Pages:** Pre-configured via `.github/workflows/deploy.yml`
- **Render / Railway / Vercel:** Node 18+ with `npm start`

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `P` | Pen Tool |
| `H` | Highlighter Marker |
| `E` | Eraser Tool |
| `R` | Rectangle Shape |
| `C` | Circle Shape |
| `A` | Arrow Tool |
| `T` | Text Tool |
| `N` | Sticky Note |
| `+` / `=` | Increase Thickness (Jayda) |
| `-` / `_` | Decrease Thickness (Kam) |
| `Ctrl + Z` | Undo |
| `Ctrl + Y` | Redo |
| `Space + Drag` | Pan Canvas |

---

## 📄 License
MIT License. Free to use, modify, and distribute.
