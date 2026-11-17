// Clean, Minimal Whiteboard App Controller with Stepper & Shapes Support
document.addEventListener('DOMContentLoaded', () => {
  const engine = new MinimalCanvasEngine('mainCanvas');
  window.whiteboard = engine;

  // Toast notification helper
  function notify(text) {
    const box = document.getElementById('toastBox');
    box.innerHTML = `<div class="toast-msg">${text}</div>`;
    setTimeout(() => {
      box.innerHTML = '';
    }, 2000);
  }

  // Freehand Tool buttons (Pen, Marker, Eraser, Text, Note)
  document.querySelectorAll('.dock-btn[data-tool]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeShapesPopover();
      engine.setTool(btn.dataset.tool);
    });
  });

  // Shapes Popover Logic
  const shapesMenuBtn = document.getElementById('shapesMenuBtn');
  const shapesPopover = document.getElementById('shapesPopover');

  function toggleShapesPopover() {
    shapesPopover.classList.toggle('open');
  }

  function closeShapesPopover() {
    shapesPopover.classList.remove('open');
  }

  shapesMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!engine.isShape(engine.tool)) {
      engine.setShape(engine.activeShape);
    }
    toggleShapesPopover();
  });

  document.querySelectorAll('.shape-opt').forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const shape = opt.dataset.shape;
      engine.setShape(shape);
      closeShapesPopover();
      notify(`Shape: ${opt.querySelector('span').innerText}`);
    });
  });

  window.addEventListener('click', (e) => {
    if (!shapesPopover.contains(e.target) && e.target !== shapesMenuBtn) {
      closeShapesPopover();
    }
  });

  // Color dots
  document.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      engine.setColor(dot.dataset.color);
    });
  });

  // Stroke thickness stepper (Kam / Jayda Karein)
  const sizeDownBtn = document.getElementById('sizeDownBtn');
  const sizeUpBtn = document.getElementById('sizeUpBtn');

  if (sizeDownBtn) {
    sizeDownBtn.addEventListener('click', () => {
      const w = engine.decreaseWidth();
      notify(`Thickness: ${w}px`);
    });
  }

  if (sizeUpBtn) {
    sizeUpBtn.addEventListener('click', () => {
      const w = engine.increaseWidth();
      notify(`Thickness: ${w}px`);
    });
  }

  // Clear Canvas
  document.getElementById('clearBtn').addEventListener('click', () => {
    engine.clear();
  });

  // Background toggle
  document.getElementById('bgToggleBtn').addEventListener('click', () => {
    engine.cycleBackground();
    notify(`Canvas: ${engine.bgStyle.toUpperCase()}`);
  });

  // Undo / Redo
  document.getElementById('undoBtn').addEventListener('click', () => {
    engine.undo();
  });
  document.getElementById('redoBtn').addEventListener('click', () => {
    engine.redo();
  });

  // Zoom controls
  document.getElementById('zoomIn').addEventListener('click', () => {
    engine.setZoomScale(engine.scale * 1.15);
  });
  document.getElementById('zoomOut').addEventListener('click', () => {
    engine.setZoomScale(engine.scale * 0.85);
  });
  document.getElementById('zoomReset').addEventListener('click', () => {
    engine.resetZoom();
  });

  // Export PNG
  document.getElementById('exportBtn').addEventListener('click', () => {
    engine.exportPNG();
    notify('Downloaded whiteboard image (PNG)');
  });

  // Share room
  document.getElementById('shareRoomBtn').addEventListener('click', () => {
    const params = new URLSearchParams(window.location.search);
    let roomId = params.get('room');
    if (!roomId) {
      roomId = 'room-' + Math.random().toString(36).substring(2, 8);
      const shareUrl = `${window.location.origin}/?room=${roomId}`;
      navigator.clipboard.writeText(shareUrl);
      notify(`Copied invite link: ${shareUrl}`);
      window.history.pushState({}, '', `/?room=${roomId}`);
      location.reload();
    } else {
      navigator.clipboard.writeText(window.location.href);
      notify('Copied room invite link to clipboard!');
    }
  });

  // Templates Modal
  const modal = document.getElementById('templatesModal');
  document.getElementById('templatesBtn').addEventListener('click', () => {
    modal.classList.add('open');
  });

  document.getElementById('closeTemplatesBtn').addEventListener('click', () => {
    modal.classList.remove('open');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  document.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', () => {
      const tpl = card.dataset.template;
      engine.loadTemplate(tpl);
      modal.classList.remove('open');
      notify(`Loaded ${tpl.toUpperCase()} template`);
    });
  });
});
