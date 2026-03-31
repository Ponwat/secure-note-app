'use strict';

/**
 * @import { IncomingMessage, ServerResponse } from "http"
 */

const { findNoteIndex, deleteNoteAtIndex } = require('../services/note.js');
const { checkAuthorized } = require('../services/authorization.js');
const { pocketHost } = require("../config/pocket-host.js");
const { env } = require("../config/env.js");
const { syncPocketHostNotes } = require('../services/sync-pocket-host-notes.js');
const { getNoteIdFromUrl } = require('../helpers/request-utils.js');
const { sendJson, sendText, writeHead } = require('../helpers/http-response.js');
const { UpstreamError } = require('../helpers/upstream-error.js');

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse<IncomingMessage> & { req: IncomingMessage }} res
 */
const handleDeleteNote = async (req, res) => {
    const isAuthorized = checkAuthorized(req.headers);
    if (!isAuthorized) {
        writeHead(res, 401, { 'WWW-Authenticate': 'Bearer' });
        res.end();
        return;
    }

    const id = getNoteIdFromUrl(req.url);
    if (!id) {
        sendText(res, 404, 'Not Found');
        return;
    }

    await syncPocketHostNotes();

    const index = findNoteIndex(id);

    const foundResource = index !== undefined;
    if (!foundResource) {
        sendText(res, 404, 'Not Found');
        return;
    }

    try {
        await pocketHost.delete(env.POCKET_HOST_TOKEN, id);
        deleteNoteAtIndex(index);

        writeHead(res, 204);
        res.end();
    } catch (error) {
        if (error instanceof UpstreamError) {
            sendJson(res, error.statusCode, {
                'error': 'Upstream error',
                'message': error.message,
            });
            return;
        }

        sendJson(res, 500, {
            'error': 'Internal server error',
            'message': 'Unexpected error while deleting note',
        });
    }
};

module.exports = { handleDeleteNote };
