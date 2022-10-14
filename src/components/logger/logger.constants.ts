import winston from "winston";
import { LogWriterFunction } from "../../types";

export const logger = winston.createLogger({
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

export interface keyable {
    [key: string]: any  
}
