const express = require('express');
const http = require('http');
const path = require('path');
const { WebSocketServer } = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3000;

// In-memory room store for real-time collaboration
// rooms[roomId] = { strokes: [], users: {} }
const rooms = new Map();

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const roomId = url.searchParams.get('room') || 'default';
  const userId = Math.random().toString(36).substring(2, 9);
  const userColor = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'][
    Math.floor(Math.random() * 7)
  ];

  if (!rooms.has(roomId)) {
    rooms.set(roomId, { history: [], clients: new Set() });
  }

  const room = rooms.get(roomId);
  room.clients.add(ws);
  ws.roomId = roomId;
  ws.userId = userId;
  ws.userColor = userColor;

  // Send initial handshake + canvas history to the newly connected user
  ws.send(JSON.stringify({
    type: 'init',
    userId,
    userColor,
    roomId,
    userCount: room.clients.size,
    history: room.history
  }));

  // Broadcast user count update
  broadcastToRoom(roomId, {
    type: 'user_count',
    userCount: room.clients.size
  });

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === 'draw_stroke') {
        room.history.push(data.stroke);
        // Cap history to prevent memory explosion on long sessions
        if (room.history.length > 2500) {
          room.history.shift();
        }
        broadcastToRoom(roomId, data, ws);
      } else if (data.type === 'cursor_move') {
        broadcastToRoom(roomId, {
          type: 'cursor_move',
          userId: ws.userId,
          userColor: ws.userColor,
          x: data.x,
          y: data.y,
          name: data.name || `User ${ws.userId.slice(0, 4)}`
        }, ws);
      } else if (data.type === 'clear_canvas') {
        room.history = [];
        broadcastToRoom(roomId, { type: 'clear_canvas' });
      } else if (data.type === 'undo') {
        if (room.history.length > 0) {
          room.history.pop();
          broadcastToRoom(roomId, { type: 'sync_history', history: room.history });
        }
      } else if (data.type === 'load_template') {
        room.history = data.strokes || [];
        broadcastToRoom(roomId, { type: 'sync_history', history: room.history });
      } else if (data.type === 'delete_note' || data.type === 'sync_notes') {
        broadcastToRoom(roomId, data, ws);
      }
    } catch (err) {
      console.error('WebSocket message parsing error:', err);
    }
  });

  ws.on('close', () => {
    room.clients.delete(ws);
    if (room.clients.size === 0) {
      // Keep room state for 1 hour or clean up if inactive
    } else {
      broadcastToRoom(roomId, {
        type: 'user_leave',
        userId: ws.userId,
        userCount: room.clients.size
      });
    }
  });
});

function broadcastToRoom(roomId, data, senderWs = null) {
  const room = rooms.get(roomId);
  if (!room) return;
  const payload = JSON.stringify(data);
  for (const client of room.clients) {
    if (client !== senderWs && client.readyState === 1) { // 1 = OPEN
      client.send(payload);
    }
  }
}

// Serve static assets from public
app.use(express.static(path.join(__dirname, 'public')));

// SEO & SILO routes - send index.html with client routing support
const siloRoutes = [
  '/',
  '/tools', '/tools/:id',
  '/templates', '/templates/:id',
  '/use-cases', '/use-cases/:id',
  '/compare', '/compare/:id',
  '/guides', '/guides/:id',
  '/glossary', '/glossary/:id',
  '/faq', '/faq/:id',
  '/integrations', '/integrations/:id',
  '/about', '/privacy-policy', '/terms-of-service', '/security', '/contact', '/html-sitemap'
];

siloRoutes.forEach(route => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
});

// JSON API endpoint for SEO sitemap & programmatic tools
app.get('/api/sitemap', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'js', 'silo-data.js'));
});

server.listen(PORT, () => {
  console.log(`======================================================`);
  console.log(`🚀 Free Online Whiteboard is running live at:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`======================================================`);
});
