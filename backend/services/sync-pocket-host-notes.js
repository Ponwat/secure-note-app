const { pocketHost } = require("../config/pocket-host");
const { clearNote, Note, addNote } = require("./note");

const syncPocketHostNotes = async () => {
    const notes = await pocketHost.list();

    clearNote();

    for (const note of notes) {
        if (note.user_id !== 66010449) {
            continue;
        }
        const newNote = Note.fromObject(note);
        addNote(newNote);
    }
};

module.exports = { syncPocketHostNotes };
