import { WinstonTransport as AxiomTransport } from '@axiomhq/winston';

const Config = {
    EventSource: 'netlify',
    EventName: 'Netlify Build Logs',
    LoggerTimeoutInMS: 1000,
}

function createLogger({
    AXIOM,
    payload,
}) {
    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        exitOnError: false,
        defaultMeta: { service:  `service-${payload.appName}`},
        transports: [
            new AxiomTransport({
                dataset: AXIOM.DATASET,
                token: AXIOM.TOKEN,
                orgId: AXIOM.ORG_ID
            }),
        ],
    });
    const loggerPayload = {
        evt:{
            name: Config.EventName,
        },
        env: payload.env,
        appName: payload.appName,
    }
    return {
        info: (...args) => {
            loggerPayload.message = args;
            logger.info(loggerPayload)
        },
        warn: (...args) => {
            loggerPayload.message = args;
            logger.warn(loggerPayload)
        },
        send: () => {
            const timeout = setTimeout(() => {
                logger.end();
            }, Config.LoggerTimeoutInMS);

            const completePromise = new Promise((resolve) => {
                logger.on('finish', (...args) => {
                    clearTimeout(timeout);
                    resolve();
                });
            });
    
            return completePromise;
        }
    }
}

export {
    createLogger
}