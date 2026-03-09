type LogMeta = Record<string, unknown> | undefined;

function format(meta?: LogMeta) {
  return meta ? ` ${JSON.stringify(meta)}` : "";
}

export const logger = {
  info(message: string, meta?: LogMeta) {
    console.info(`[INFO] ${message}${format(meta)}`);
  },
  warn(message: string, meta?: LogMeta) {
    console.warn(`[WARN] ${message}${format(meta)}`);
  },
  error(message: string, meta?: LogMeta) {
    console.error(`[ERROR] ${message}${format(meta)}`);
  },
};