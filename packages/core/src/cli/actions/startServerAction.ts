import { startServer } from "../../server/index";

export const startServerAction = () => {
  console.log("Starting Server ...");
  startServer();
};
