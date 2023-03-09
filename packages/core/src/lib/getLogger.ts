// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import DebugLevel from "debug-level";

// todo 2 remove dependency implement it yourself!

export const getLogger = (identifier: string | null) => {
  if (process.env.NODE_ENV === "test") {
    const dummy = () => {
      // do nothing you dummy
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
    `app` + identifier ? ":" + identifier : "",
    {}
  );
  return { fatal, error, warn, info, debug, trace, log };
};
