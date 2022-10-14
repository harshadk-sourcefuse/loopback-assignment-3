import { inject } from '@loopback/core';
import { FindRoute, InvokeMethod, ParseParams, Reject, RequestContext, Send, SequenceActions, SequenceHandler } from '@loopback/rest';
import { LoggerServiceImpl } from './components/logger/logger.service';
import { LogBinders, LOG_LEVEL } from './keys';
import * as dotenv from "dotenv";
import { LogWriterFunction } from './types';
dotenv.config();

const allowedOrigins = process.env.ALLOWED_ORIGIN ? process.env.ALLOWED_ORIGIN.split("||") : [];

export class MySequence implements SequenceHandler {

    constructor(
        @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
        @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
        @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
        @inject(SequenceActions.SEND) public send: Send,
        @inject(SequenceActions.REJECT) public reject: Reject,
        @inject(LogBinders.LOGGER) private logger: LoggerServiceImpl,
        @inject('example.dynamic.value') private dynamicVal: string,
        @inject(LogBinders.LOGGER_PROVIDER) private logWriterFn: LogWriterFunction
    ) {
    }

    async handle(context: RequestContext): Promise<void> {
        const { request, response } = context;
        this.logger.log(LOG_LEVEL.DEBUG, this.dynamicVal)
        let message = `${request.method} ${request.url} started at ${new Date().toString()}.`;
        message = message + ` Referer : ${(request.headers['referer'] || request.headers['host'])}`;
        message = message + ` User-Agent : ${request.headers['user-agent']}`;
        message = message + ` Remote Address : ${request['connection']['remoteAddress']}`;
        this.logWriterFn(LOG_LEVEL.INFO, `${request.method} ${request.url} -------- new request------`);
        this.logger.log(LOG_LEVEL.INFO, message);

        try {
            let referer = (request.headers['referer'] || request.headers['host'])?.replace(/(http|https):\/\//, '');
            if (!allowedOrigins.find(ele => ele.toUpperCase() == referer?.toUpperCase())) {
                // this.send(context,{ 'Not Allowed to access this'});
                this.logger.log(LOG_LEVEL.ERROR, `${request.method} ${request.url} :--: ERROR : ${referer} not matched with allowed origins`);
                response.status(403).send({ message: 'Unauthorized' });
            } else {
                const route = this.findRoute(request);
                const args = await this.parseParams(request, route);

                this.logger.log(LOG_LEVEL.DEBUG, `${request.method} ${request.url} :--: controller : ${route.spec['x-controller-name']} method : ${route.spec['x-operation-name']}`);
                const result = await this.invoke(route, args);
                this.send(response, result);
            }

        } catch (error) {
            this.logger.log(LOG_LEVEL.ERROR, `${request.method} ${request.url} error occured at ${new Date().toString()} ERROR: ${error.message} ${JSON.stringify(error, null, 2)}`);
            this.reject(context, error);
        } finally {
            this.logger.log(LOG_LEVEL.INFO, `${request.method} ${request.url} completed at ${new Date().toString()}`);

        }
    }
}
