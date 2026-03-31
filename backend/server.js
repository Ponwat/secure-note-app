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

const { NoteCollection, addNoteCollection, Note, addNote, clearNote, getNotes } = require('./services/note.js');
const { configSecret } = require('./services/authorization.js');

const { handleGetNotes } = require('./routes/get-notes.js');
const { handleCreateNote } = require('./routes/create-note.js');
const { handleDeleteNote } = require('./routes/delete-note.js');

const { pocketHost } = require('./config/pocket-host.js');
const { syncPocketHostNotes } = require("./services/sync-pocket-host-notes.js");
const { handleEditNote } = require("./routes/edit-note.js");

const hostname = '0.0.0.0';

const port = env.PORT;
const secretToken = env.SECRET_TOKEN;
const frontendOrigin = env.FRONTEND_ORIGIN;
const pocketHostURL = env.POCKET_HOST_URL;

configSecret(secretToken);

const collection1 = new NoteCollection('notes');
addNoteCollection(collection1);

const note1 = new Note('Buy a powerbank', 'Must support PD 65W or better', collection1.id);
addNote(note1);

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse<IncomingMessage> & { req: IncomingMessage }} res
 */
const handleOptions = (req, res) => {
    res.writeHead(204, { 
        'Content-Type': 'application/json',
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

    res.appendHeader('Access-Control-Allow-Origin', frontendOrigin);

    if (req.method === 'OPTIONS') {
        handleOptions(req, res);
        return;
    }
    if (req.url.startsWith('/api/notes') && req.method === 'GET') {
        await handleGetNotes(req, res);
        return;
    }
    if (req.url.startsWith('/api/notes') && req.method === 'POST') {
        await handleCreateNote(req, res);
        return;
    }
    if (req.url.startsWith('/api/notes/') && req.method === 'PATCH') {
        await handleEditNote(req, res);
        return;
    }
    if (req.url.startsWith('/api/notes/') && req.method === 'DELETE') {
        await handleDeleteNote(req, res);
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
};

const onStart = async () => {
    const id = "irph7tib5h47rv5";
    const testData = {
        title: "Hello",
        content: "Buddy",
        user_id: 66010449,
    };
    // pocketHost.create(env.POCKET_HOST_TOKEN, testData);
    // const note = await pocketHost.view(id);
    const updatedTestData = {
        title: "Hello",
        content: "Buddy updated",
        user_id: 66010449,
    };
    // const note = await pocketHost.update(env.POCKET_HOST_TOKEN, id, updatedTestData);
    // const note = await pocketHost.delete(env.POCKET_HOST_TOKEN, id);
    // console.log("ado", note);

    // await syncPocketHostNotes();
    // console.log(getNotes());

    console.log(`Server running at http://${hostname}:${port}/`);
    console.log(`Secret token: ${secretToken}`);
}

const server = http.createServer(serverHandler);
server.listen(port, hostname, onStart);
