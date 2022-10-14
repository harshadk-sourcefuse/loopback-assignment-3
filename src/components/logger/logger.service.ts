import winston from 'winston';
import { LOG_LEVEL } from '../../keys';
import { LogWriterFunction } from "../../types";
import * as dotenv from "dotenv";
import { config, Getter } from '@loopback/core';
import { keyable, logger } from './logger.constants';
dotenv.config();


export class LoggerServiceImpl {
    logger: winston.Logger = logger;

    @config.getter()
    private loggerConfig: Getter<keyable>;

    constructor() {

    }

    log: LogWriterFunction = async (level: number, msg: string) => {
        const loggerConf: keyable = await this.loggerConfig();
        if (loggerConf['shouldLog']) {
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