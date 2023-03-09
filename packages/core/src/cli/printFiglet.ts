import * as figlet from "figlet";
import { manifest } from "../lib/manifest";

export function printFiglet() {
  console.log(figlet.textSync(manifest.title));
}
