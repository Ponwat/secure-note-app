'use strict';

/**
 * @import { IncomingMessage, ServerResponse } from "http"
 */

const { Note, addNote, findNoteIndex, editNoteAtIndex } = require('../services/note.js');
const { checkAuthorized } = require('../services/authorization.js');

const { getRequestBody } = require('../helpers/get-request-body.js');
const { pocketHost } = require("../config/pocket-host.js");
const { env } = require("../config/env.js");
const { editNote } = require("../../frontend/scripts/api.js");

/**
 * @param {String} body
 * @returns {{ title: String | undefined, content: String | undefined } | undefined}
 */
const parseEditNoteBody = (body) => {
    try {
        return JSON.parse(body);
    } catch {
        return undefined;
    }
};

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

    const [_url, id] = req.url.match('^/api/notes/(\\w+)$');
    const index = findNoteIndex(id);

    const foundResource = index !== undefined;
    if (!foundResource) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
    }

    const hasJSONContentType = req.headers['content-type'] === 'application/json';
    if (!hasJSONContentType) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            'error': 'Bad request',
            'message': 'Content-Type is not application/json',
        }));
        return;
    }

    const body = await getRequestBody(req);

    const note = parseEditNoteBody(body);

    const properlyParsed = note.title !== undefined && note.content !== undefined;
    if (!properlyParsed) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            'error': 'Bad request',
            'message': 'Request body could not be read properly',
        }));
        return;
    }

    const updatedNoteObject = await pocketHost.update(env.POCKET_HOST_TOKEN, id, {...note, user_id: 66010449});

    const editedNote = editNoteAtIndex(index, updatedNoteObject);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 'message': 'Edited note', 'note': editedNote }));
};

module.exports = {
    handleEditNote
};
