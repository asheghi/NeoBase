import { Socket } from "socket.io";
import { io } from "../../../server/ioServer";
import { getCollection } from "../../../lib/db-connector";
import { getUserFilter } from "../documents/access-control";
import sift from "sift";
import { getLogger } from "../../../lib";

const logger = getLogger("watch-collection");

export const setupCollectionWatch = () => {
  io.on("connection", (socket: Socket & { request: any }) => {
    logger.log("new socket:", socket.request.user);

    socket.emit("log", "you are connected as", socket.request.user);

    socket.on("ping", () => {
      socket.emit("pong");
    });

    socket.on("watch", async (data) => {
      logger.log("watch called with:", data);

      if (!socket.request.user) {
        logger.log("on Watch, socket.request.user was undefiend");
      }

      const { collection, query } = data ?? {};

      if (!collection) {
        socket.emit("error", "collection must be passed");
        logger.error("watch called without collection");
        return;
      }

      const Collection = await getCollection(collection);
      Collection.db.once("open", async () => {
        const result = await Collection.db.db.command({
          collMod: collection,
          changeStreamPreAndPostImages: { enabled: true },
        });
      });

      const authFilter = await getUserFilter({
        req: socket.request,
        collection,
        operation: "read",
      });

      const filter = { ...(query ?? {}), ...authFilter };

      logger.log("filter:", filter);

      const stream = Collection.watch([], {
        fullDocumentBeforeChange: "required",
        fullDocument: "required",
      });

      stream.on("change", (change) => {
        const { fullDocument, fullDocumentBeforeChange } = change as any;
        const doc = fullDocument ?? fullDocumentBeforeChange;
        if (doc) {
          if ([doc].filter(sift(filter)).length) {
            socket.emit("change", change);
          }
        }
      });

      socket.on("disconnect", () => {
        logger.log("closing watch stream");
        stream.close();
      });
    });

    socket.on("disconnect", () => {
      logger.log("a user disconnected");
    });
  });
};
