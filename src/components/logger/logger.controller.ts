import { inject } from '@loopback/core';
import {
    Request,
    RestBindings,
    get,
    response,
    ResponseObject,
} from '@loopback/rest';

/**
 * OpenAPI response for logInfo()
 */
const LOG_RESPONSE: ResponseObject = {
    description: 'Logger Response',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'LoggerResponse',
                properties: {
                    log_types: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' }
                            }
                        }
                    },
                    date: { type: 'string' },
                    url: { type: 'string' },
                    headers: {
                        type: 'object',
                        properties: {
                            'Content-Type': { type: 'string' },
                        },
                        additionalProperties: true,
                    },
                },
            },
        },
    },
};

/**
 * A simple controller to bounce back http requests
 */
export class LoggerController {
    constructor(@inject(RestBindings.Http.REQUEST) private req: Request) { }

    // Map to `GET /log/info`
    @get('/log/info')
    @response(200, LOG_RESPONSE)
    logInfo(): object {
        // Reply with a log_type, the current time, the url, and request headers
        return {
            log_type: [
                { name: 'INFO' },
                { name: 'DEBUG' },
                { name: 'WARNING' },
                { name: 'ERROR' },
            ],
            date: new Date(),
            url: this.req.url,
            headers: Object.assign({}, this.req.headers),
        };
    }
}
