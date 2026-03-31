'use strict';

const generateId = () => {
    return crypto.randomUUID().split('-').slice(0, 2).join('');
};

class Note {
    /**
     * @param {string} title
     * @param {string} content
     * @param {string} [collectionId]
     */
    constructor(title, content, collectionId) {
        /** @type {string} */
        this.id = generateId();

        /** @type {string} */
        this.title = title;

        /** @type {string} */
        this.content = content;

        /** @type {String} */
        this.created = new Date().toString();

        /** @type {String} */
        this.updated = this.created;

        /** @type {string | undefined} */
        this.collectionId = collectionId;

        /** @type {string | undefined} */
        this.collectionName = undefined;

        const collection = findNoteCollection(this.collectionId);
        if (collection !== undefined) {
            this.collectionName = collection.name;
        }

        /** @type {number} */
        this.userId = 1;
    }

    /**
     * @param {Object} obj
     * @param {string} obj.title
     * @param {string} obj.content
     * @param {string} obj.collectionId
     * @param {string} obj.collectionName
     * @param {string} obj.id
     * @param {string | Date} obj.created
     * @param {string | Date} obj.updated
     * @param {string | number} obj.user_id
     *
     * @returns {Note}
     */
    static fromObject = ({
        title,
        content,
        collectionId,
        collectionName,
        id,
        created,
        updated,
        user_id
    }) => {
        const collection = findNoteCollection(collectionId);
        if (collection === undefined) {
            const collection = new NoteCollection(collectionName);
            collection.id = collectionName;
            addNoteCollection(collection);
        }

        const note = new Note(title, content, collectionId);

        /** @type {string} */
        note.id = id;

        /** @type {Date | string} */
        note.created = created;

        /** @type {Date | string} */
        note.updated = updated;

        /** @type {number | string} */
        note.userId = user_id;

        return note;
    };
}

class NoteCollection {
    /**
     * @param {String} name 
     */
    constructor(name) {
        this.id = generateId();
        this.name = name;
    }
};

/** @type {NoteCollection[]} */
const collections = [];

/**
 * @param {NoteCollection} collection
 */
const addNoteCollection = (collection) => {
    collections.push(collection);
};

/**
 * @param {String | undefined} id
 * @return {NoteCollection | undefined}
 */
const findNoteCollection = (id) => {
    for (let index = 0; index < collections.length; index++) {
        if (collections[index].id === id) {
            return collections[index];
        }
    }
    return undefined;
};

/** @type {Note[]} */
const notes = [];

/**
 * @returns {Note[]}
 */
const getNotes = () => {
    return notes;
};

/**
 * @param {Note} note
 * @returns {Number}
 */
const addNote = (note) => {
    return notes.push(note);
}

/**
 * @param {Number} index
 * @param {{title: String, content: String, updated: String}}
 * @return {Note}
 */
const editNoteAtIndex = (index, {title, content, updated}) => {
    notes[index].title = title;
    notes[index].content = content;
    notes[index].updated = updated;
    return notes[index];
};

/**
 * @param {String | undefined} id
 * @return {Note | undefined}
 */
const findNote = (id) => {
    for (let index = 0; index < notes.length; index++) {
        if (notes[index].id === id) {
            return notes[index];
        }
    }
    return undefined;
};

/**
 * @param {String | undefined} id
 * @return {String | undefined}
 */
const findNoteIndex = (id) => {
    for (let index = 0; index < notes.length; index++) {
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
    const note = notes.splice(index, 1)[0];
    return note;
};

/**
 * @returns {Note[]}
 */
const clearNote = () => {
    return notes.splice(0, notes.length);
}

module.exports = {
    NoteCollection,
    addNoteCollection,
    Note,
    findNoteCollection,
    getNotes,
    addNote,
    findNote,
    findNoteIndex,
    deleteNoteAtIndex,
    clearNote,
    editNoteAtIndex,
};
