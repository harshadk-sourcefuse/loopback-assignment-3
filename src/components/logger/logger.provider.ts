import { config, Getter, inject, Provider, ValueOrPromise } from "@loopback/core";
import winston from "winston";
import { LOG_LEVEL } from "../../keys";
import { LogWriterFunction } from "../../types";
import { keyable, logger } from "./logger.constants";


export class LogActionProvider implements Provider<LogWriterFunction> {

    logger: winston.Logger = logger;

    constructor(@inject('example.provider.log.conf') private loggerConf: keyable) {

    }

    value(): LogWriterFunction {
        return (level: number, msg: string) => {
            if (this.loggerConf['shouldLog']) {
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
    }
}