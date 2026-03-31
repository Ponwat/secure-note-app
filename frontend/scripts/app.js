import { openNoteForm, closeNoteForm, toggleNoteForm } from "./form.js";
import { editNote, getNotes, postNote } from "./api.js";
import { createNoteCard, removeNoteCard, setupDeleteNoteButton } from "./noteCard.js";

/** @type {String} */
const token = "SUPER_SECRET_TOKEN";

/** @type {HTMLDivElement} */
const notesContainer = document.getElementById("notes-container");
if (!notesContainer) {
    console.error("Notes container not found");
}

/**
 * @return {void}
 */
const clearNotesContainer = () => {
    for (const child of notesContainer.children) {
        child.remove();
    }
};

/**
 * @param {HTMLDivElement} noteCard
 * @return {void}
 */
const addNoteCardToContainer = (noteCard) => {
    notesContainer.appendChild(noteCard);
};

/** @type {HTMLButtonElement} */
const addNoteButton = document.getElementById("add-note-button");

/** @type {HTMLDivElement} */
const addNewNoteFormLayer = document.getElementById("note-form-layer");
/** @type {HTMLFormElement} */
const addNewNoteForm = document.getElementById("note-form-element");

/** @type {HTMLDivElement} */
const editNoteFormLayer = document.getElementById("edit-note-form-layer");
/** @type {HTMLFormElement} */
const editNoteForm = document.getElementById("edit-note-form-element");

// /** @type {String} */
const apiUrl = "http://localhost:6969/api";

/** @type {String} */
// const apiUrl = "https://secure-note-app-x7us.onrender.com/api";

addNoteButton.addEventListener("click", () => {
    openNoteForm(addNewNoteFormLayer);
    const noteFormTitle = document.getElementById("note-title");
    noteFormTitle.innerText = "Add New Note";
    const noteSubmitButton = document.getElementById("add-note-submit-button");
    noteSubmitButton.innerText = "Add Note";

    /** @type {HTMLInputElement} */
    const noteIdInput = document.getElementById("note-id-input");
    noteIdInput.value = "";

    /** @type {HTMLInputElement} */
    const noteTitleInput = document.getElementById("note-title-input");
    noteTitleInput.value = "";

    /** @type {HTMLInputElement} */
    const noteContentInput = document.getElementById("note-content-input");
    noteContentInput.value = "";

    const inputGroup = addNewNoteForm.getElementsByClassName("input-group");

    const firstField = inputGroup[0];
    firstField.classList.add("hidden");

    const secondField = inputGroup[1];
    secondField.focus();
});

/**
 * @param {String} noteId
 * @return {void}
 */
const onEditNoteClick = (noteId, noteTitle, noteContent) => {
    openNoteForm(addNewNoteFormLayer);
    const noteFormTitle = document.getElementById("note-title");
    noteFormTitle.innerText = "Edit Note";
    const noteSubmitButton = document.getElementById("add-note-submit-button");
    noteSubmitButton.innerText = "Edit Note";

    /** @type {HTMLInputElement} */
    const noteIdInput = document.getElementById("note-id-input");
    noteIdInput.value = noteId;

    /** @type {HTMLInputElement} */
    const noteTitleInput = document.getElementById("note-title-input");
    noteTitleInput.value = noteTitle;

    /** @type {HTMLInputElement} */
    const noteContentInput = document.getElementById("note-content-input");
    noteContentInput.value = noteContent;

    const inputGroup = addNewNoteForm.getElementsByClassName("input-group");

    const firstField = inputGroup[0];
    firstField.classList.remove("hidden");

    const secondField = inputGroup[1];
    secondField.focus();

    
};

addNewNoteForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const noteIdInput = document.getElementById("note-id-input");
    const noteTitleInput = document.getElementById("note-title-input");
    const noteContentInput = document.getElementById("note-content-input");
    const noteId = noteIdInput.value;
    const noteTitle = noteTitleInput.value;
    const noteContent = noteContentInput.value;


    const token = document.getElementById("note-secret-input").value;
    if (!noteId) {
        const newNote = await postNote(apiUrl, noteTitle, noteContent, token);
        if (newNote) {
            const noteCard = createNoteCard(newNote.title, newNote.content, newNote.id);
            addNoteCardToContainer(noteCard);
            setupDeleteNoteButton(noteCard, apiUrl, token, newNote.id);
            const editNoteButton = noteCard.getElementsByClassName("edit-note-button")[0];
            editNoteButton.proventdefau
            editNoteButton.addEventListener("click", () => {
                onEditNoteClick(newNote.id, newNote.title, newNote.content);
            });
        }
    } else {
        for (const noteCard of notesContainer.children) {
            if (noteCard.dataset.id !== noteId) continue;
            const editedNote = await editNote(apiUrl, noteId, noteTitle, noteContent, token);
            if (editedNote) {
                const titleElement = noteCard.getElementsByClassName("note-card-title-label")[0];
                const contentElement = noteCard.getElementsByClassName("note-card-content")[0];
                titleElement.textContent = editedNote.title;
                contentElement.textContent = editedNote.content;
                const editNoteButton = noteCard.getElementsByClassName("edit-note-button")[0];
                editNoteButton.addEventListener("click", () => {
                    onEditNoteClick(editedNote.id, editedNote.title, editedNote.content);
                });
            }
        }
    }
    closeNoteForm(addNewNoteFormLayer);

    noteTitleInput.value = "";
    noteContentInput.value = "";
});

/** @type {HTMLButtonElement} */
const closeFormButton = document.getElementById(
    "close-note-form-button",
);
closeFormButton.addEventListener("click", () => {
    closeNoteForm(addNewNoteFormLayer);
});

/** @type {Object[]} */
const notes = await getNotes(apiUrl);
for (const note of notes) {
  const noteCard = createNoteCard(note.title, note.content, note.id);
  addNoteCardToContainer(noteCard);
  setupDeleteNoteButton(noteCard, apiUrl, token, note.id);
  const editNoteButton = noteCard.getElementsByClassName("edit-note-button")[0];
  console.log("aaaa", editNoteButton);
  editNoteButton.addEventListener("click", () => {
    onEditNoteClick(note.id, note.title, note.content);
  });
}
console.log("Fetched notes:", notes);

// const tokenInput = document.getElementById("note-secret-input");
// tokenInput.value = token;
//
// const createNoteSkeleton = () => {
//     const noteCard = createNoteCard("", "");
//     noteCard.classList.add("note-card-skeleton");
//     return noteCard;
// }
//
// const noteCard = createNoteSkeleton();
// addNoteCardToContainer(noteCard);
