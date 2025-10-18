// import { io, Socket } from "socket.io-client";
import io from "socket.io-client";

const URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
export const socket = io(URL, { autoConnect: false });
(socket as any).onAny((event: string, ...args: any[]) => {
  console.debug("[socket event]", event, args);
});

console.log("REACT_APP_SERVER_URL:", process.env.REACT_APP_SERVER_URL);
