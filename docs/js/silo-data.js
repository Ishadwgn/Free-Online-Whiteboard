// SILO Master Data for "Free Online Whiteboard"
window.SILO_DATA = {
  tools: [
    {
      id: "collaborative-whiteboard",
      title: "Real-Time Collaborative Whiteboard",
      badge: "Most Popular",
      icon: "users",
      desc: "Instant multi-user whiteboard with live cursor tracking, WebRTC/WebSocket sync, and zero login required.",
      features: ["Instant Share Link", "Live Cursor Badges", "Multi-Color User Pens", "Zero Account Registration"]
    },
    {
      id: "math-whiteboard",
      title: "Math & STEM Whiteboard",
      badge: "Tutoring Favorite",
      icon: "square-root-variable",
      desc: "Built for teachers and tutors with coordinate planes, Cartesian graphs, geometry shapes, and formula support.",
      features: ["Cartesian Coordinate Grids", "Geometry Rulers & Protractors", "Fraction & Step-by-Step Pens", "Clean Export for Homework"]
    },
    {
      id: "teaching-whiteboard",
      title: "Virtual Classroom Whiteboard",
      badge: "Education",
      icon: "graduation-cap",
      desc: "Teacher command center with view-locking, student breakout boards, countdown timer, and background locking.",
      features: ["Lock Canvas Background", "Built-in Timer", "Laser Pointer Presentation Mode", "FERPA/COPPA Kid Safe"]
    },
    {
      id: "system-design-whiteboard",
      title: "System Design & Architecture Board",
      badge: "Engineering",
      icon: "server",
      desc: "Sketch distributed systems, cloud architecture diagrams (AWS/GCP), microservices flows, and UML diagrams.",
      features: ["Orthogonal Connector Arrows", "Server & Database Stencils", "Dark Mode Canvas", "1-Click Copy to Clipboard"]
    },
    {
      id: "sticky-notes-board",
      title: "Sticky Notes & Brainstorming Canvas",
      badge: "Agile / Teams",
      icon: "sticky-note",
      desc: "Color-coded digital sticky notes with dot-voting, Kanban column containers, and clustering tools.",
      features: ["6 Pastel Note Colors", "Movable & Resizable Notes", "Dot-Voting Stickers", "Export Notes to CSV/PNG"]
    },
    {
      id: "screen-recording-whiteboard",
      title: "Screen Recording Whiteboard",
      badge: "Video Maker",
      icon: "video",
      desc: "Record your drawing canvas with voiceover narration into high-res MP4/WebM videos without watermarks.",
      features: ["1-Click Browser Video Recording", "Microphone Audio Sync", "Zero Watermark", "Instant Local Video Download"]
    },
    {
      id: "pdf-annotator-whiteboard",
      title: "PDF Worksheet Annotator",
      badge: "Productivity",
      icon: "file-text",
      desc: "Upload worksheets, tests, or slide decks as canvas backgrounds, highlight, draw notes, and export merged PDFs.",
      features: ["Multi-Page PDF Support", "Highlighter & Red Pen", "Text Notes", "Flattened PDF Export"]
    },
    {
      id: "whiteboard-animation-maker",
      title: "Whiteboard Animation & Speed-Draw",
      badge: "Creative",
      icon: "play-circle",
      desc: "Record vector strokes in sequence and replay as automated doodle animations and time-lapse explainer clips.",
      features: ["Stroke Sequence Recorder", "Replay Speed Control (1x-5x)", "Animated SVG Output", "Khan-Academy Style Playback"]
    },
    {
      id: "tactics-board",
      title: "Sports Tactics & Playbook Board",
      badge: "Coaching",
      icon: "trophy",
      desc: "Interactive sports tactical board with pre-calibrated courts for basketball, soccer, football, and hockey.",
      features: ["Basketball / Soccer Court Presets", "Numbered Player Tokens", "Tactical Play Arrows", "Export Playbook PDFs"]
    },
    {
      id: "quick-sketch",
      title: "Minimalist Quick Sketchpad",
      badge: "Low Latency",
      icon: "pen-tool",
      desc: "Ultra-fast scratchpad that loads in 50ms with zero distractions, pressure sensitivity, and quick clipboard copying.",
      features: ["Sub-5ms Input Latency", "Minimalist Hidden Toolbars", "Pressure Sensitivity", "Ctrl+C Direct Image Copy"]
    },
    {
      id: "graph-grid-generator",
      title: "Custom Grid & Graph Paper Board",
      badge: "Utilities",
      icon: "grid",
      desc: "Generate custom dot-grid, isometric 3D grid, polar coordinates, logarithmic grids, and printable graph sheets.",
      features: ["Custom Grid Spacing Slider", "Dot Grid / Isometric / Polar", "Printable 300 DPI Export", "Dark Grid Contrast"]
    },
    {
      id: "music-notation-whiteboard",
      title: "Music Theory & Staff Board",
      badge: "Music",
      icon: "music",
      desc: "5-line musical stave background with clef stamps, note markers, and piano keyboard overlay for music education.",
      features: ["Grand Staff Backgrounds", "Treble / Bass Clef Stamps", "Quarter / Eighth Note Tools", "Chords & Harmony Sketch"]
    },
    {
      id: "infinite-canvas-drawing",
      title: "Infinite Canvas Vector Board",
      badge: "Infinite Space",
      icon: "maximize-2",
      desc: "Limitless 2D spatial canvas with 0.1x to 50x zoom, spatial minimap, and lossless vector line preservation.",
      features: ["Limitless Panning & Zoom", "Lossless Vector Lines", "Spatial Mini-Map Radar", "Never Run Out of Room"]
    },
    {
      id: "dark-mode-whiteboard",
      title: "Dark Mode / Blackboard Canvas",
      badge: "Eye Comfort",
      icon: "moon",
      desc: "Pitch-black canvas with luminous neon pens (cyan, magenta, lime, gold) reducing eye fatigue during night study.",
      features: ["True OLED Black (#121212)", "High-Luminance Neon Pens", "Chalkboard Texture Option", "Reduced Blue Light Strain"]
    }
  ],

  templates: [
    {
      id: "sprint-retrospective",
      title: "Agile Sprint Retrospective",
      category: "Agile & Product",
      desc: "Mad, Sad, Glad & What Went Well retrospective board with sticky notes and vote dots.",
      strokes: [
        { type: "rect", x: 100, y: 100, w: 320, h: 500, stroke: "#3b82f6", fill: "rgba(59,130,246,0.05)", label: "What Went Well 🎉" },
        { type: "rect", x: 450, y: 100, w: 320, h: 500, stroke: "#ef4444", fill: "rgba(239,68,68,0.05)", label: "What Needs Improvement ⚠️" },
        { type: "rect", x: 800, y: 100, w: 320, h: 500, stroke: "#10b981", fill: "rgba(16,185,129,0.05)", label: "Action Items 🚀" },
        { type: "sticky", x: 130, y: 180, w: 180, h: 120, color: "#fef08a", text: "Deployed v2.0 on time!" },
        { type: "sticky", x: 480, y: 180, w: 180, h: 120, color: "#fecdd3", text: "CI/CD build times too long" },
        { type: "sticky", x: 830, y: 180, w: 180, h: 120, color: "#bbf7d0", text: "Cache Docker layers" }
      ]
    },
    {
      id: "kanban-board",
      title: "Kanban Task Board",
      category: "Agile & Product",
      desc: "Classic 3-column workflow board (To-Do, In Progress, Done) with movable task cards.",
      strokes: [
        { type: "rect", x: 80, y: 90, w: 340, h: 520, stroke: "#64748b", fill: "rgba(100,116,139,0.04)", label: "To Do 📋" },
        { type: "rect", x: 450, y: 90, w: 340, h: 520, stroke: "#f59e0b", fill: "rgba(245,158,11,0.04)", label: "In Progress ⏳" },
        { type: "rect", x: 820, y: 90, w: 340, h: 520, stroke: "#10b981", fill: "rgba(16,185,129,0.04)", label: "Completed ✅" },
        { type: "sticky", x: 110, y: 160, w: 190, h: 100, color: "#fed7aa", text: "Write API documentation" },
        { type: "sticky", x: 480, y: 160, w: 190, h: 100, color: "#e9d5ff", text: "Implement WebRTC sync" },
        { type: "sticky", x: 850, y: 160, w: 190, h: 100, color: "#bbf7d0", text: "Setup responsive canvas" }
      ]
    },
    {
      id: "mind-map",
      title: "Central Mind Map",
      category: "Strategy & Brainstorming",
      desc: "Radiating brainstorm diagram connecting sub-topics and ideas to a primary goal.",
      strokes: [
        { type: "circle", cx: 600, cy: 340, r: 90, stroke: "#6366f1", fill: "rgba(99,102,241,0.1)", label: "Core Concept" },
        { type: "line", x1: 520, y1: 300, x2: 300, y2: 200, stroke: "#6366f1", width: 2 },
        { type: "line", x1: 680, y1: 300, x2: 900, y2: 200, stroke: "#6366f1", width: 2 },
        { type: "line", x1: 520, y1: 380, x2: 300, y2: 480, stroke: "#6366f1", width: 2 },
        { type: "line", x1: 680, y1: 380, x2: 900, y2: 480, stroke: "#6366f1", width: 2 },
        { type: "rect", x: 180, y: 160, w: 180, h: 70, stroke: "#3b82f6", fill: "rgba(59,130,246,0.08)", label: "Feature Idea A" },
        { type: "rect", x: 840, y: 160, w: 180, h: 70, stroke: "#10b981", fill: "rgba(16,185,129,0.08)", label: "Market Research" },
        { type: "rect", x: 180, y: 450, w: 180, h: 70, stroke: "#f59e0b", fill: "rgba(245,158,11,0.08)", label: "Growth Hack" },
        { type: "rect", x: 840, y: 450, w: 180, h: 70, stroke: "#ec4899", fill: "rgba(236,72,153,0.08)", label: "Technical Moat" }
      ]
    },
    {
      id: "swot-analysis",
      title: "SWOT Analysis 2x2 Matrix",
      category: "Strategy & Brainstorming",
      desc: "Strengths, Weaknesses, Opportunities, and Threats strategic business analysis grid.",
      strokes: [
        { type: "rect", x: 120, y: 90, w: 460, h: 260, stroke: "#10b981", fill: "rgba(16,185,129,0.05)", label: "Strengths (Internal)" },
        { type: "rect", x: 610, y: 90, w: 460, h: 260, stroke: "#ef4444", fill: "rgba(239,68,68,0.05)", label: "Weaknesses (Internal)" },
        { type: "rect", x: 120, y: 380, w: 460, h: 260, stroke: "#3b82f6", fill: "rgba(59,130,246,0.05)", label: "Opportunities (External)" },
        { type: "rect", x: 610, y: 380, w: 460, h: 260, stroke: "#f59e0b", fill: "rgba(245,158,11,0.05)", label: "Threats (External)" }
      ]
    },
    {
      id: "venn-diagram",
      title: "Venn Diagram (2 Circles)",
      category: "Education & Learning",
      desc: "Two intersecting circular sets for comparing similarities, contrasts, and overlaps.",
      strokes: [
        { type: "circle", cx: 480, cy: 340, r: 180, stroke: "#3b82f6", fill: "rgba(59,130,246,0.08)", label: "Topic A Only" },
        { type: "circle", cx: 720, cy: 340, r: 180, stroke: "#ec4899", fill: "rgba(236,72,153,0.08)", label: "Topic B Only" },
        { type: "text", x: 570, y: 330, text: "Overlap / Shared", color: "#1e293b", size: 18 }
      ]
    },
    {
      id: "cornell-notes",
      title: "Cornell Note-Taking System",
      category: "Education & Learning",
      desc: "Structured note-taking template with cue/keyword column, main lecture notes, and summary block.",
      strokes: [
        { type: "rect", x: 100, y: 80, w: 260, h: 460, stroke: "#64748b", fill: "#ffffff", label: "Cues / Key Questions" },
        { type: "rect", x: 380, y: 80, w: 680, h: 460, stroke: "#64748b", fill: "#ffffff", label: "Main Notes & Explanations" },
        { type: "rect", x: 100, y: 560, w: 960, h: 140, stroke: "#64748b", fill: "rgba(241,245,249,0.6)", label: "Summary in 1-2 Sentences" }
      ]
    },
    {
      id: "math-coordinate-plane",
      title: "4-Quadrant Cartesian Plane",
      category: "Education & Learning",
      desc: "Precision X-Y axis grid for plotting points, graphing linear functions, and solving quadratics.",
      strokes: [
        { type: "line", x1: 600, y1: 80, x2: 600, y2: 640, stroke: "#0f172a", width: 3 },
        { type: "line", x1: 200, y1: 360, x2: 1000, y2: 360, stroke: "#0f172a", width: 3 },
        { type: "text", x: 980, y: 350, text: "+X", color: "#0f172a", size: 18 },
        { type: "text", x: 610, y: 100, text: "+Y", color: "#0f172a", size: 18 },
        { type: "text", x: 210, y: 350, text: "-X", color: "#0f172a", size: 18 },
        { type: "text", x: 610, y: 630, text: "-Y", color: "#0f172a", size: 18 },
        { type: "text", x: 750, y: 220, text: "Quadrant I (+,+)", color: "#64748b", size: 16 },
        { type: "text", x: 380, y: 220, text: "Quadrant II (-,+)", color: "#64748b", size: 16 },
        { type: "text", x: 380, y: 480, text: "Quadrant III (-,-)", color: "#64748b", size: 16 },
        { type: "text", x: 750, y: 480, text: "Quadrant IV (+,-)", color: "#64748b", size: 16 }
      ]
    },
    {
      id: "flowchart-diagram",
      title: "Decision Logic Flowchart",
      category: "Design & Engineering",
      desc: "Standard start/end terminal, action steps, decision diamonds, and arrow flows.",
      strokes: [
        { type: "rect", x: 500, y: 80, w: 200, h: 60, stroke: "#10b981", fill: "rgba(16,185,129,0.1)", label: "Start Process", radius: 25 },
        { type: "arrow", x1: 600, y1: 140, x2: 600, y2: 210, stroke: "#64748b" },
        { type: "rect", x: 480, y: 210, w: 240, h: 70, stroke: "#3b82f6", fill: "rgba(59,130,246,0.08)", label: "Step 1: Input Data" },
        { type: "arrow", x1: 600, y1: 280, x2: 600, y2: 360, stroke: "#64748b" },
        { type: "rect", x: 490, y: 360, w: 220, h: 80, stroke: "#f59e0b", fill: "rgba(245,158,11,0.08)", label: "Condition Met?" },
        { type: "arrow", x1: 600, y1: 440, x2: 600, y2: 520, stroke: "#64748b" },
        { type: "rect", x: 500, y: 520, w: 200, h: 60, stroke: "#ef4444", fill: "rgba(239,68,68,0.1)", label: "End / Success", radius: 25 }
      ]
    }
  ],

  useCases: [
    {
      id: "teachers-educators",
      title: "Teachers & Classroom Educators",
      headline: "The Zero-Login Classroom Whiteboard That Works on Any Student Device",
      desc: "Say goodbye to accounts, passwords, and school IT firewall blocks. Create an instant room, share the link or QR code, and let students engage seamlessly on Chromebooks, tablets, or phones.",
      keyBenefits: [
        "Zero student accounts needed (FERPA & COPPA compliant)",
        "Lock background worksheets for annotation",
        "Screen freeze and student raise-hand controls",
        "Works smoothly on budget Chromebooks and iPads"
      ]
    },
    {
      id: "math-science-tutors",
      title: "Math & STEM Tutors",
      headline: "Solve Step-by-Step Equations with Built-In Graphs and Geometry Tools",
      desc: "Designed specifically for online math tutoring. Draw Cartesian coordinate grids, utilize digital protractors, and write math expressions without clunky text boxes.",
      keyBenefits: [
        "1-click Cartesian 4-quadrant graph paper",
        "Smooth stylus support with palm rejection",
        "Multi-color pens for highlighting derivation steps",
        "High-res PDF export to send students after sessions"
      ]
    },
    {
      id: "remote-teams",
      title: "Remote Teams & Agile Squads",
      headline: "Instant Collaborative Whiteboarding Without Corporate License Paywalls",
      desc: "Skip corporate procurement and seat limits. Launch an instant room for sprint retros, brain-dumps, and live architecture mapping with zero friction.",
      keyBenefits: [
        "Unlimited collaborative boards with 0 dollar cost",
        "Live cursor badges showing who is drawing what",
        "Pre-built Sprint Retrospective & Kanban templates",
        "1-click image copy straight to Slack or Notion"
      ]
    },
    {
      id: "software-engineers",
      title: "Software Engineers & Architects",
      headline: "Technical Architecture & System Design Interview Scratchpad",
      desc: "Draw cloud architectures, microservices topologies, and database schemas with orthogonal connectors and high-contrast dark mode canvas.",
      keyBenefits: [
        "High-contrast dark mode canvas for late-night coding",
        "Orthogonal snapped arrows and flowchart nodes",
        "Low input latency for rapid live-sketching",
        "Instant room link sharing for technical interviews"
      ]
    },
    {
      id: "coaches-sports",
      title: "Sports Coaches & Tactical Trainers",
      headline: "Draw Plays on Calibrated Basketball, Soccer, and Football Courts",
      desc: "Animate offensive horn sets, defensive rotations, and dead-ball plays on high-res vector courts. Export PDF playbooks for your squad.",
      keyBenefits: [
        "Basketball, Soccer, and Football court presets",
        "Numbered player tokens and tactical pass lines",
        "Play animation sequence frame replay",
        "Mobile-friendly touch interface for sideline tablets"
      ]
    }
  ],

  comparisons: [
    {
      id: "jamboard-alternatives",
      competitor: "Google Jamboard (Sunset)",
      verdict: "The #1 Modern Free Drop-In Replacement for Discontinued Google Jamboard",
      pros: ["100% Free & Unlimited", "No Google account required", "Loads in 200ms", "Export directly to PNG/PDF/SVG"],
      consVsComp: "Google shut down Jamboard in late 2024. Our platform provides a zero-login web alternative that will never lock your boards."
    },
    {
      id: "miro-alternative-free",
      competitor: "Miro",
      verdict: "Truly Unlimited Free Whiteboard Without Miro's 3-Board Paywall",
      pros: ["Zero board limits (Unlimited canvases)", "No compulsory team sign-up", "No credit card prompts", "Instant WebSockets sync"],
      consVsComp: "Miro locks free users to 3 editable boards and aggressively pushes \$16/user/mo plans. Our whiteboard is completely free forever."
    },
    {
      id: "microsoft-whiteboard-alternative",
      competitor: "Microsoft Whiteboard",
      verdict: "Platform-Agnostic Web Whiteboard Without MS 365 or Entra ID Requirements",
      pros: ["Works natively on Mac, Linux, and Chromebook", "No Microsoft 365 admin approval", "No desktop app install needed"],
      consVsComp: "Microsoft Whiteboard requires corporate Microsoft account logins and often fails across external guests. Ours opens instantly in any browser."
    },
    {
      id: "canva-whiteboard-vs-free",
      competitor: "Canva Whiteboard",
      verdict: "Pure Vector Drawing Engine Without Distracting Template Upsells",
      pros: ["Lightweight, sub-500ms load time", "Zero distracting pro-asset upsells", "Dedicated math and technical tools"],
      consVsComp: "Canva is heavy, requires account creation, and prioritizes marketing templates over responsive freehand stylus sketching."
    },
    {
      id: "excalidraw-vs-free-whiteboard",
      competitor: "Excalidraw",
      verdict: "Precision Vector & Math Grids Alongside Freehand Sketching",
      pros: ["Built-in coordinate grids and graph tools", "Native PDF worksheet annotation", "Classroom teacher station mode"],
      consVsComp: "Excalidraw is great for sketchy developer diagrams, but lacks math-specific coordinate planes, sports tactical boards, and teacher lock controls."
    }
  ],

  guides: [
    {
      id: "how-to-teach-online-with-whiteboard",
      title: "How to Teach Online with a Free Digital Whiteboard",
      readingTime: "5 min read",
      summary: "A practical guide for educators on pairing screen-sharing software (Zoom, Google Meet) with interactive whiteboards, locking background worksheets, and keeping students engaged."
    },
    {
      id: "how-to-collaborate-online-no-signup",
      title: "How to Run Real-Time Collaboration Without Account Sign-Up",
      readingTime: "4 min read",
      summary: "Learn how peer-to-peer ephemeral rooms work, how to share room links securely, and how to manage view-only vs edit permissions during live meetings."
    },
    {
      id: "how-to-draw-math-formulas-online",
      title: "How to Draw Math Formulas & Coordinate Graphs Online",
      readingTime: "6 min read",
      summary: "Step-by-step techniques for math tutors: setting up Cartesian planes, drawing parabolas, aligning fractions, and exporting neat homework solution sets."
    },
    {
      id: "best-drawing-tablets-for-online-teaching",
      title: "Best Budget Drawing Tablets for Online Teaching in 2026",
      readingTime: "7 min read",
      summary: "Comparing Wacom One, Huion Inspiroy, and Apple iPad with Apple Pencil for latency, palm rejection, and price-to-performance ratio."
    },
    {
      id: "how-to-record-whiteboard-explainer-videos",
      title: "How to Record Khan Academy-Style Whiteboard Videos for Free",
      readingTime: "5 min read",
      summary: "Use your browser's native screen recording engine to record canvas ink strokes with microphone audio, zero watermarks, and instant MP4 export."
    }
  ],

  glossary: [
    {
      term: "Infinite Canvas",
      slug: "infinite-canvas",
      def: "An unbounded 2D virtual drawing surface allowing unlimited panning and zooming in any direction without canvas boundaries or page edge limits."
    },
    {
      term: "WebRTC Peer-to-Peer",
      slug: "webrtc-peer-to-peer",
      def: "A browser protocol enabling real-time audio, video, and data transmission directly between client browsers without routing intermediate data through central servers."
    },
    {
      term: "Palm Rejection",
      slug: "palm-rejection",
      def: "Hardware and software filtering that ignores touch events caused by a user's resting palm or wrist while drawing with an active digital stylus."
    },
    {
      term: "Vector Rendering",
      slug: "vector-rendering",
      def: "Drawing technique based on mathematical coordinate formulas rather than pixel bitmaps, ensuring crisp clarity at any zoom magnification."
    },
    {
      term: "Input Latency",
      slug: "sub-5ms-latency",
      def: "The time delay (measured in milliseconds) between physical pen tip contact and the digital ink stroke appearing on screen. Lower latency produces a more natural paper-like feel."
    },
    {
      term: "FERPA Compliance",
      slug: "ferpa-compliance",
      def: "Adherence to the Family Educational Rights and Privacy Act, ensuring educational web tools do not collect, store, or sell student personally identifiable information."
    },
    {
      term: "Dot Voting",
      slug: "dot-voting",
      def: "A visual agile prioritization exercise where workshop participants place colored circular stickers on brainstormed cards to democratically rank ideas."
    },
    {
      term: "Cartesian Plane",
      slug: "coordinate-plane",
      def: "A 2D coordinate system specified by two perpendicular axes (X and Y) with an origin (0,0), used for plotting functions, geometry, and STEM problem solving."
    }
  ],

  faqs: [
    {
      q: "Is this online whiteboard really 100% free?",
      a: "Yes! There are no hidden fees, no subscriptions, no premium paywalls, and no credit card requirements. You have unlimited canvases and unlimited drawing strokes forever."
    },
    {
      q: "Do I or my students need to create an account or sign in?",
      a: "No. You can draw immediately upon opening the site. When sharing a room link, your collaborators can join and draw instantly without registering, signing in, or entering an email."
    },
    {
      q: "How does real-time collaboration work?",
      a: "Click the 'Share Room' button in the top navigation bar. This creates a unique room ID with a shareable URL. Send this link to anyone; when they open it, both of you will see each other's live cursor and strokes in real time."
    },
    {
      q: "Does it work on iPads, tablets, and touch screens?",
      a: "Yes. The canvas supports touch gestures, Apple Pencil, Wacom styluses, and Samsung S-Pen with hardware pressure sensitivity and palm rejection."
    },
    {
      q: "How do I use this whiteboard in Google Meet or Zoom?",
      a: "Simply start your meeting, choose 'Share Screen' -> 'Browser Tab', and select your Free Online Whiteboard tab. Alternatively, paste the room URL into the video call chat so participants can draw directly on the canvas with you."
    },
    {
      q: "Can I export my drawings to PDF or PNG?",
      a: "Yes. Click the 'Export' menu to instantly download high-resolution PNG images, vector SVGs, or printable multi-page PDFs with zero watermarks."
    },
    {
      q: "Is my drawing data private and secure?",
      a: "Yes. By default, your canvas data is saved locally in your browser's IndexedDB/LocalStorage. Ephemeral collaborative sessions run in temporary memory and are deleted once the room is closed."
    },
    {
      q: "What makes this the best alternative to Google Jamboard?",
      a: "Google discontinued Jamboard in late 2024. Our platform provides a zero-login, instant-loading web canvas with sticky notes, freehand pens, and shapes, making it the fastest and simplest replacement for schools and remote teams."
    }
  ]
};
