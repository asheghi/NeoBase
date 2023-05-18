/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Server as SocketIoServer } from "socket.io";
import { config } from "../config";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Server, Socket } from "socket.io";

declare module "socket.io" {
  interface Server {
    filterSocketsByUser(filterFn: (user: any) => boolean): Socket[];
    emitToUser(_id: any, event: any, ...args: any[]): void;
  }
}

const ioServer = new SocketIoServer({
  cors: {
    // todo fix multiple services
    origin: config.cors_origin,
    methods: ["GET", "POST"],
    // allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

ioServer.filterSocketsByUser = (filterFn) =>
  // @ts-ignore
  Object.values(io.sockets.connected).filter(
    // @ts-ignore
    (socket) => socket.handshake && filterFn(socket.conn.request.user)
  );

ioServer.emitToUser = (_id: any, event: any, ...args: any[]) =>
  ioServer
    .filterSocketsByUser((user) => user._id.equals(_id))
    .forEach((socket) => socket.emit(event, ...args));



export const io = ioServer;

export const socketAuthGuard = (socket: any, next: any) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error("unauthorized"));
  }
};
