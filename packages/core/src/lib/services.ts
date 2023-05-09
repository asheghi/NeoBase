import { Server as SocketIoServer } from "socket.io";
import { getFilesCollection } from "./db-connector";
import { Model } from "mongoose";

const cache: {
  io: SocketIoServer | undefined;
  files: Model<any> | undefined;
} = {
  io: undefined,
  files: undefined,
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
  async getFilesCollection() {
    if (!cache["files"]) {
      cache["files"] = await getFilesCollection();
    }
    return cache.files;
  },
};
