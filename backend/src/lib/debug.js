import Log from 'debug-level'

export function getDebug(identifier) {
  const {fatal, error, warn, info, debug, trace, log} = new Log('app:'+identifier, {})
  return {fatal,error,warn,info,debug,trace,log};
}
