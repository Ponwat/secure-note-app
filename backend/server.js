'use strict';

// https://app-tracking.pockethost.io/api/collections/notes/records
// https://quick-note-final.vercel.app/

const dotenv = require('dotenv');
const http = require('http');

const { NoteCollection, addNoteCollection, Note, addNote } = require('./services/note.js');
const { configSecret } = require('./services/authorization.js');

const { handleGetNotes } = require('./routes/get-notes.js');
const { handleCreateNote } = require('./routes/create-note.js');
const { handleDeleteNote } = require('./routes/delete-note.js');

const hostname = '127.0.0.1';

dotenv.config();

const port = process.env.PORT;
const secretToken = process.env.SECRET_TOKEN;

if (port === undefined || secretToken === undefined) {
    console.log('PORT or SECRET_TOKEN are undefined in .env');
    process.exit(1);
}

configSecret(secretToken);

const collection1 = new NoteCollection('notes');
addNoteCollection(collection1);

const note1 = new Note('Buy a powerbank', 'Must support PD 65W or better', collection1.id);
addNote(note1);

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage }} res
 */
const serverHandler = async (req, res) => {
    console.log(`Raw request URL: ${req.url}`);
    console.log(`Raw request method: ${req.method}`);
    console.log(`Raw request headers: `, req.headers);

    if (req.url.startsWith('/api/notes') && req.method === 'GET') {
        handleGetNotes(req, res);
        return;
    }
    if (req.url.startsWith('/api/notes') && req.method === 'POST') {
        await handleCreateNote(req, res);
        return;
    }
    if (req.url.startsWith('/api/notes/') && req.method === 'DELETE') {
        handleDeleteNote(req, res);
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
};

const server = http.createServer(serverHandler);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
    console.log(`Secret token: ${secretToken}`);
});

