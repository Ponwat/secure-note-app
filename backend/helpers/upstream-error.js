'use strict';

class UpstreamError extends Error {
    /**
     * @param {string} message
     * @param {number} statusCode
     */
    constructor(message, statusCode = 502) {
        super(message);
        this.name = 'UpstreamError';
        this.statusCode = statusCode;
    }
}

module.exports = { UpstreamError };
