'use strict';

const generateId = () => {
    return crypto.randomUUID().split('-').slice(0, 2).join('');
};

class Note {
    /**
     * @param {String} title 
     * @param {String} content 
     * @param {String | undefined} collectionId 
     * @param {String} collectionName 
     */
    constructor(title, content, collectionId) {
        this.id = generateId();
        this.title = title;
        this.content = content;

        this.created = new Date();
        this.updated = this.created;

        this.collectionId = collectionId;
        const collection = findNoteCollection(this.collectionId);
        if (collection !== undefined) {
            this.collectionName = collection.name;
        }

        this.user_id = 1;
    }
};

class NoteCollection {
    /**
     * @param {String} name 
     */
    constructor(name) {
        this.id = generateId();
        this.name = name;
    }
};

const collection1 = new NoteCollection('notes');
const collections = [collection1];

/**
 * @param {String | undefined} id
 * @return {NoteCollection | undefined}
 */
const findNoteCollection = (id) => {
    for (const collection of collections) {
        if (collection.id === id) {
            return collection;
        }
    }
    return undefined;
};

const note1 = new Note('Buy a powerbank', 'Must support PD 65W or better');
const notes = [note1];

/**
 * @param {Note} note
 * @returns {Number}
 */
const addNote = (note) => {
    return notes.push(note);
}

/**
 * @param {String | undefined} id
 * @return {Note | undefined}
 */
const findNote = (id) => {
    for (const note of notes) {
        if (note.id === id) {
            return note;
        }
    }
    return undefined;
};

/**
 * @param {String | undefined} id
 * @return {String | undefined}
 */
const findNoteIndex = (id) => {
    for (const index in notes) {
        if (notes[index].id === id) {
            return index;
        }
    }
    return undefined;
};

/**
 * @param {Number} index
 * @returns {Note}
 */
const deleteNoteAtIndex = (index) => {
    return notes.splice(index, 1)[0];
};

module.exports = {
    Note,
    NoteCollection,
    findNoteCollection,
    addNote,
    findNote,
    findNoteIndex,
    deleteNoteAtIndex,
}
