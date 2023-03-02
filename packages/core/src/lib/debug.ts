import DebugLevel from "debug-level";

export function getLogger(identifier) {
  if (process.env.NODE_ENV === "test") {
    const dummy = () => {
      ("");
    };

    return {
      fatal: dummy,
      error: dummy,
      warn: dummy,
      info: dummy,
      debug: dummy,
      trace: dummy,
      log: dummy,
    };
  }
  const { fatal, error, warn, info, debug, trace, log } = DebugLevel(
    `app:${identifier}`,
    {}
  );
  return { fatal, error, warn, info, debug, trace, log };
}

export default getLogger;
