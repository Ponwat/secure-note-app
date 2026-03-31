'use strict';

/**
 * @import { IncomingHttpHeaders } from "http"
 */

/** @type {{ secretToken: String | undefined }} */
const authorization = {
    secretToken: undefined,
};

/**
 * @param {String} token
 */
const configSecret = (token) => {
    authorization.secretToken = token;
};

/**
 * @param {IncomingHttpHeaders} headers
 * @returns {boolean}
 */
const checkAuthorized = (headers) => {
    console.log(headers.authorization);
    if (!headers.authorization) {
        return false;
    }

    const [bearer, secret] = headers.authorization.split(' ', 2);
    if (bearer !== 'Bearer') {
        return false;
    }

    return secret === authorization.secretToken;
}

module.exports = { configSecret, checkAuthorized };
