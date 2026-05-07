import { io, Socket } from "socket.io-client";

const API_HOST = process.env.API_HOST ?? "http://localhost:3000";

let socket: Socket | null = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(API_HOST, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });
  }
  return socket;
};

export const getSocket = () => socket;
