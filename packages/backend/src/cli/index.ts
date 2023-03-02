import { program } from "commander";
import { printFiglet } from "./printFiglet";
import { startServerAction } from "./actions/startServerAction";

printFiglet();

program
  .command("start")
  .description("start server")
  .action(() => {
    startServerAction();
  });

program.parse();
