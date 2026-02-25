'use strict';

const http = require('http');

const { Note, addNote } = require('../services/note.js');
const { checkAuthorized } = require('../services/authorization.js');

const { getRequestBody } = require('../helpers/get-request-body.js');

/**
 * @param {String} body
 * @returns {{ title: String | undefined, content: String | undefined } | undefined}
 */
const parseCreateNoteBody = (body) => {
    try {
        return JSON.parse(body);
    } catch {
        return undefined;
    }
};

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage }} res
 */
const handleCreateNote = async (req, res) => {
    const isAuthorized = checkAuthorized(req.headers);
    if (!isAuthorized) {
        res.writeHead(401, { 'WWW-Authenticate': 'Bearer' });
        res.end();
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

    /** @type {String} */
    const body = await getRequestBody(req);

    /** @type {{ title: String | undefined , content: String | undefined } | undefined} */
    const note = parseCreateNoteBody(body);


    const properlyParsed = note.title !== undefined && note.content !== undefined;
    if (!properlyParsed) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            'error': 'Bad request',
            'message': 'Request body could not be read properly',
        }));
        return;
    }

    const newNote = new Note(note.title, note.content);
    addNote(newNote);

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 'message': 'New note created', 'note': newNote }));
};

module.exports = {
    handleCreateNote
};
