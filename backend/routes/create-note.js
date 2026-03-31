'use strict';

/**
 * @import { IncomingMessage, ServerResponse } from "http"
 */

const { Note, addNote } = require('../services/note.js');
const { checkAuthorized } = require('../services/authorization.js');

const { getRequestBody } = require('../helpers/get-request-body.js');
const { pocketHost } = require("../config/pocket-host.js");
const { env } = require("../config/env.js");
const { hasJsonContentType, validateNotePayload } = require('../helpers/request-utils.js');
const { sendJson } = require('../helpers/http-response.js');
const { UpstreamError } = require('../helpers/upstream-error.js');

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse<IncomingMessage> & { req: IncomingMessage }} res
 */
const handleCreateNote = async (req, res) => {
    const isAuthorized = checkAuthorized(req.headers);
    if (!isAuthorized) {
        res.writeHead(401, { 'WWW-Authenticate': 'Bearer' });
        res.end();
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

        const createdNoteObject = await pocketHost.create(env.POCKET_HOST_TOKEN, {
            ...validation.value,
            user_id: env.USER_ID,
        });

        const newNote = Note.fromObject(createdNoteObject);
        addNote(newNote);

        sendJson(res, 201, { 'message': 'New note created', 'note': newNote });
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
            'message': 'Unexpected error while creating note',
        });
        return;
    }
};

module.exports = {
    handleCreateNote
};
