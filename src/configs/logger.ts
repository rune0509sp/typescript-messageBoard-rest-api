import appRoot from 'app-root-path';
import path from 'path';
import fs from 'fs';
import winston, {config} from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';


const dirName = process.env.NODE_ENV + 'Log';
const logDir = path.join(appRoot.path + '/' + dirName);

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFormat = winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.align(),
    winston.format.prettyPrint(),
);

const infoTransport = new DailyRotateFile({
  filename: 'info-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  dirname: logDir,
  level: 'info',
});

const errorTransport = new DailyRotateFile({
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  dirname: logDir,
  level: 'error',
});

const debugTransport = new DailyRotateFile({
  filename: 'bebug-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  dirname: logDir,
  level: 'debug',
});

export const logger = winston.createLogger({
  format: logFormat,
  transports: [infoTransport, errorTransport, debugTransport],
});

export const stream = {
  write: (message: string): void => {
    logger.info(message);
  },
};
