import express from 'express';
import http from 'http';
import path from 'path';
import { Server as IOServer, Socket } from 'socket.io';

interface ClientToServerEvents {
  'chat message': (msg: string) => void;
}

interface ServerToClientEvents {
  'chat message': (msg: string) => void;
  'welcome': (msg: string) => void;
}

const app = express();
const server = http.createServer(app);

const io = new IOServer<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
  console.log(`User connected with ID: ${socket.id}`);

  // server listens for client -> server events
  socket.on('chat message', (msg: string) => {
    // broadcast to all clients (server -> client event)
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
server.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});

