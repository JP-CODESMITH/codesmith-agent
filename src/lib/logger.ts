// Define the supported log levels in order of severity
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

// Map each log level to a numeric priority for comparison (higher = more severe)
const LEVELS: Record<LogLevel, number> = {
  debug: 0, // Lowest priority - detailed diagnostic info
  info: 1,  // General operational information
  warn: 2,  // Potential issues that don't prevent operation
  error: 3, // Critical errors that may cause failures
}

// Get the current minimum log level from environment variables, defaulting to 'info'
const currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) ?? 'info'

// Check if a message at the given level should be logged based on the current threshold
function shouldLog(level: LogLevel): boolean {
  return LEVELS[level] >= LEVELS[currentLevel]
}

// Logger utility object providing level-filtered console output
export const logger = {
  // Log debug-level messages (only if current level is 'debug')
  debug(msg: string, ...args: unknown[]) {
    if (shouldLog('debug')) console.debug(`[DEBUG] ${msg}`, ...args)
  },
  // Log info-level messages (only if current level is 'info' or lower)
  info(msg: string, ...args: unknown[]) {
    if (shouldLog('info')) console.log(`[INFO] ${msg}`, ...args)
  },
  // Log warning-level messages (only if current level is 'warn' or lower)
  warn(msg: string, ...args: unknown[]) {
    if (shouldLog('warn')) console.warn(`[WARN] ${msg}`, ...args)
  },
  // Log error-level messages (only if current level is 'error' or lower)
  error(msg: string, ...args: unknown[]) {
    if (shouldLog('error')) console.error(`[ERROR] ${msg}`, ...args)
  },
}
