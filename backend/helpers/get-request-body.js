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

        /** 
         * @param {String} chunk 
         */
        const onData = (chunk) => {
            body += chunk;

            if (body.length > 1_000_000) {
                req.destroy();
                reject(new Error('Payload too large'));
            }
        };
        req.on('data', onData);

        const onEnd = () => {
            resolve(body);
        };
        req.on('end', onEnd);

        req.on('error', () => resolve(''));
    });
};

module.exports = { getRequestBody };
