import { deleteNote } from "./api.js";

/**
 * @param {String} noteTitle
 * @param {String} noteContent
 * @return {HTMLDivElement}
 */
/**
 * @param {String} noteTitle
 * @param {String} noteContent
 * @param {String} [noteId]
 * @return {HTMLDivElement}
 */
const createNoteCard = (noteTitle, noteContent, noteId) => {
  const noteCard = document.createElement("div");
  noteCard.classList.add("note-card");

  if (noteId) {
    noteCard.dataset.id = noteId;
  }

  const noteCardTitleElement = document.createElement("div");
  noteCardTitleElement.classList.add("note-card-title");

  const noteCardTitleLabelElement = document.createElement("h3");
  noteCardTitleLabelElement.classList.add("note-card-title-label");
  noteCardTitleLabelElement.textContent = noteTitle || "New Note";

  const deleteNoteButtonElement = document.createElement("button");
  deleteNoteButtonElement.classList.add("delete-note-button");
  deleteNoteButtonElement.innerHTML = ` 
    <svg viewBox="0 0 24 24" class="delete-note-icon"> 
    <path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z" /> 
    </svg> 
  `;

  noteCardTitleElement.appendChild(noteCardTitleLabelElement);
  noteCardTitleElement.appendChild(deleteNoteButtonElement);
  noteCard.appendChild(noteCardTitleElement);

  const noteContentElement = document.createElement("p");
  noteContentElement.classList.add("note-card-content");
  noteContentElement.textContent = noteContent || "New Note Content";

  noteCard.appendChild(noteContentElement);

  return noteCard;
};

/**
 * @param {String} noteId
 * @return {void}
 */
const removeNoteCard = (noteId) => {
  const noteCards = document.getElementsByClassName("note-card");
  for (const noteCard of noteCards) {
    if (noteCard.dataset && noteCard.dataset.id === String(noteId)) {
      noteCard.remove();
      break;
    }
  }
};

/**
 * @param {String} noteCard
 * @param {String} token
 * @param {String} id
 * @return {void}
 */
const setupDeleteNoteButton = (noteCard, apiUrl, token, id) => {
  const deleteNoteButton =
    noteCard.getElementsByClassName("delete-note-button")[0];
  deleteNoteButton.addEventListener("click", async () => {
    const success = await deleteNote(apiUrl, id, token);
    if (success) {
      noteCard.remove();
    }
  });
};

export { createNoteCard, removeNoteCard, setupDeleteNoteButton };