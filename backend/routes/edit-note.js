'use strict';

/**
 * @import { IncomingMessage, ServerResponse } from "http"
 */

const { findNoteIndex, editNoteAtIndex } = require('../services/note.js');
const { checkAuthorized } = require('../services/authorization.js');

const { getRequestBody } = require('../helpers/get-request-body.js');
const { pocketHost } = require("../config/pocket-host.js");
const { env } = require("../config/env.js");
const { syncPocketHostNotes } = require('../services/sync-pocket-host-notes.js');
const { getNoteIdFromUrl, hasJsonContentType, validateNotePayload } = require('../helpers/request-utils.js');
const { sendJson, sendText } = require('../helpers/http-response.js');
const { UpstreamError } = require('../helpers/upstream-error.js');

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse<IncomingMessage> & { req: IncomingMessage }} res
 */
const handleEditNote = async (req, res) => {
    const isAuthorized = checkAuthorized(req.headers);
    if (!isAuthorized) {
        res.writeHead(401, { 'WWW-Authenticate': 'Bearer' });
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

    const hasJSONContentType = hasJsonContentType(req.headers['content-type']);
    if (!hasJSONContentType) {
        sendJson(res, 415, {
            'error': 'Bad request',
            'message': 'Content-Type must be application/json',
        });
        return;
    }

    try {
        const body = await getRequestBody(req);
        const note = JSON.parse(body);
        const validation = validateNotePayload(note);
        if (!validation.ok) {
            sendJson(res, 400, {
                'error': 'Bad request',
                'message': validation.message,
            });
            return;
        }

        const updatedNoteObject = await pocketHost.update(env.POCKET_HOST_TOKEN, id, {
            ...validation.value,
            user_id: env.USER_ID,
        });

        const editedNote = editNoteAtIndex(index, updatedNoteObject);

        sendJson(res, 200, { 'message': 'Edited note', 'note': editedNote });
    } catch (error) {
        if (error instanceof SyntaxError) {
            sendJson(res, 400, {
                'error': 'Bad request',
                'message': 'Request body must be valid JSON',
            });
            return;
        }

        if (error && error.statusCode === 413) {
            sendJson(res, 413, {
                'error': 'Payload too large',
                'message': 'Request payload exceeds 1MB limit',
            });
            return;
        }

        if (error instanceof UpstreamError) {
            sendJson(res, error.statusCode, {
                'error': 'Upstream error',
                'message': error.message,
            });
            return;
        }

        sendJson(res, 500, {
            'error': 'Internal server error',
            'message': 'Unexpected error while editing note',
        });
    }
};

module.exports = {
    handleEditNote
};
