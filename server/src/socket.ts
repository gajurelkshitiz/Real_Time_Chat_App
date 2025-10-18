import { Server, Socket } from "socket.io";
import { prisma } from "./prismaClient";
import type { ClientToServerEvents, ServerToClientEvents } from "./types";

/**
 * We'll support two modes:
 * - If the connecting client provides auth { token } we can map token -> userId (JWT)
 * - For simple demo: we use username in handshake to upsert a "User" and map socket.id -> userId
 */

export function setupSocketHandlers(io: Server) {
  // optional: map socket.id -> userId for quick lookup
  const socketToUserId = new Map<string, number>();

  // Middleware: require username in handshake (simplified)
  io.use(async (socket: Socket, next) => {
    const username = socket.handshake.auth?.username;
    if (!username) {
      return next(new Error("invalid username"));
    }
    // Upsert user in DB and store mapping
    let user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      user = await prisma.user.create({ data: { username } });
    }
    socket.data.userId = user.id;
    socket.data.username = user.username;
    socketToUserId.set(socket.id, user.id);
    next();
  });

  io.on("connection", (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    console.log("connected", socket.id, "username:", socket.data.username);

    // When a client connects, send currently connected users
    const users = Array.from(io.of("/").sockets).map(([id, s]) => {
      const sock = s as Socket;
      return {
        userID: id,
        username: sock.data.username,
      };
    });
    socket.emit("users", users);

    // notify others
    socket.broadcast.emit("user connected", {
      userID: socket.id,
      username: socket.data.username,
    });

    // handle private message
    socket.on("private message", async ({ content, to }: { content: string; to: string }) => {
      // emit to the target socket id
      socket.to(to).emit("private message", {
        content,
        from: socket.id,
        timestamp: new Date().toISOString(),
      });

      // persist message to DB (if mapping present)
      try {
        const fromId = socket.data.userId as number;
        const toSocket = io.of("/").sockets.get(to);
        let toUserId: number | undefined;
        if (toSocket) {
          toUserId = (toSocket as Socket).data.userId;
        }
        // If we have both numeric IDs, create DB record. If not, skip DB write for demo.
        if (fromId && toUserId) {
          await prisma.message.create({
            data: {
              content,
              fromId,
              toId: toUserId,
            },
          });
        }
      } catch (err) {
        console.error("Failed to persist message", err);
      }
    });

    socket.on("disconnect", (reason) => {
      socketToUserId.delete(socket.id);
      socket.broadcast.emit("user disconnected", { userID: socket.id });
    });
  });
}
