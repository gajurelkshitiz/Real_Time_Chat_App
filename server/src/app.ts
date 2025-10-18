import express from "express";
import http from "http";
import path from 'path';
import { Server as IOServer, Socket } from 'socket.io';
import cors from "cors";
import { prisma } from "./prismaClient";
import { setupSocketHandlers } from "./socket";
import authRoutes from "./routes/auth";
import dotenv from "dotenv";
import type { ClientToServerEvents, ServerToClientEvents } from "./types";

dotenv.config();


const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.use("/auth", authRoutes);



// create HTTP server and attach socket.io
const server = http.createServer(app);

const io = new IOServer<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// attach io to global or pass to modules
setupSocketHandlers(io);




const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
server.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});






// ----------------------------- ### ----------------------- //

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
//   console.log(`User connected with ID: ${socket.id}`);

//   // server listens for client -> server events
//   socket.on('chat message', (msg: string) => {
//     // broadcast to all clients (server -> client event)
//     io.emit('chat message', msg);
//   });

//   socket.on('disconnect', () => {
//     console.log('User Disconnected', socket.id);
//   });
// });

// const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
// server.listen(PORT, () => {
//   console.log(`listening on port: ${PORT}`);
// });

