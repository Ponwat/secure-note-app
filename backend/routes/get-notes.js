'use strict';

/**
 * @import { IncomingMessage, ServerResponse } from "http";
 */

const { getNotes } = require('../services/note.js');
const { syncPocketHostNotes } = require("../services/sync-pocket-host-notes.js");
const { sendJson } = require('../helpers/http-response.js');
const { UpstreamError } = require('../helpers/upstream-error.js');

/**
 * @param {IncomingMessage} _req
 * @param {ServerResponse<IncomingMessage> & { req: IncomingMessage }} res
 */
const handleGetNotes = async (_req, res) => {
    try {
        await syncPocketHostNotes();

        const notes = getNotes();

        sendJson(res, 200, notes);
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
            'message': 'Unexpected error while syncing notes',
        });
    }
};


module.exports = { handleGetNotes };
