import { deleteNoteIcon, editNoteIcon } from "./svgs.js";

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
  editNoteButtonElement.innerHTML = editNoteIcon;

  const deleteNoteButtonElement = document.createElement("button");
  deleteNoteButtonElement.classList.add("delete-note-button");
  deleteNoteButtonElement.innerHTML = deleteNoteIcon;

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
 * @param {HTMLDivElement} noteCard
 * @param {String} id
 * @param {Function} [onDeleteIntent]
 * @return {void}
 */
const setupDeleteNoteButton = (noteCard, id, onDeleteIntent) => {
  const deleteNoteButton = noteCard.getElementsByClassName("delete-note-button")[0];
  deleteNoteButton.addEventListener("click", () => {
    if (typeof onDeleteIntent === "function") {
      onDeleteIntent(id);
    }
  });
};

export { createNoteCard, setupDeleteNoteButton };
