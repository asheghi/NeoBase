import packageInfo from "@neobase/monorepo/package.json";
import * as figlet from "figlet";

export function printFiglet() {
  console.log(figlet.textSync(packageInfo.title));
}
