export interface ClientToServerEvents {
    "private message": (payload: { content: string; to: string }) => void;
}

export interface ServerToClientEvents {
    "private message": (payload: { content: string; from: string; timestamp: string }) => void;
    "users": (users: Array<{ userID: string; username?: string }>) => void;
    "user connected": (user: { userID: string; username?: string }) => void;
    "user disconnected": (user: { userID: string }) => void;
}