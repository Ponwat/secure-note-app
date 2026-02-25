'use strict';

const http = require('http');

const { findNoteIndex, deleteNoteAtIndex } = require('../services/note.js');
const { checkAuthorized } = require('../services/authorization.js');

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage }} res
 */
const handleDeleteNote = (req, res) => {
    const isAuthorized = checkAuthorized(req);
    if (!isAuthorized) {
        res.writeHead(401, { 'WWW-Authenticate': 'Bearer' });
        res.end();
        return;
    }

    const [_url, id] = req.url.match('^/api/notes/(\\w+)$');
    const index = findNoteIndex(id);

    const foundResource = index !== undefined;
    if (!foundResource) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
    }

    deleteNoteAtIndex(index);

    res.writeHead(204);
    res.end();
};

module.exports = { handleDeleteNote };
