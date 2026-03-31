'use strict';

/**
 * @import { IncomingMessage, ServerResponse } from "http"
 */

const { findNoteIndex, deleteNoteAtIndex } = require('../services/note.js');
const { checkAuthorized } = require('../services/authorization.js');
const { pocketHost } = require("../config/pocket-host.js");
const { env } = require("../config/env.js");

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse<IncomingMessage> & { req: IncomingMessage }} res
 */
const handleDeleteNote = async (req, res) => {
    const isAuthorized = checkAuthorized(req.headers);
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

    const deletedNote = deleteNoteAtIndex(index);
    await pocketHost.delete(env.POCKET_HOST_TOKEN, deletedNote.id);

    res.writeHead(204);
    res.end();
};

module.exports = { handleDeleteNote };
