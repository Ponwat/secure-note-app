/** @type {String} */
const token = "SUPER_SECRET_TOKEN";

/** @type {HTMLDivElement} */
const notesContainer = document.getElementById("notes-container");
if (!notesContainer) {
  console.log("Notes container not found");
}

/**
 * @param {String} noteTitle
 * @param {String} noteContent
 * @return {HTMLDivElement}
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

/**
 * @returns {void}
 */
const createNote = () => {
  console.log("Create Note button clicked");
  const noteCard = createNoteCard(
    "New Note",
    "This is the content of the new note.",
  );
  addNoteCardToContainer(noteCard);
};

/** @type {HTMLButtonElement} */
const addNoteButton = document.getElementById("add-note-button");

/** @type {Boolean} */
let isOpeningAddNoteForm = false;

/** @type {HTMLDivElement} */
const addNewNoteFormLayer = document.getElementById("add-new-note-form-layer");
/** @type {HTMLFormElement} */
const addNewNoteForm = document.getElementById("add-new-note-form");

/**
 * @param {HTMLFormElement} noteForm
 */
const openNoteForm = (noteForm) => {
  if (!isOpeningAddNoteForm) {
    noteForm.classList.remove("hidden");
    isOpeningAddNoteForm = true;
  }
};

/**
 * @param {HTMLFormElement} noteForm
 * @return {void}
 */
const closeNoteForm = (noteForm) => {
  if (isOpeningAddNoteForm) {
    noteForm.classList.add("hidden");
    isOpeningAddNoteForm = false;
  }
};

/**
 * @param {HTMLFormElement} noteForm
 * @return {void}
 */
const toggleNoteForm = (noteForm) => {
  if (!isOpeningAddNoteForm) {
    openNoteForm(noteForm);
  } else {
    closeNoteForm(noteForm);
  }
};

/** @type {String} */
const apiUrl = "http://localhost:6969/api";

/**
 * @param {String} apiUrl
 * @return {Promise<Object[]>}
 */
const fetchNotes = async (apiUrl) => {
  try {
    const response = await fetch(`${apiUrl}/notes`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const notes = await response.json();
    return notes;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
};

/**
 * @param {String} noteTitle
 * @param {String} noteContent
 * @param {String} token
 * @returns {Object | null}
 */
const addNote = async (noteTitle, noteContent, token) => {
  try {
    const response = await fetch(`${apiUrl}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: noteTitle, content: noteContent }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const res = await response.json();
    return res.note;
  } catch (error) {
    console.error("Error adding note:", error);
    return null;
  }
};

addNoteButton.addEventListener("click", async () => {
  toggleNoteForm(addNewNoteFormLayer);
});

addNewNoteForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const noteTitleInput = document.getElementById("note-title-input");
  const noteContentInput = document.getElementById("note-content-input");
  const noteTitle = noteTitleInput.value;
  const noteContent = noteContentInput.value;

  closeNoteForm(addNewNoteFormLayer);

  const token = document.getElementById("note-secret-input").value;
  const newNote = await addNote(noteTitle, noteContent, token);
  if (newNote) {
    const noteCard = createNoteCard(newNote.title, newNote.content);
    addNoteCardToContainer(noteCard);
    setupDeleteNoteButton(noteCard, token, newNote.id);
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

/**
 * @param {String} noteId
 * @param {String} token
 * @returns {Boolean}
 */
const deleteNote = async (noteId, token) => {
  try {
    const response = await fetch(`${apiUrl}/notes/${noteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Error deleting note:", error);
    return false;
  }
};

/**
 * @param {String} noteId
 * @return {void}
 */
const removeNoteCard = (noteId) => {
  const noteCards = notesContainer.getElementsByClassName("note-card");
  for (const noteCard of noteCards) {
    const noteTitleElement = noteCard.getElementsByClassName(
      "note-card-title-label",
    )[0];
    if (noteTitleElement.textContent === noteId) {
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
const setupDeleteNoteButton = (noteCard, token, id) => {
  const deleteNoteButton =
    noteCard.getElementsByClassName("delete-note-button")[0];
  deleteNoteButton.addEventListener("click", async () => {
    const success = await deleteNote(id, token);
    if (success) {
      noteCard.remove();
    }
  });
};

/** @type {Object[]} */
const notes = await fetchNotes(apiUrl);
for (const note of notes) {
  const noteCard = createNoteCard(note.title, note.content);
  addNoteCardToContainer(noteCard);
  setupDeleteNoteButton(noteCard, token, note.id);
}
console.log("Fetched notes:", notes);
