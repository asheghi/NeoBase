import { Server as SocketIoServer } from "socket.io";

const cache: {
  io: SocketIoServer | undefined;
} = {
  io: undefined,
};
export const Services = {
  getIoService(): SocketIoServer {
    if (!cache.io) {
      throw new Error("IO object is not set");
    }
    return cache.io;
  },
  setIoService(io: SocketIoServer) {
    cache.io = io;
  },
};
