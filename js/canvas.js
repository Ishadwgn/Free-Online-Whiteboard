// High-Precision Minimalist Whiteboard Engine with Selection, Move, and Resize
class MinimalCanvasEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.container = this.canvas.parentElement;
    this.noteContainer = document.getElementById('noteContainer');
    this.selToolbar = document.getElementById('selectionToolbar');

    // Drawing & Tool state
    this.tool = 'pen'; // select, pen, marker, eraser, text, note, or shape names
    this.activeShape = 'rect';
    this.color = '#18181b';
    this.width = 4;
    this.bgStyle = 'blank'; // blank, dots, grid, dark

    // High DPI & Viewport Pan/Zoom
    this.dpr = window.devicePixelRatio || 1;
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };

    // Canvas Stroke Stack
    this.isDrawing = false;
    this.strokes = [];
    this.redoStack = [];
    this.currentStroke = null;
    this.notes = [];

    // Selection, Move & Resize State
    this.selectedStroke = null;
    this.dragMode = null; // 'move', 'resize-tl', 'resize-tr', 'resize-br', 'resize-bl'
    this.dragStart = { x: 0, y: 0 };
    this.initialBounds = null;

    // Realistic SVG Cursors
    this.PENCIL_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cpath d='M3 25L6.5 17.5L20 4C21 3 23 3 24 4C25 5 25 7 24 8L10.5 21.5L3 25Z' fill='%23ffffff' stroke='%2318181b' stroke-width='2' stroke-linejoin='round'/%3E%3Cpath d='M3 25L6.5 21.5L6.5 17.5L3 25Z' fill='%2318181b'/%3E%3Cpath d='M17 7L21 11' stroke='%2318181b' stroke-width='2'/%3E%3C/svg%3E") 3 25, auto`;
    this.MARKER_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cpath d='M5 23L9 16L20 5C21 4 23 4 24 5C25 6 25 8 24 9L13 20L5 23Z' fill='%23fef08a' stroke='%23ca8a04' stroke-width='2' stroke-linejoin='round'/%3E%3Cpath d='M5 23L9 20.5L8.5 17L5 23Z' fill='%23ca8a04'/%3E%3C/svg%3E") 5 23, auto`;
    this.ERASER_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Crect x='4' y='4' width='20' height='20' rx='5' fill='%23ffffff' stroke='%23ef4444' stroke-width='2.2'/%3E%3Crect x='4' y='14' width='20' height='10' rx='3' fill='%23fecdd3'/%3E%3Cline x1='4' y1='14' x2='24' y2='14' stroke='%23ef4444' stroke-width='2'/%3E%3C/svg%3E") 14 14, auto`;

    // Real-Time WebSockets
    this.ws = null;
    this.userId = null;
    this.userColor = '#2563eb';

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.setupEvents();
    this.setupKeyboardShortcuts();
    this.setupSelectionToolbarEvents();
    this.updateCursor();
    this.updateWidthDisplay();
    this.connectWS();
    this.render();
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    this.widthPx = rect.width;
    this.heightPx = rect.height;

    this.canvas.width = rect.width * this.dpr;
    this.canvas.height = rect.height * this.dpr;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;

    this.ctx.scale(this.dpr, this.dpr);
    this.render();
  }

  updateCursor(custom = null) {
    if (custom) {
      this.canvas.style.cursor = custom;
      return;
    }

    if (this.tool === 'select') {
      this.canvas.style.cursor = 'default';
    } else if (this.tool === 'pen') {
      this.canvas.style.cursor = this.PENCIL_CURSOR;
    } else if (this.tool === 'marker') {
      this.canvas.style.cursor = this.MARKER_CURSOR;
    } else if (this.tool === 'eraser') {
      this.canvas.style.cursor = this.ERASER_CURSOR;
    } else if (this.tool === 'text') {
      this.canvas.style.cursor = 'text';
    } else if (this.tool === 'note') {
      this.canvas.style.cursor = 'copy';
    } else {
      this.canvas.style.cursor = 'crosshair';
    }
  }

  // Thickness Stepper Controls
  increaseWidth() {
    if (this.width < 40) {
      if (this.width < 6) this.width += 1;
      else if (this.width < 14) this.width += 2;
      else if (this.width < 24) this.width += 3;
      else this.width += 4;
    }
    this.updateWidthDisplay();
    if (this.selectedStroke) {
      this.selectedStroke.width = this.width;
      this.render();
      this.broadcastStroke(this.selectedStroke);
    }
    return this.width;
  }

  decreaseWidth() {
    if (this.width > 1) {
      if (this.width <= 6) this.width -= 1;
      else if (this.width <= 14) this.width -= 2;
      else if (this.width <= 24) this.width -= 3;
      else this.width -= 4;
    }
    this.updateWidthDisplay();
    if (this.selectedStroke) {
      this.selectedStroke.width = this.width;
      this.render();
      this.broadcastStroke(this.selectedStroke);
    }
    return this.width;
  }

  updateWidthDisplay() {
    const textEl = document.getElementById('sizeValText');
    if (textEl) {
      textEl.innerText = `${this.width}px`;
    }
  }

  getPointerPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left - this.panX) / this.scale,
      y: (clientY - rect.top - this.panY) / this.scale,
      screenX: clientX - rect.left,
      screenY: clientY - rect.top
    };
  }

  // Shape Bounding Box & Handles
  getStrokeBounds(s) {
    if (s.startX !== undefined && s.endX !== undefined) {
      const minX = Math.min(s.startX, s.endX);
      const maxX = Math.max(s.startX, s.endX);
      const minY = Math.min(s.startY, s.endY);
      const maxY = Math.max(s.startY, s.endY);
      return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
    }
    if (s.points && s.points.length > 0) {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const p of s.points) {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      }
      return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
    }
    return null;
  }

  normalizeShape(s) {
    if (!s || s.startX === undefined || s.endX === undefined) return;
    if (s.tool === 'line' || s.tool === 'arrow' || s.tool === 'doubleArrow') return;
    const minX = Math.min(s.startX, s.endX);
    const maxX = Math.max(s.startX, s.endX);
    const minY = Math.min(s.startY, s.endY);
    const maxY = Math.max(s.startY, s.endY);
    s.startX = minX;
    s.endX = maxX;
    s.startY = minY;
    s.endY = maxY;
  }

  getResizeHandles(s) {
    if (s.tool === 'line' || s.tool === 'arrow' || s.tool === 'doubleArrow') {
      return [
        { id: 'resize-start', x: s.startX, y: s.startY, cursor: 'crosshair' },
        { id: 'resize-end', x: s.endX, y: s.endY, cursor: 'crosshair' }
      ];
    }

    const b = this.getStrokeBounds(s);
    if (!b) return [];

    return [
      { id: 'resize-tl', x: b.minX, y: b.minY, cursor: 'nwse-resize' },
      { id: 'resize-tr', x: b.maxX, y: b.minY, cursor: 'nesw-resize' },
      { id: 'resize-br', x: b.maxX, y: b.maxY, cursor: 'nwse-resize' },
      { id: 'resize-bl', x: b.minX, y: b.maxY, cursor: 'nesw-resize' }
    ];
  }

  hitTest(pos) {
    const distToSegment = (p, v, w) => {
      const l2 = (w.x - v.x) ** 2 + (w.y - v.y) ** 2;
      if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
      let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
      t = Math.max(0, Math.min(1, t));
      return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
    };

    // 1. Check if clicking on resize handles of current selection
    if (this.selectedStroke) {
      const handles = this.getResizeHandles(this.selectedStroke);
      const threshold = 12 / this.scale;
      for (const h of handles) {
        if (Math.hypot(pos.x - h.x, pos.y - h.y) <= threshold) {
          return { target: this.selectedStroke, mode: h.id, cursor: h.cursor };
        }
      }

      // Check if clicking on current selected stroke
      const s = this.selectedStroke;
      if (s.tool === 'line' || s.tool === 'arrow' || s.tool === 'doubleArrow') {
        if (distToSegment(pos, { x: s.startX, y: s.startY }, { x: s.endX, y: s.endY }) <= 12 / this.scale) {
          return { target: s, mode: 'move', cursor: 'move' };
        }
      } else {
        const b = this.getStrokeBounds(s);
        if (b && pos.x >= b.minX - 6 && pos.x <= b.maxX + 6 && pos.y >= b.minY - 6 && pos.y <= b.maxY + 6) {
          return { target: s, mode: 'move', cursor: 'move' };
        }
      }
    }

    // 2. Check if clicking on any other stroke (topmost first)
    for (let i = this.strokes.length - 1; i >= 0; i--) {
      const s = this.strokes[i];
      if (s.tool === 'line' || s.tool === 'arrow' || s.tool === 'doubleArrow') {
        if (distToSegment(pos, { x: s.startX, y: s.startY }, { x: s.endX, y: s.endY }) <= 12 / this.scale) {
          return { target: s, mode: 'move', cursor: 'move' };
        }
      } else {
        const b = this.getStrokeBounds(s);
        if (b && pos.x >= b.minX - 6 && pos.x <= b.maxX + 6 && pos.y >= b.minY - 6 && pos.y <= b.maxY + 6) {
          return { target: s, mode: 'move', cursor: 'move' };
        }
      }
    }

    return null;
  }

  setupEvents() {
    const start = (e) => {
      if (e.button === 1 || (e.button === 0 && e.spaceKey)) {
        this.isPanning = true;
        this.panStart = { x: e.clientX - this.panX, y: e.clientY - this.panY };
        this.updateCursor('grabbing');
        return;
      }

      if (e.target !== this.canvas) return;
      const pt = this.getPointerPos(e);

      // SELECT / MOVE / RESIZE MODE
      if (this.tool === 'select') {
        const hit = this.hitTest(pt);
        if (hit) {
          this.selectedStroke = hit.target;
          this.dragMode = hit.mode;
          this.dragStart = { x: pt.x, y: pt.y };
          this.initialBounds = {
            startX: hit.target.startX,
            startY: hit.target.startY,
            endX: hit.target.endX,
            endY: hit.target.endY
          };
          this.updateCursor(hit.cursor);
          this.render();
          this.updateSelectionToolbar();
        } else {
          this.selectedStroke = null;
          this.dragMode = null;
          this.hideSelectionToolbar();
          this.render();
        }
        return;
      }

      // Deselect when starting to draw with another tool
      this.selectedStroke = null;
      this.hideSelectionToolbar();

      if (this.tool === 'text') {
        this.addTextPrompt(pt.x, pt.y);
        return;
      }

      if (this.tool === 'note') {
        this.createSticky(pt.x, pt.y, 'Type your note here...');
        this.setTool('pen');
        return;
      }

      this.isDrawing = true;
      let strokeColor = this.color;
      let strokeWidth = this.width;
      let opacity = 1;

      if (this.tool === 'marker') {
        opacity = 0.35;
        strokeWidth = this.width * 3.5;
      } else if (this.tool === 'eraser') {
        strokeColor = this.bgStyle === 'dark' ? '#18181b' : '#ffffff';
        strokeWidth = this.width * 4;
      }

      this.currentStroke = {
        id: 's_' + Math.random().toString(36).substr(2, 8),
        tool: this.tool,
        shape: this.isShape(this.tool) ? this.tool : null,
        color: strokeColor,
        width: strokeWidth,
        opacity: opacity,
        points: [pt],
        startX: pt.x,
        startY: pt.y,
        endX: pt.x,
        endY: pt.y
      };
    };

    const move = (e) => {
      const pt = this.getPointerPos(e);
      this.sendCursor(pt.x, pt.y);

      if (this.isPanning) {
        this.panX = e.clientX - this.panStart.x;
        this.panY = e.clientY - this.panStart.y;
        this.render();
        this.updateSelectionToolbar();
        return;
      }

      // SELECT / MOVE / RESIZE DRAG
      if (this.tool === 'select') {
        if (this.dragMode && this.selectedStroke) {
          const dx = pt.x - this.dragStart.x;
          const dy = pt.y - this.dragStart.y;
          const s = this.selectedStroke;

          if (this.dragMode === 'move') {
            s.startX += dx;
            s.startY += dy;
            s.endX += dx;
            s.endY += dy;
            if (s.points) {
              for (const p of s.points) {
                p.x += dx;
                p.y += dy;
              }
            }
            this.dragStart = { x: pt.x, y: pt.y };
          } else if (this.dragMode === 'resize-start') {
            s.startX = pt.x;
            s.startY = pt.y;
          } else if (this.dragMode === 'resize-end') {
            s.endX = pt.x;
            s.endY = pt.y;
          } else if (this.dragMode === 'resize-br') {
            s.endX = pt.x;
            s.endY = pt.y;
          } else if (this.dragMode === 'resize-tl') {
            s.startX = pt.x;
            s.startY = pt.y;
          } else if (this.dragMode === 'resize-tr') {
            s.endX = pt.x;
            s.startY = pt.y;
          } else if (this.dragMode === 'resize-bl') {
            s.startX = pt.x;
            s.endY = pt.y;
          }

          this.render();
          this.updateSelectionToolbar();
        } else {
          // Hover cursor inspection
          const hit = this.hitTest(pt);
          this.updateCursor(hit ? hit.cursor : 'default');
        }
        return;
      }

      if (!this.isDrawing || !this.currentStroke) return;

      this.currentStroke.endX = pt.x;
      this.currentStroke.endY = pt.y;

      if (['pen', 'marker', 'eraser'].includes(this.tool)) {
        this.currentStroke.points.push(pt);
      }

      this.render();
    };

    const end = () => {
      if (this.isPanning) {
        this.isPanning = false;
        this.updateCursor();
      }

      if (this.tool === 'select') {
        if (this.dragMode && this.selectedStroke) {
          this.normalizeShape(this.selectedStroke);
          this.broadcastStroke(this.selectedStroke);
          this.dragMode = null;
          this.render();
          this.updateSelectionToolbar();
        }
        return;
      }

      if (!this.isDrawing || !this.currentStroke) return;
      this.isDrawing = false;

      this.strokes.push(this.currentStroke);
      this.redoStack = [];
      this.broadcastStroke(this.currentStroke);

      // If drawn a shape, select it automatically so user can move/resize right away!
      if (this.isShape(this.currentStroke.tool)) {
        this.normalizeShape(this.currentStroke);
        this.selectedStroke = this.currentStroke;
        this.setTool('select');
        this.updateSelectionToolbar();
      }

      this.currentStroke = null;
      this.render();
    };

    // Mouse Listeners
    this.canvas.addEventListener('mousedown', start);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);

    // Touch Listeners
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) start(e);
    }, { passive: false });
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) move(e);
    }, { passive: false });
    window.addEventListener('touchend', end);

    // Wheel zoom & pan
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const factor = e.deltaY < 0 ? 1.08 : 0.92;
        this.zoomAt(e.clientX, e.clientY, factor);
      } else {
        this.panX -= e.deltaX;
        this.panY -= e.deltaY;
        this.render();
        this.updateSelectionToolbar();
      }
    }, { passive: false });
  }

  isShape(toolName) {
    return [
      'rect', 'roundedRect', 'circle', 'triangle',
      'diamond', 'star', 'hexagon', 'line',
      'arrow', 'doubleArrow', 'speechBubble', 'cylinder'
    ].includes(toolName);
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.isContentEditable) return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        this.undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
        e.preventDefault();
        this.redo();
      } else if (e.key === 'v' || e.key === 'V') {
        this.setTool('select');
      } else if (e.key === 'p' || e.key === 'P') {
        this.setTool('pen');
      } else if (e.key === 'h' || e.key === 'H') {
        this.setTool('marker');
      } else if (e.key === 'e' || e.key === 'E') {
        this.setTool('eraser');
      } else if (e.key === 't' || e.key === 'T') {
        this.setTool('text');
      } else if (e.key === 'n' || e.key === 'N') {
        this.setTool('note');
      } else if (e.key === '=' || e.key === '+') {
        this.increaseWidth();
      } else if (e.key === '-' || e.key === '_') {
        this.decreaseWidth();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (this.selectedStroke) {
          e.preventDefault();
          this.deleteSelected();
        }
      } else if (e.key === 'Escape') {
        this.selectedStroke = null;
        this.hideSelectionToolbar();
        this.render();
      }
    });
  }

  setupSelectionToolbarEvents() {
    const delBtn = document.getElementById('selDeleteBtn');
    if (delBtn) {
      delBtn.addEventListener('click', () => {
        this.deleteSelected();
      });
    }

    const dupBtn = document.getElementById('selDuplicateBtn');
    if (dupBtn) {
      dupBtn.addEventListener('click', () => {
        this.duplicateSelected();
      });
    }
  }

  updateSelectionToolbar() {
    if (!this.selectedStroke || !this.selToolbar) {
      this.hideSelectionToolbar();
      return;
    }

    const b = this.getStrokeBounds(this.selectedStroke);
    if (!b) return;

    const screenX = Math.max(60, Math.min(this.widthPx - 60, ((b.minX + b.maxX) / 2) * this.scale + this.panX));
    const screenY = b.minY * this.scale + this.panY;

    this.selToolbar.style.display = 'flex';
    this.selToolbar.style.left = `${screenX}px`;

    if (screenY < 55) {
      const bottomY = b.maxY * this.scale + this.panY;
      this.selToolbar.style.top = `${bottomY + 12}px`;
      this.selToolbar.style.transform = 'translate(-50%, 0)';
    } else {
      this.selToolbar.style.top = `${screenY - 10}px`;
      this.selToolbar.style.transform = 'translate(-50%, -100%)';
    }
  }

  hideSelectionToolbar() {
    if (this.selToolbar) {
      this.selToolbar.style.display = 'none';
    }
  }

  deleteSelected() {
    if (!this.selectedStroke) return;
    this.strokes = this.strokes.filter(s => s !== this.selectedStroke);
    this.selectedStroke = null;
    this.hideSelectionToolbar();
    this.render();
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'sync_history', history: this.strokes }));
    }
  }

  duplicateSelected() {
    if (!this.selectedStroke) return;
    const clone = JSON.parse(JSON.stringify(this.selectedStroke));
    clone.id = 's_' + Math.random().toString(36).substr(2, 8);
    clone.startX += 20;
    clone.endX += 20;
    clone.startY += 20;
    clone.endY += 20;
    if (clone.points) {
      for (const p of clone.points) {
        p.x += 20;
        p.y += 20;
      }
    }
    this.strokes.push(clone);
    this.selectedStroke = clone;
    this.render();
    this.updateSelectionToolbar();
    this.broadcastStroke(clone);
  }

  setTool(tool) {
    this.tool = tool;
    if (tool !== 'select') {
      this.selectedStroke = null;
      this.hideSelectionToolbar();
    }
    this.updateCursor();
    document.querySelectorAll('.dock-btn[data-tool]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tool === tool);
    });
    const shapesMenuBtn = document.getElementById('shapesMenuBtn');
    if (shapesMenuBtn) {
      shapesMenuBtn.classList.toggle('active', this.isShape(tool));
    }
    this.render();
  }

  setShape(shape) {
    this.activeShape = shape;
    this.setTool(shape);

    const iconMap = {
      rect: '⬜',
      roundedRect: '▢',
      circle: '⭕',
      triangle: '🔺',
      diamond: '💎',
      star: '⭐️',
      hexagon: '⬡',
      line: '➖',
      arrow: '➡️',
      doubleArrow: '↔️',
      speechBubble: '💬',
      cylinder: '🛢️'
    };

    const iconEl = document.getElementById('activeShapeIcon');
    if (iconEl && iconMap[shape]) {
      iconEl.innerText = iconMap[shape];
    }

    document.querySelectorAll('.shape-opt').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.shape === shape);
    });
  }

  setColor(hex) {
    this.color = hex;
    document.querySelectorAll('.color-dot').forEach(dot => {
      dot.classList.toggle('active', dot.dataset.color === hex);
    });
    if (this.selectedStroke) {
      this.selectedStroke.color = hex;
      this.render();
      this.broadcastStroke(this.selectedStroke);
    }
  }

  cycleBackground() {
    const styles = ['blank', 'dots', 'grid', 'dark'];
    const idx = (styles.indexOf(this.bgStyle) + 1) % styles.length;
    this.bgStyle = styles[idx];

    const labelMap = { blank: 'Blank', dots: 'Dot Grid', grid: 'Math Grid', dark: 'Dark Mode' };
    document.getElementById('bgLabel').innerText = labelMap[this.bgStyle];

    if (this.bgStyle === 'dark') {
      this.canvas.parentElement.style.backgroundColor = '#18181b';
      if (this.color === '#18181b') this.setColor('#38bdf8');
    } else {
      this.canvas.parentElement.style.backgroundColor = '#ffffff';
      if (this.color === '#38bdf8') this.setColor('#18181b');
    }
    this.render();
  }

  zoomAt(clientX, clientY, factor) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    const newScale = Math.min(Math.max(this.scale * factor, 0.25), 4);
    this.panX = mouseX - (mouseX - this.panX) * (newScale / this.scale);
    this.panY = mouseY - (mouseY - this.panY) * (newScale / this.scale);
    this.scale = newScale;

    document.getElementById('zoomText').innerText = `${Math.round(this.scale * 100)}%`;
    this.render();
    this.updateSelectionToolbar();
  }

  setZoomScale(scale) {
    this.scale = scale;
    document.getElementById('zoomText').innerText = `${Math.round(this.scale * 100)}%`;
    this.render();
    this.updateSelectionToolbar();
  }

  resetZoom() {
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    document.getElementById('zoomText').innerText = '100%';
    this.render();
    this.updateSelectionToolbar();
  }

  addTextPrompt(x, y) {
    const text = prompt('Type your text:');
    if (text && text.trim()) {
      const stroke = {
        id: 's_' + Math.random().toString(36).substr(2, 8),
        tool: 'text',
        x: x,
        y: y,
        startX: x,
        startY: y,
        endX: x + (text.trim().length * 10),
        endY: y + 20,
        text: text.trim(),
        color: this.color,
        size: Math.max(16, this.width * 5)
      };
      this.strokes.push(stroke);
      this.broadcastStroke(stroke);
      this.render();
    }
    this.setTool('pen');
  }

  // Sticky Notes with Delete and Color Options
  createSticky(x, y, text = 'New note', colorClass = 'note-card-yellow') {
    const note = {
      id: 'n_' + Math.random().toString(36).substr(2, 7),
      x: x,
      y: y,
      w: 180,
      h: 120,
      text: text,
      colorClass: colorClass
    };
    this.notes.push(note);
    this.renderNotes();
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'sync_notes', notes: this.notes }));
    }
  }

  deleteSticky(id) {
    this.notes = this.notes.filter(n => n.id !== id);
    this.renderNotes();
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'delete_note', id }));
    }
  }

  updateStickyColor(id, colorClass) {
    const n = this.notes.find(x => x.id === id);
    if (n) {
      n.colorClass = colorClass;
      this.renderNotes();
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'sync_notes', notes: this.notes }));
      }
    }
  }

  renderNotes() {
    if (!this.noteContainer) return;
    this.noteContainer.innerHTML = '';

    this.notes.forEach(n => {
      const card = document.createElement('div');
      card.className = `note-card ${n.colorClass}`;
      card.style.left = `${(n.x * this.scale) + this.panX}px`;
      card.style.top = `${(n.y * this.scale) + this.panY}px`;
      card.style.width = `${n.w * this.scale}px`;
      card.style.minHeight = `${n.h * this.scale}px`;

      const header = document.createElement('div');
      header.className = 'note-header';

      const colorDots = document.createElement('div');
      colorDots.className = 'note-color-dots';

      const colors = [
        { cls: 'note-card-yellow', bg: '#fef08a' },
        { cls: 'note-card-pink', bg: '#fbcfe8' },
        { cls: 'note-card-blue', bg: '#bae6fd' },
        { cls: 'note-card-green', bg: '#bbf7d0' }
      ];

      colors.forEach(c => {
        const dot = document.createElement('span');
        dot.className = 'note-dot';
        dot.style.background = c.bg;
        dot.title = 'Change color';
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          this.updateStickyColor(n.id, c.cls);
        });
        colorDots.appendChild(dot);
      });

      const delBtn = document.createElement('button');
      delBtn.className = 'note-delete-btn';
      delBtn.innerHTML = '&times;';
      delBtn.title = 'Delete note (Hatao)';
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteSticky(n.id);
      });

      header.appendChild(colorDots);
      header.appendChild(delBtn);

      const body = document.createElement('div');
      body.className = 'note-body';
      body.style.fontSize = `${13 * this.scale}px`;
      body.contentEditable = true;
      body.innerText = n.text;

      body.addEventListener('input', () => {
        n.text = body.innerText;
      });

      card.appendChild(header);
      card.appendChild(body);

      let dragging = false;
      let startX, startY;

      const onMouseDown = (e) => {
        if (e.target === body || e.target === delBtn || e.target.classList.contains('note-dot')) return;
        dragging = true;
        startX = e.clientX - ((n.x * this.scale) + this.panX);
        startY = e.clientY - ((n.y * this.scale) + this.panY);
        e.stopPropagation();
      };

      card.addEventListener('mousedown', onMouseDown);

      window.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const newLeft = e.clientX - startX;
        const newTop = e.clientY - startY;
        n.x = (newLeft - this.panX) / this.scale;
        n.y = (newTop - this.panY) / this.scale;
        card.style.left = `${newLeft}px`;
        card.style.top = `${newTop}px`;
      });

      window.addEventListener('mouseup', () => {
        if (dragging) {
          dragging = false;
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'sync_notes', notes: this.notes }));
          }
        }
      });

      this.noteContainer.appendChild(card);
    });
  }

  undo() {
    if (this.strokes.length > 0) {
      this.selectedStroke = null;
      this.hideSelectionToolbar();
      this.redoStack.push(this.strokes.pop());
      this.render();
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'undo' }));
      }
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const s = this.redoStack.pop();
      this.strokes.push(s);
      this.broadcastStroke(s);
      this.render();
    }
  }

  clear() {
    if (confirm('Clear the canvas?')) {
      this.strokes = [];
      this.redoStack = [];
      this.notes = [];
      this.selectedStroke = null;
      this.hideSelectionToolbar();
      this.renderNotes();
      this.render();
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'clear_canvas' }));
      }
    }
  }

  drawBackgroundGrid() {
    if (this.bgStyle === 'blank') return;

    this.ctx.save();
    const w = this.widthPx;
    const h = this.heightPx;
    const step = 28 * this.scale;
    const isDark = this.bgStyle === 'dark';
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

    this.ctx.strokeStyle = gridColor;
    this.ctx.fillStyle = gridColor;

    if (this.bgStyle === 'grid' || this.bgStyle === 'dark') {
      this.ctx.lineWidth = 1;
      const startX = this.panX % step;
      const startY = this.panY % step;

      this.ctx.beginPath();
      for (let x = startX; x < w; x += step) {
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, h);
      }
      for (let y = startY; y < h; y += step) {
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(w, y);
      }
      this.ctx.stroke();
    } else if (this.bgStyle === 'dots') {
      const startX = this.panX % step;
      const startY = this.panY % step;
      for (let x = startX; x < w; x += step) {
        for (let y = startY; y < h; y += step) {
          this.ctx.beginPath();
          this.ctx.arc(x, y, 1.2 * this.scale, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }
    this.ctx.restore();
  }

  // Draw Selection Bounding Box & Handles
  drawSelectionBox() {
    if (!this.selectedStroke) return;
    const s = this.selectedStroke;

    this.ctx.save();

    // Special rendering for lines & arrows (direct endpoint handles)
    if (s.tool === 'line' || s.tool === 'arrow' || s.tool === 'doubleArrow') {
      const sx = s.startX * this.scale + this.panX;
      const sy = s.startY * this.scale + this.panY;
      const ex = s.endX * this.scale + this.panX;
      const ey = s.endY * this.scale + this.panY;

      // Dashed guide between endpoints
      this.ctx.strokeStyle = '#2563eb';
      this.ctx.lineWidth = 1.4;
      this.ctx.setLineDash([4, 4]);
      this.ctx.beginPath();
      this.ctx.moveTo(sx, sy);
      this.ctx.lineTo(ex, ey);
      this.ctx.stroke();
      this.ctx.setLineDash([]);

      // Endpoint handles
      for (const pt of [{ x: sx, y: sy }, { x: ex, y: ey }]) {
        this.ctx.beginPath();
        this.ctx.arc(pt.x, pt.y, 5.5, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fill();
        this.ctx.strokeStyle = '#2563eb';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }

      this.ctx.restore();
      return;
    }

    const b = this.getStrokeBounds(s);
    if (!b) {
      this.ctx.restore();
      return;
    }

    const sx = b.minX * this.scale + this.panX;
    const sy = b.minY * this.scale + this.panY;
    const sw = b.width * this.scale;
    const sh = b.height * this.scale;

    // Dashed bounding rectangle
    this.ctx.strokeStyle = '#2563eb';
    this.ctx.lineWidth = 1.6;
    this.ctx.setLineDash([5, 4]);
    this.ctx.strokeRect(sx - 4, sy - 4, sw + 8, sh + 8);
    this.ctx.setLineDash([]);

    // 4 Corner Resize Handles
    const handles = this.getResizeHandles(s);
    for (const h of handles) {
      const hx = h.x * this.scale + this.panX;
      const hy = h.y * this.scale + this.panY;

      this.ctx.beginPath();
      this.ctx.arc(hx, hy, 5.5, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fill();
      this.ctx.strokeStyle = '#2563eb';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  // Render Individual Stroke / Shape
  renderStroke(s) {
    this.ctx.save();
    this.ctx.strokeStyle = s.color || '#18181b';
    this.ctx.lineWidth = (s.width || 4) * this.scale;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.globalAlpha = s.opacity || 1;

    // Freehand Pen / Marker / Eraser
    if (['pen', 'marker', 'eraser'].includes(s.tool)) {
      const pts = s.points;
      if (!pts || pts.length === 0) return;

      this.ctx.beginPath();
      if (pts.length === 1) {
        const p = pts[0];
        this.ctx.arc((p.x * this.scale) + this.panX, (p.y * this.scale) + this.panY, (s.width * this.scale) / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = s.color;
        this.ctx.fill();
      } else {
        this.ctx.moveTo((pts[0].x * this.scale) + this.panX, (pts[0].y * this.scale) + this.panY);
        for (let i = 1; i < pts.length - 1; i++) {
          const xc = ((pts[i].x + pts[i + 1].x) / 2) * this.scale + this.panX;
          const yc = ((pts[i].y + pts[i + 1].y) / 2) * this.scale + this.panY;
          this.ctx.quadraticCurveTo((pts[i].x * this.scale) + this.panX, (pts[i].y * this.scale) + this.panY, xc, yc);
        }
        const last = pts[pts.length - 1];
        this.ctx.lineTo((last.x * this.scale) + this.panX, (last.y * this.scale) + this.panY);
        this.ctx.stroke();
      }
      this.ctx.restore();
      return;
    }

    // Geometry calculation for shapes
    const x = Math.min(s.startX, s.endX) * this.scale + this.panX;
    const y = Math.min(s.startY, s.endY) * this.scale + this.panY;
    const w = Math.abs(s.endX - s.startX) * this.scale;
    const h = Math.abs(s.endY - s.startY) * this.scale;
    const cx = ((s.startX + s.endX) / 2) * this.scale + this.panX;
    const cy = ((s.startY + s.endY) / 2) * this.scale + this.panY;

    const isDark = this.bgStyle === 'dark';
    const fillColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
    this.ctx.fillStyle = fillColor;

    if (s.tool === 'rect') {
      this.ctx.fillRect(x, y, w, h);
      this.ctx.strokeRect(x, y, w, h);
    } else if (s.tool === 'roundedRect') {
      const r = Math.min(16, w / 4, h / 4);
      this.ctx.beginPath();
      if (this.ctx.roundRect) {
        this.ctx.roundRect(x, y, w, h, r);
      } else {
        this.ctx.rect(x, y, w, h);
      }
      this.ctx.fill();
      this.ctx.stroke();
    } else if (s.tool === 'circle') {
      const rx = w / 2;
      const ry = h / 2;
      this.ctx.beginPath();
      this.ctx.ellipse(cx, cy, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
    } else if (s.tool === 'triangle') {
      this.ctx.beginPath();
      this.ctx.moveTo(cx, y);
      this.ctx.lineTo(x, y + h);
      this.ctx.lineTo(x + w, y + h);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
    } else if (s.tool === 'diamond') {
      this.ctx.beginPath();
      this.ctx.moveTo(cx, y);
      this.ctx.lineTo(x + w, cy);
      this.ctx.lineTo(cx, y + h);
      this.ctx.lineTo(x, cy);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
    } else if (s.tool === 'star') {
      const rOuter = Math.min(w, h) / 2;
      const rInner = rOuter * 0.44;
      let rot = -Math.PI / 2;
      const step = Math.PI / 5;
      this.ctx.beginPath();
      this.ctx.moveTo(cx + Math.cos(rot) * rOuter, cy + Math.sin(rot) * rOuter);
      for (let i = 0; i < 5; i++) {
        rot += step;
        this.ctx.lineTo(cx + Math.cos(rot) * rInner, cy + Math.sin(rot) * rInner);
        rot += step;
        this.ctx.lineTo(cx + Math.cos(rot) * rOuter, cy + Math.sin(rot) * rOuter);
      }
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
    } else if (s.tool === 'hexagon') {
      const rx = w / 2;
      const ry = h / 2;
      this.ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI / 3) - Math.PI / 6;
        const hx = cx + rx * Math.cos(angle);
        const hy = cy + ry * Math.sin(angle);
        if (i === 0) this.ctx.moveTo(hx, hy);
        else this.ctx.lineTo(hx, hy);
      }
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
    } else if (s.tool === 'line') {
      const fx = (s.startX * this.scale) + this.panX;
      const fy = (s.startY * this.scale) + this.panY;
      const tx = (s.endX * this.scale) + this.panX;
      const ty = (s.endY * this.scale) + this.panY;
      this.ctx.beginPath();
      this.ctx.moveTo(fx, fy);
      this.ctx.lineTo(tx, ty);
      this.ctx.stroke();
    } else if (s.tool === 'arrow') {
      const fx = (s.startX * this.scale) + this.panX;
      const fy = (s.startY * this.scale) + this.panY;
      const tx = (s.endX * this.scale) + this.panX;
      const ty = (s.endY * this.scale) + this.panY;
      const head = 14 * this.scale;
      const angle = Math.atan2(ty - fy, tx - fx);

      this.ctx.beginPath();
      this.ctx.moveTo(fx, fy);
      this.ctx.lineTo(tx, ty);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(tx, ty);
      this.ctx.lineTo(tx - head * Math.cos(angle - Math.PI / 6), ty - head * Math.sin(angle - Math.PI / 6));
      this.ctx.lineTo(tx - head * Math.cos(angle + Math.PI / 6), ty - head * Math.sin(angle + Math.PI / 6));
      this.ctx.closePath();
      this.ctx.fillStyle = s.color;
      this.ctx.fill();
    } else if (s.tool === 'doubleArrow') {
      const fx = (s.startX * this.scale) + this.panX;
      const fy = (s.startY * this.scale) + this.panY;
      const tx = (s.endX * this.scale) + this.panX;
      const ty = (s.endY * this.scale) + this.panY;
      const head = 14 * this.scale;
      const angle = Math.atan2(ty - fy, tx - fx);

      this.ctx.beginPath();
      this.ctx.moveTo(fx, fy);
      this.ctx.lineTo(tx, ty);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(tx, ty);
      this.ctx.lineTo(tx - head * Math.cos(angle - Math.PI / 6), ty - head * Math.sin(angle - Math.PI / 6));
      this.ctx.lineTo(tx - head * Math.cos(angle + Math.PI / 6), ty - head * Math.sin(angle + Math.PI / 6));
      this.ctx.closePath();
      this.ctx.fillStyle = s.color;
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.moveTo(fx, fy);
      this.ctx.lineTo(fx + head * Math.cos(angle - Math.PI / 6), fy + head * Math.sin(angle - Math.PI / 6));
      this.ctx.lineTo(fx + head * Math.cos(angle + Math.PI / 6), fy + head * Math.sin(angle + Math.PI / 6));
      this.ctx.closePath();
      this.ctx.fill();
    } else if (s.tool === 'speechBubble') {
      const r = Math.min(14, w / 4, h / 4);
      this.ctx.beginPath();
      if (this.ctx.roundRect) {
        this.ctx.roundRect(x, y, w, h * 0.8, r);
      } else {
        this.ctx.rect(x, y, w, h * 0.8);
      }
      this.ctx.moveTo(x + w * 0.2, y + h * 0.8);
      this.ctx.lineTo(x + w * 0.08, y + h);
      this.ctx.lineTo(x + w * 0.35, y + h * 0.8);
      this.ctx.fill();
      this.ctx.stroke();
    } else if (s.tool === 'cylinder') {
      const ry = Math.min(16, h / 5);
      this.ctx.beginPath();
      this.ctx.ellipse(cx, y + ry, w / 2, ry, 0, 0, Math.PI * 2);
      this.ctx.moveTo(x, y + ry);
      this.ctx.lineTo(x, y + h - ry);
      this.ctx.ellipse(cx, y + h - ry, w / 2, ry, 0, 0, Math.PI);
      this.ctx.lineTo(x + w, y + ry);
      this.ctx.fill();
      this.ctx.stroke();
    } else if (s.tool === 'text') {
      this.ctx.fillStyle = s.color || '#18181b';
      this.ctx.font = `500 ${(s.size || 16) * this.scale}px -apple-system, sans-serif`;
      this.ctx.fillText(s.text, (s.x * this.scale) + this.panX, (s.y * this.scale) + this.panY);
    }

    this.ctx.restore();
  }

  render() {
    this.ctx.clearRect(0, 0, this.widthPx, this.heightPx);
    this.drawBackgroundGrid();

    for (const stroke of this.strokes) {
      this.renderStroke(stroke);
    }

    if (this.currentStroke) {
      this.renderStroke(this.currentStroke);
    }

    // Render selection box on top if a shape is selected
    if (this.selectedStroke) {
      this.drawSelectionBox();
    }

    this.renderNotes();
  }

  // Load Templates
  loadTemplate(name) {
    this.strokes = [];
    this.notes = [];
    this.selectedStroke = null;
    this.hideSelectionToolbar();

    if (name === 'math') {
      this.bgStyle = 'grid';
      document.getElementById('bgLabel').innerText = 'Math Grid';
      const cx = this.widthPx / 2;
      const cy = this.heightPx / 2;
      this.strokes.push({ id: 's_m1', tool: 'arrow', startX: 100, startY: cy, endX: this.widthPx - 100, endY: cy, color: '#18181b', width: 2 });
      this.strokes.push({ id: 's_m2', tool: 'arrow', startX: cx, startY: this.heightPx - 80, endX: cx, endY: 80, color: '#18181b', width: 2 });
      this.strokes.push({ id: 's_m3', tool: 'text', x: this.widthPx - 80, y: cy - 10, text: '+X', color: '#18181b', size: 16 });
      this.strokes.push({ id: 's_m4', tool: 'text', x: cx + 12, y: 70, text: '+Y', color: '#18181b', size: 16 });
    } else if (name === 'retro') {
      this.strokes.push({ id: 's_r1', tool: 'rect', startX: 80, startY: 80, endX: 380, endY: 580, color: '#3b82f6', width: 2 });
      this.strokes.push({ id: 's_r2', tool: 'text', x: 100, y: 120, text: '🎉 What Went Well', color: '#3b82f6', size: 18 });
      this.createSticky(100, 150, 'Shipped feature v1!', 'note-card-green');

      this.strokes.push({ id: 's_r3', tool: 'rect', startX: 420, startY: 80, endX: 720, endY: 580, color: '#ef4444', width: 2 });
      this.strokes.push({ id: 's_r4', tool: 'text', x: 440, y: 120, text: '⚠️ Needs Work', color: '#ef4444', size: 18 });
      this.createSticky(440, 150, 'Review turnaround slow', 'note-card-pink');

      this.strokes.push({ id: 's_r5', tool: 'rect', startX: 760, startY: 80, endX: 1060, endY: 580, color: '#10b981', width: 2 });
      this.strokes.push({ id: 's_r6', tool: 'text', x: 780, y: 120, text: '🚀 Action Items', color: '#10b981', size: 18 });
      this.createSticky(780, 150, 'Automate CI checks', 'note-card-blue');
    } else if (name === 'kanban') {
      this.strokes.push({ id: 's_k1', tool: 'rect', startX: 80, startY: 80, endX: 380, endY: 580, color: '#71717a', width: 2 });
      this.strokes.push({ id: 's_k2', tool: 'text', x: 100, y: 120, text: '📋 To-Do', color: '#18181b', size: 18 });
      this.createSticky(100, 150, 'Design clean UI', 'note-card-yellow');

      this.strokes.push({ id: 's_k3', tool: 'rect', startX: 420, startY: 80, endX: 720, endY: 580, color: '#f59e0b', width: 2 });
      this.strokes.push({ id: 's_k4', tool: 'text', x: 440, y: 120, text: '⏳ In Progress', color: '#f59e0b', size: 18 });
      this.createSticky(440, 150, 'Test canvas sync', 'note-card-blue');

      this.strokes.push({ id: 's_k5', tool: 'rect', startX: 760, startY: 80, endX: 1060, endY: 580, color: '#10b981', width: 2 });
      this.strokes.push({ id: 's_k6', tool: 'text', x: 780, y: 120, text: '✅ Completed', color: '#10b981', size: 18 });
      this.createSticky(780, 150, 'Launch localhost server', 'note-card-green');
    } else if (name === 'mindmap') {
      const cx = this.widthPx / 2;
      const cy = this.heightPx / 2;
      this.strokes.push({ id: 's_mm1', tool: 'circle', startX: cx - 70, startY: cy - 70, endX: cx + 70, endY: cy + 70, color: '#2563eb', width: 3 });
      this.strokes.push({ id: 's_mm2', tool: 'text', x: cx - 45, y: cy + 5, text: 'Main Idea', color: '#2563eb', size: 18 });
      this.strokes.push({ id: 's_mm3', tool: 'arrow', startX: cx - 75, startY: cy - 40, endX: cx - 220, endY: cy - 140, color: '#71717a', width: 2 });
      this.strokes.push({ id: 's_mm4', tool: 'arrow', startX: cx + 75, startY: cy - 40, endX: cx + 220, endY: cy - 140, color: '#71717a', width: 2 });
      this.createSticky(cx - 320, cy - 190, 'Topic A: Research', 'note-card-yellow');
      this.createSticky(cx + 220, cy - 190, 'Topic B: Execution', 'note-card-green');
    } else if (name === 'notes') {
      this.strokes.push({ id: 's_cn1', tool: 'rect', startX: 80, startY: 60, endX: 320, endY: 520, color: '#71717a', width: 2 });
      this.strokes.push({ id: 's_cn2', tool: 'text', x: 100, y: 100, text: 'Questions / Cues', color: '#18181b', size: 16 });
      this.strokes.push({ id: 's_cn3', tool: 'rect', startX: 340, startY: 60, endX: 980, endY: 520, color: '#71717a', width: 2 });
      this.strokes.push({ id: 's_cn4', tool: 'text', x: 360, y: 100, text: 'Lecture & Class Notes', color: '#18181b', size: 16 });
      this.strokes.push({ id: 's_cn5', tool: 'rect', startX: 80, startY: 540, endX: 980, endY: 660, color: '#71717a', width: 2 });
      this.strokes.push({ id: 's_cn6', tool: 'text', x: 100, y: 575, text: 'Summary in 1-2 Sentences', color: '#18181b', size: 16 });
    }

    this.render();
  }

  // Real-time WebSockets
  connectWS() {
    const params = new URLSearchParams(window.location.search);
    const roomId = params.get('room') || 'instant-room';
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

    try {
      this.ws = new WebSocket(`${proto}//${window.location.host}?room=${roomId}`);

      this.ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.type === 'init') {
          this.userId = msg.userId;
          this.userColor = msg.userColor;
          if (msg.history && msg.history.length > 0) {
            this.strokes = msg.history;
            this.render();
          }
        } else if (msg.type === 'draw_stroke') {
          // If stroke exists, update it (for move/resize), else append
          const idx = this.strokes.findIndex(s => s.id === msg.stroke.id);
          if (idx !== -1) {
            this.strokes[idx] = msg.stroke;
          } else {
            this.strokes.push(msg.stroke);
          }
          this.render();
        } else if (msg.type === 'cursor_move') {
          this.renderPeerCursor(msg);
        } else if (msg.type === 'clear_canvas') {
          this.strokes = [];
          this.notes = [];
          this.selectedStroke = null;
          this.hideSelectionToolbar();
          this.renderNotes();
          this.render();
        } else if (msg.type === 'sync_history') {
          this.strokes = msg.history || [];
          this.render();
        } else if (msg.type === 'delete_note') {
          this.notes = this.notes.filter(n => n.id !== msg.id);
          this.renderNotes();
        } else if (msg.type === 'sync_notes') {
          this.notes = msg.notes || [];
          this.renderNotes();
        }
      };
    } catch (err) {
      // offline mode
    }
  }

  broadcastStroke(stroke) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'draw_stroke', stroke }));
    }
  }

  sendCursor(x, y) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'cursor_move', x, y }));
    }
  }

  renderPeerCursor(data) {
    let el = document.getElementById(`peer_${data.userId}`);
    if (!el) {
      el = document.createElement('div');
      el.id = `peer_${data.userId}`;
      el.className = 'peer-cursor';
      el.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="${data.userColor}">
          <path d="M4 0l16 12-7 2-4 10z"/>
        </svg>
        <span class="peer-tag" style="background:${data.userColor}">${data.name || 'Collaborator'}</span>
      `;
      this.container.appendChild(el);
    }
    const sx = (data.x * this.scale) + this.panX;
    const sy = (data.y * this.scale) + this.panY;
    el.style.transform = `translate(${sx}px, ${sy}px)`;
  }

  // Export PNG (High-Res 2X)
  exportPNG() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.widthPx * 2;
    tempCanvas.height = this.heightPx * 2;
    const tCtx = tempCanvas.getContext('2d');
    tCtx.scale(2, 2);

    tCtx.fillStyle = this.bgStyle === 'dark' ? '#18181b' : '#ffffff';
    tCtx.fillRect(0, 0, this.widthPx, this.heightPx);

    for (const stroke of this.strokes) {
      tCtx.save();
      tCtx.strokeStyle = stroke.color;
      tCtx.lineWidth = stroke.width;
      tCtx.lineCap = 'round';
      tCtx.lineJoin = 'round';
      tCtx.globalAlpha = stroke.opacity || 1;

      if (['pen', 'marker', 'eraser'].includes(stroke.tool)) {
        const pts = stroke.points;
        if (pts && pts.length > 0) {
          tCtx.beginPath();
          tCtx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) {
            tCtx.lineTo(pts[i].x, pts[i].y);
          }
          tCtx.stroke();
        }
      } else {
        const sx = stroke.startX;
        const sy = stroke.startY;
        const ex = stroke.endX;
        const ey = stroke.endY;
        const x = Math.min(sx, ex);
        const y = Math.min(sy, ey);
        const w = Math.abs(ex - sx);
        const h = Math.abs(ey - sy);

        if (stroke.tool === 'rect') {
          tCtx.strokeRect(x, y, w, h);
        } else if (stroke.tool === 'circle') {
          tCtx.beginPath();
          tCtx.ellipse((sx + ex) / 2, (sy + ey) / 2, Math.max(1, w / 2), Math.max(1, h / 2), 0, 0, Math.PI * 2);
          tCtx.stroke();
        } else if (stroke.tool === 'arrow') {
          tCtx.beginPath();
          tCtx.moveTo(sx, sy);
          tCtx.lineTo(ex, ey);
          tCtx.stroke();
        } else if (stroke.tool === 'line') {
          tCtx.beginPath();
          tCtx.moveTo(sx, sy);
          tCtx.lineTo(ex, ey);
          tCtx.stroke();
        } else if (stroke.tool === 'text') {
          tCtx.fillStyle = stroke.color;
          tCtx.font = `500 ${stroke.size || 16}px sans-serif`;
          tCtx.fillText(stroke.text, stroke.x, stroke.y);
        }
      }
      tCtx.restore();
    }

    const a = document.createElement('a');
    a.download = `whiteboard-${Date.now()}.png`;
    a.href = tempCanvas.toDataURL('image/png');
    a.click();
  }
}

window.MinimalCanvasEngine = MinimalCanvasEngine;
