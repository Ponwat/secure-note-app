'use strict';

const generateId = () => {
    return crypto.randomUUID().split('-').slice(0, 2).join('');
};

class Note {
    /**
     * @param {String} title 
     * @param {String} content 
     * @param {String | undefined} collectionId 
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
    return notes.splice(index, 1)[0];
};

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
}
