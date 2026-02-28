/** @type {Boolean} */
let isOpeningAddNoteForm = false;

/**
 * @param {HTMLDivElement} noteDialog
 */
export const openNoteForm = (noteDialog) => {
  noteDialog.classList.remove("hidden");
  isOpeningAddNoteForm = true;
};

/**
 * @param {HTMLDivElement} noteDialog
 * @return {void}
 */
export const closeNoteForm = (noteDialog) => {
  noteDialog.classList.add("hidden");
  isOpeningAddNoteForm = false;
};

/**
 * @param {HTMLDivElement} noteDialog
 * @return {void}
 */
export const toggleNoteForm = (noteDialog) => {
  if (!isOpeningAddNoteForm) {
    openNoteForm(noteDialog);
  } else {
    closeNoteForm(noteDialog);
  }
};
