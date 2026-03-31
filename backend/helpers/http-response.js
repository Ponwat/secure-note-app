'use strict';

/**
 * @param {import('http').ServerResponse} res
 * @param {number} statusCode
 * @param {Record<string, string>} [headers]
 */
const writeHead = (res, statusCode, headers = {}) => {
    res.writeHead(statusCode, headers);
};

/**
 * @param {import('http').ServerResponse} res
 * @param {number} statusCode
 * @param {unknown} body
 * @param {Record<string, string>} [headers]
 */
const sendJson = (res, statusCode, body, headers = {}) => {
    writeHead(res, statusCode, {
        'Content-Type': 'application/json',
        ...headers,
    });
    res.end(JSON.stringify(body));
};

/**
 * @param {import('http').ServerResponse} res
 * @param {number} statusCode
 * @param {string} body
 * @param {Record<string, string>} [headers]
 */
const sendText = (res, statusCode, body, headers = {}) => {
    writeHead(res, statusCode, {
        'Content-Type': 'text/plain',
        ...headers,
    });
    res.end(body);
};

module.exports = { sendJson, sendText, writeHead };
