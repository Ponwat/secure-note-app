'use strict';

/**
 * @import { IncomingMessage, ServerResponse } from "http";
 */

const { getNotes } = require('../services/note.js');
const { syncPocketHostNotes } = require("../services/sync-pocket-host-notes.js");

/**
 * @param {IncomingMessage} _req
 * @param {ServerResponse<IncomingMessage> & { req: IncomingMessage }} res
 */
const handleGetNotes = async (_req, res) => {
    await syncPocketHostNotes();

    const notes = getNotes();

    res.writeHead(200, { 
        'Content-Type': 'application/json',
    });
    res.end(JSON.stringify(notes));
};


module.exports = { handleGetNotes };
