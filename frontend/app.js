/** @type {HTMLDivElement} */
const notesContainer = document.getElementById("notes-container");
if (!notesContainer) {
  console.log("Notes container not found");
}

/**
 * @param {String} noteTitle 
 * @param {String} noteContent 
 */
const createNoteCard = (noteTitle, noteContent) => {
  const noteCard = document.createElement("div");
  noteCard.classList.add("note-card");

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

  deleteNoteButtonElement.addEventListener("click", () => {
    notesContainer.removeChild(noteCard);
  });

  noteCardTitleElement.appendChild(noteCardTitleLabelElement);
  noteCardTitleElement.appendChild(deleteNoteButtonElement);
  noteCard.appendChild(noteCardTitleElement);

  const noteContentElement = document.createElement("p");
  noteContentElement.classList.add("note-card-content");
  noteContentElement.textContent = noteContent || "New Note Content";

  noteCard.appendChild(noteContentElement);
  notesContainer.appendChild(noteCard);
}

const createNote = () => {
  console.log("Create Note button clicked");
  createNoteCard("New Note", "This is the content of the new note.");
}

/** @type {HTMLButtonElement} */
const addNoteButton = document.getElementById("add-note-button");

let isOpeningAddNoteForm = false;

/** @type {HTMLDivElement} */
const addNewNoteFormLayer = document.getElementById("add-new-note-form-layer");
/** @type {HTMLFormElement} */
const addNewNoteForm = document.getElementById("add-new-note-form");
const openNoteForm = (noteForm) => {
  if (!isOpeningAddNoteForm) {
    noteForm.classList.remove("hidden");
    isOpeningAddNoteForm = true;
  }
};

const closeNoteForm = (noteForm) => {
  if (isOpeningAddNoteForm) {
    noteForm.classList.add("hidden");
    isOpeningAddNoteForm = false;
  }
};

const toggleNoteForm = (noteForm) => {
  if (!isOpeningAddNoteForm) {
    openNoteForm(noteForm);
  } else {
    closeNoteForm(noteForm);
  }
};

addNoteButton.addEventListener("click", () => {
  toggleNoteForm(addNewNoteFormLayer);
});

addNewNoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const noteTitleInput = document.getElementById("note-title-input");
  const noteContentInput = document.getElementById("note-content-input");
  const noteTitle = noteTitleInput.value;
  const noteContent = noteContentInput.value;
  createNoteCard(noteTitle, noteContent);
  noteTitleInput.value = "";
  noteContentInput.value = "";
  closeNoteForm(addNewNoteFormLayer);
});