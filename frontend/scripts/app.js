import { openNoteForm, closeNoteForm, toggleNoteForm } from "./form.js";
import { getNotes, postNote } from "./api.js";
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
const addNewNoteFormLayer = document.getElementById("add-new-note-form-layer");
/** @type {HTMLFormElement} */
const addNewNoteForm = document.getElementById("add-new-note-form-element");

/** @type {String} */
const apiUrl = "http://localhost:6969/api";

addNoteButton.addEventListener("click", async () => {
  openNoteForm(addNewNoteFormLayer);
  const firstField = addNewNoteForm.getElementsByTagName("input")[0];
  firstField.focus();
});

addNewNoteForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const noteTitleInput = document.getElementById("note-title-input");
  const noteContentInput = document.getElementById("note-content-input");
  const noteTitle = noteTitleInput.value;
  const noteContent = noteContentInput.value;

  closeNoteForm(addNewNoteFormLayer);

  const token = document.getElementById("note-secret-input").value;
  const newNote = await postNote(apiUrl, noteTitle, noteContent, token);
  if (newNote) {
    const noteCard = createNoteCard(newNote.title, newNote.content, newNote.id);
    addNoteCardToContainer(noteCard);
    setupDeleteNoteButton(noteCard, apiUrl, token, newNote.id);
  }

  noteTitleInput.value = "";
  noteContentInput.value = "";
});

/** @type {HTMLButtonElement} */
const closeFormButton = document.getElementById(
  "close-add-new-note-form-button",
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
}
console.log("Fetched notes:", notes);

const tokenInput = document.getElementById("note-secret-input");
tokenInput.value = token;
