import Log from "debug-level";
export function getLogger(name) {
  const debugLevel = new Log("app:", name);
  const { debug, info, fatal, error, warn, trace, log } = debugLevel;
  return { debug, info, fatal, error, warn, trace, log };
}
