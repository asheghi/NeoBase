import figlet from "figlet";
import { manifest } from "../lib/manifest.js";

export function printFiglet() {
  console.log(figlet.textSync(manifest.title));
}
