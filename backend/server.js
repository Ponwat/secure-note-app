'use strict';

// https://app-tracking.pockethost.io/api/collections/notes/records
// https://quick-note-final.vercel.app/

/**
 * @import { IncomingMessage, ServerResponse } from "http";
 */

const dotenv = require('dotenv');
const http = require('http');

dotenv.config();

const { env, validateEnv } = require('./config/env.js');

const isEnvValid = validateEnv();
if (!isEnvValid) {
    process.exit(1);
}

const { NoteCollection, addNoteCollection, Note, addNote } = require('./services/note.js');
const { configSecret } = require('./services/authorization.js');

const { handleGetNotes } = require('./routes/get-notes.js');
const { handleCreateNote } = require('./routes/create-note.js');
const { handleDeleteNote } = require('./routes/delete-note.js');

const { handleEditNote } = require("./routes/edit-note.js");
const { sendText, writeHead } = require('./helpers/http-response.js');
const { getPathname } = require('./helpers/request-utils.js');
const { isRateLimited } = require('./helpers/rate-limit.js');

const hostname = '0.0.0.0';

const port = env.PORT;
const secretToken = env.SECRET_TOKEN;
const frontendOrigin = env.FRONTEND_ORIGIN;
configSecret(secretToken);

const collection1 = new NoteCollection('notes');
addNoteCollection(collection1);

// const note1 = new Note('Buy a powerbank', 'Must support PD 65W or better', collection1.id);
// addNote(note1);

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse<IncomingMessage> & { req: IncomingMessage }} res
 */
const handleOptions = (req, res) => {
    writeHead(res, 204, {
        'Access-Control-Allow-Origin': frontendOrigin,
        'Vary': 'Origin',
        'Access-Control-Allow-Methods': ['POST', 'GET', 'PATCH', 'OPTIONS', 'DELETE'].join(', '),
        'Access-Control-Allow-Headers': ['Content-Type', 'Authorization'].join(', '),
    });
    res.end();
};


/**
 * @param {IncomingMessage} req
 * @param {ServerResponse<IncomingMessage> & { req: IncomingMessage }} res
 */
const serverHandler = async (req, res) => {
    console.log(`New Request: ${req.method} ${req.url}`);
    // console.log(`Raw request URL: ${req.url}`);
    // console.log(`Raw request method: ${req.method}`);
    // console.log(`Raw request headers: `, req.headers);

    res.setHeader('Access-Control-Allow-Origin', frontendOrigin);
    res.setHeader('Vary', 'Origin');

    const pathname = getPathname(req.url);

    if (req.method === 'OPTIONS') {
        handleOptions(req, res);
        return;
    }

    const isWriteMethod = req.method === 'POST' || req.method === 'PATCH' || req.method === 'DELETE';
    if (isWriteMethod && pathname.startsWith('/api/notes')) {
        const remoteAddress = req.socket.remoteAddress || 'unknown';
        const rateLimitKey = `${remoteAddress}:${req.method}`;
        if (isRateLimited(rateLimitKey)) {
            writeHead(res, 429, {
                'Retry-After': '60',
            });
            res.end();
            return;
        }
    }

    if (pathname === '/api/notes' && req.method === 'GET') {
        await handleGetNotes(req, res);
        return;
    }
    if (pathname === '/api/notes' && req.method === 'POST') {
        await handleCreateNote(req, res);
        return;
    }
    if (pathname.startsWith('/api/notes/') && req.method === 'PATCH') {
        await handleEditNote(req, res);
        return;
    }
    if (pathname.startsWith('/api/notes/') && req.method === 'DELETE') {
        await handleDeleteNote(req, res);
        return;
    }

    if (pathname === '/api/notes') {
        writeHead(res, 405, { 'Allow': 'GET, POST, OPTIONS' });
        res.end();
        return;
    }

    if (pathname.match(/^\/api\/notes\/[A-Za-z0-9_-]+$/)) {
        writeHead(res, 405, { 'Allow': 'PATCH, DELETE, OPTIONS' });
        res.end();
        return;
    }

    sendText(res, 404, 'Not Found');
};

const onStart = async () => {
    console.log(`Server running at http://${hostname}:${port}/`);
    console.log('Authorization secret configured');
}

const server = http.createServer(serverHandler);
server.listen(port, hostname, onStart);
