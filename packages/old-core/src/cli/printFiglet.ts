import * as figlet from "figlet";
import packageInfo from "../../package.json";

export function printFiglet() {
  console.log(figlet.textSync(packageInfo.title));
}
