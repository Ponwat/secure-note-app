'use strict';

const http = require('http');

const { getNotes } = require('../services/note.js');

/**
 * @param {http.IncomingMessage} _req
 * @param {http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage }} res
 */
const handleGetNotes = (_req, res) => {
    const notes = getNotes();

    res.writeHead(200, { 
        'Content-Type': 'application/json',
    });
    res.end(JSON.stringify(notes));
};


module.exports = { handleGetNotes };
