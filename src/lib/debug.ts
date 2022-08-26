import DebugLevel from "debug-level";

export function getLogger(identifier) {
  const { fatal, error, warn, info, debug, trace, log } = DebugLevel(
    `app:${identifier}`,
    {}
  );
  return { fatal, error, warn, info, debug, trace, log };
}

export default getLogger;
