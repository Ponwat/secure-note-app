const { pocketHost } = require("../config/pocket-host");
const { clearNote, Note, addNote } = require("./note");
const { env } = require("../config/env");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchPocketHostNotesWithRetry = async () => {
    try {
        return await pocketHost.list();
    } catch (firstError) {
        await sleep(200);
        return await pocketHost.list();
    }
};

const syncPocketHostNotes = async () => {
    const notes = await fetchPocketHostNotesWithRetry();

    clearNote();

    for (const note of notes) {
        if (Number(note.user_id) !== Number(env.USER_ID)) {
            continue;
        }
        const newNote = Note.fromObject(note);
        addNote(newNote);
    }
};

module.exports = { syncPocketHostNotes };
