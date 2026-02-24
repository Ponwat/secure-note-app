'use strict';

// https://app-tracking.pockethost.io/api/collections/notes/records
// https://quick-note-final.vercel.app/

require('dotenv').config();
const { configDotenv } = require('dotenv');
const http = require('http');

const { Note, NoteCollection, findNote, findNoteIndex, deleteNoteAtIndex } = require('./service.js');
const services = require('./service.js');

const port = process.env.PORT;
const secretToken = process.env.SECRET_TOKEN;

if (port === undefined || secretToken === undefined) {
    console.log('PORT or SECRET_TOKEN are undefined in .env');
    process.exit(1);
}

const hostname = '127.0.0.1';

/**
 * @param {http.IncomingHttpHeaders} headers
 * @returns {boolean}
 */
const checkAuthorized = (headers) => {
    if (!headers.authorization) {
        return false;
    }

    const [bearer, secret] = headers.authorization.split(' ', 2);
    if (bearer !== 'Bearer') {
        return false;
    }

    return secret === secretToken;
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage }} res
 */
const handleGetNotes = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(notes));
};

/**
 * @param {http.IncomingMessage} req
 */
const getBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';

        /** 
         * @param {String} chunk 
         */
        const onData = (chunk) => {
            body += chunk;

            if (body.length > 1_000_000) {
                req.destroy();
                reject(new Error('Payload too large'));
            }
        };
        req.on('data', onData);

        const onEnd = () => {
            resolve(body);
        };
        req.on('end', onEnd);

        req.on('error', reject);
    });
}


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
    const body = await getBody(req);

    let parsed;
    try {
        parsed = JSON.parse(body)
    } catch {

    }

    /** @type {{ title: String | undefined , content: String | undefined }} */
    const { title, content } = parsed;


    const properlyParsed = title !== undefined && content !== undefined;
    if (!properlyParsed) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            'error': 'Bad request',
            'message': 'Request body could not be read properly',
        }));
        return;
    }

    const newNote = new services.Note(title, content, collection1.id);
    services.addNote(newNote);

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 'message': 'New note created', 'note': newNote }));
};

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage }} res
 */
const handleDeleteNote = (req, res) => {
    const isAuthorized = checkAuthorized(req);
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

    deleteNoteAtIndex(index);

    res.writeHead(204);
    res.end();
};

const server = http.createServer(async (req, res) => {
    console.log(`Raw request URL: ${req.url}`);
    console.log(`Raw request method: ${req.method}`);
    console.log('Raw request headers:', req.headers);

    if (req.url === '/api/notes' && req.method === 'GET') {
        handleGetNotes(req, res);
        return;
    }
    if (req.url === '/api/notes' && req.method === 'POST') {
        await handleCreateNote(req, res);
        return;
    }
    if (req.url.startsWith('/api/notes/') && req.method === 'DELETE') {
        handleDeleteNote(req, res);
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
    console.log(`Secret token: ${secretToken}`);
});

