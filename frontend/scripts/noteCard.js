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

  const actionButtonsElement = document.createElement("div");
  actionButtonsElement.classList.add("note-card-action-buttons");

  const editNoteButtonElement = document.createElement("button");
  editNoteButtonElement.classList.add("edit-note-button");
  editNoteButtonElement.innerHTML = ` 
    <svg viewBox="0 0 24 24" class="edit-note-icon"> 
        <path fill="currentColor" d="M3 21v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z"/>
    </svg> 
  `;

  const deleteNoteButtonElement = document.createElement("button");
  deleteNoteButtonElement.classList.add("delete-note-button");
  deleteNoteButtonElement.innerHTML = ` 
    <svg viewBox="0 0 24 24" class="delete-note-icon"> 
    <path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z" /> 
    </svg> 
  `;

  actionButtonsElement.appendChild(editNoteButtonElement);
  actionButtonsElement.appendChild(deleteNoteButtonElement);

  noteCardTitleElement.appendChild(noteCardTitleLabelElement);
  noteCardTitleElement.appendChild(actionButtonsElement);
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
  const deleteNoteButton = noteCard.getElementsByClassName("delete-note-button")[0];
  deleteNoteButton.addEventListener("click", async () => {
    const success = await deleteNote(apiUrl, id, token);
    if (success) {
      noteCard.remove();
    }
  });
};

export { createNoteCard, removeNoteCard, setupDeleteNoteButton };
