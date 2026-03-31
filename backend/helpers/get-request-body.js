'use strict';

/**
 * import { IncomingMessage } from 'http';
 */

/**
 * @param {IncomingMessage} req
 * @return {Promise<string>}
 */
const getRequestBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        let didReject = false;

        /** 
         * @param {String} chunk 
         */
        const onData = (chunk) => {
            body += chunk;

            if (body.length > 1_000_000) {
                didReject = true;
                req.destroy();
                const error = new Error('Payload too large');
                error.statusCode = 413;
                reject(error);
            }
        };
        req.on('data', onData);

        const onEnd = () => {
            if (didReject) {
                return;
            }
            resolve(body);
        };
        req.on('end', onEnd);

        req.on('error', (error) => {
            if (didReject) {
                return;
            }
            reject(error);
        });
    });
};

module.exports = { getRequestBody };
