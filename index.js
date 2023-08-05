import { createLogger } from "./logger.js";

export default {
    onEnd: async({constants, packageJson, error}) => {
        const payload = {
            env: process.env.ENVIRONMENT,
            appName: packageJson.name,
            siteId: constants.SITE_ID
        };
        const logger = createLogger({
            AXIOM:{
                DATASET: process.env.AXIOM_DATASET,
                TOKEN: process.env.AXIOM_TOKEN,
                ORG_ID: process.env.AXIOM_ORG_ID,
            },
            payload,
        });

        if (error) {
            logger.info(`Deploy error: ${error.shortMessage}`);
        } else {
            logger.info(`Deploy success`);
        }
        await logger.send();
    }
}