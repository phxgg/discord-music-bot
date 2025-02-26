import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: 'discord-music-bot' },
  transports: [
    // new transports.File({ filename: 'logs/debug.log', level: 'debug' }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

// if (process.env.NODE_ENV !== 'production') {
logger.add(
  new transports.Console({
    // level: 'debug',
    format: format.combine(format.colorize(), format.simple()),
  }),
);
// }

export default logger;
