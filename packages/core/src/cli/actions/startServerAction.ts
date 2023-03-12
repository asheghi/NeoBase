import { startServer } from "../../server/index.js";

export const startServerAction = () => {
  console.log("Starting Server ...");
  startServer();
};
