import winston from 'winston';
import { LOG_LEVEL } from '../../keys';
import { LogWriterFunction } from "../../types";
import * as dotenv from "dotenv";
dotenv.config();

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL?.toLowerCase() || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf((info) => {
                    return [info.timestamp, info.level, info.message].join(" ");
                })
            )
        })
    ]
});

export interface loggerService {
    log: LogWriterFunction;
}

export class LoggerServiceImpl {
    logger: winston.Logger = logger;

    constructor() {

    }

    log: LogWriterFunction = (level: number, msg: string) => {
        switch (level) {
            case LOG_LEVEL.INFO:
                this.logger.info(msg);
                break;
            case LOG_LEVEL.WARN:
                this.logger.warn(msg);
                break;
            case LOG_LEVEL.DEBUG:
                this.logger.debug(msg);
                break;
            case LOG_LEVEL.ERROR:
                this.logger.error(msg);
                break;
            default:
                break;
        }
    }
}