const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

// Middleware
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

// ✅ MongoDB Connection (use your password and database name)
mongoose.connect('mongodb+srv://nis4hant4:nishant123@cluster0.ufibeso.mongodb.net/voic3?retryWrites=true&w=majority&appName=Cluster0');

mongoose.connection.once('open', () => {
  console.log('✅ Connected to MongoDB');
}).on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

// ✅ Mongo Schema & Model
const ServerSchema = new mongoose.Schema({ name: String });
const ServerModel = mongoose.model('Server', ServerSchema);

// ✅ Create server API (called from create.html)
app.post('/api/servers', async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: 'Server name is required' });

  const exists = await ServerModel.findOne({ name });
  if (exists) return res.json({ message: 'Server already exists' });

  await ServerModel.create({ name });
  console.log(`✅ Server created: ${name}`);
  res.json({ message: 'Server created' });
});

// ✅ Get all servers API (used in join.html)
app.get('/servers', async (req, res) => {
  const servers = await ServerModel.find();
  res.json(servers);
});

// ✅ WebSocket Chat
io.on('connection', (socket) => {
  console.log('⚡ A user connected');

  socket.on('join-server', (serverName, userName) => {
    socket.join(serverName);
    console.log(`📥 ${userName} joined ${serverName}`);
    io.to(serverName).emit('user-joined', `${userName} joined`);
  });

  socket.on('chat-message', (serverName, msg) => {
    console.log(`💬 Message in ${serverName}: ${msg}`);
    io.to(serverName).emit('chat-message', msg);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected');
  });
});

// ✅ Start Server
server.listen(3000, () => {
  console.log('🚀 Server is running at http://localhost:3000');
});
