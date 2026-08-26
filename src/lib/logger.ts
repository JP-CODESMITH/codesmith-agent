type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) ?? 'info'

function shouldLog(level: LogLevel): boolean {
  return LEVELS[level] >= LEVELS[currentLevel]
}

export const logger = {
  debug(msg: string, ...args: unknown[]) {
    if (shouldLog('debug')) console.debug(`[DEBUG] ${msg}`, ...args)
  },
  info(msg: string, ...args: unknown[]) {
    if (shouldLog('info')) console.log(`[INFO] ${msg}`, ...args)
  },
  warn(msg: string, ...args: unknown[]) {
    if (shouldLog('warn')) console.warn(`[WARN] ${msg}`, ...args)
  },
  error(msg: string, ...args: unknown[]) {
    if (shouldLog('error')) console.error(`[ERROR] ${msg}`, ...args)
  },
}
