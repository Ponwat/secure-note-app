import { openNoteForm, closeNoteForm } from "./form.js";
import { deleteNote, editNote, getNotes, postNote } from "./api.js";
import { createNoteCard, setupDeleteNoteButton } from "./noteCard.js";
import { spinningIcon } from "./svgs.js";

/** @type {HTMLDivElement} */
const notesContainer = document.getElementById("notes-container");
if (!notesContainer) {
    console.error("Notes container not found");
}

/** @type {HTMLDivElement} */
const startupLoading = document.getElementById("startup-loading");
/** @type {HTMLSpanElement} */
const startupLoadingSpinner = document.getElementById("startup-loading-spinner");
/** @type {HTMLParagraphElement} */
const startupLoadingText = document.getElementById("startup-loading-text");
/** @type {HTMLInputElement | null} */
const notesSearchInput = document.getElementById("notes-search-input");

/**
 * @return {void}
 */
const clearNotesContainer = () => {
    notesContainer.innerHTML = "";
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

/** @type {String} */
// API URL is now loaded from config.js via window.API_CONFIG.apiUrl
const apiUrl = window.API_CONFIG.apiUrl;

/** @type {Object[]} */
let notesMemory = [];

const FORM_MODE = {
    CREATE: "create",
    EDIT: "edit",
    DELETE_CONFIRM: "delete-confirm",
};

let noteFormMode = FORM_MODE.CREATE;
let pendingDeleteNoteId = "";

/** @type {HTMLHeadingElement} */
const noteFormTitle = document.getElementById("note-title");
/** @type {HTMLParagraphElement} */
const noteFormError = document.getElementById("note-form-error");
/** @type {HTMLButtonElement} */
const noteSubmitButton = document.getElementById("add-note-submit-button");
/** @type {HTMLInputElement} */
const noteIdInput = document.getElementById("note-id-input");
/** @type {HTMLInputElement} */
const noteTitleInput = document.getElementById("note-title-input");
/** @type {HTMLInputElement} */
const noteContentInput = document.getElementById("note-content-input");
/** @type {HTMLInputElement} */
const noteSecretInput = document.getElementById("note-secret-input");

const inputGroup = addNewNoteForm.getElementsByClassName("input-group");
const noteIdGroup = inputGroup[0];
const noteTitleGroup = inputGroup[1];
const noteContentGroup = inputGroup[2];
const noteSecretGroup = inputGroup[3];

/**
 * @param {String} message
 * @return {void}
 */
const setFormError = (message) => {
    noteFormError.innerText = message;
};

/**
 * @param {String} [message]
 * @return {void}
 */
const showStartupLoading = (message = "Loading notes...") => {
    startupLoadingText.innerText = message;
    startupLoadingSpinner.innerHTML = spinningIcon;
    startupLoading.classList.remove("hidden");

    if (notesSearchInput) {
        notesSearchInput.disabled = true;
    }
};

/**
 * @return {void}
 */
const hideStartupLoading = () => {
    startupLoading.classList.add("hidden");

    if (notesSearchInput) {
        notesSearchInput.disabled = false;
    }
};

/**
 * @param {String} message
 * @return {void}
 */
const showStartupError = (message) => {
    startupLoadingSpinner.innerHTML = "";
    startupLoadingText.innerText = message;
    startupLoading.classList.remove("hidden");

    if (notesSearchInput) {
        notesSearchInput.disabled = false;
    }
};

/**
 * @return {void}
 */
const openCreateNoteForm = () => {
    noteFormMode = FORM_MODE.CREATE;
    pendingDeleteNoteId = "";

    noteFormTitle.innerText = "Add New Note";
    noteSubmitButton.innerText = "Add Note";

    noteIdInput.value = "";
    noteTitleInput.value = "";
    noteContentInput.value = "";

    noteIdGroup.classList.add("hidden");
    noteTitleGroup.classList.remove("hidden");
    noteContentGroup.classList.remove("hidden");
    noteSecretGroup.classList.remove("hidden");
    noteTitleInput.required = true;
    noteContentInput.required = true;
    setFormError("");

    openNoteForm(addNewNoteFormLayer);
    noteTitleInput.focus();
};

/**
 * @param {String} noteId
 * @param {String} noteTitle
 * @param {String} noteContent
 * @return {void}
 */
const openEditNoteForm = (noteId, noteTitle, noteContent) => {
    noteFormMode = FORM_MODE.EDIT;
    pendingDeleteNoteId = "";

    noteFormTitle.innerText = "Edit Note";
    noteSubmitButton.innerText = "Edit Note";

    noteIdInput.value = noteId;
    noteTitleInput.value = noteTitle;
    noteContentInput.value = noteContent;

    noteIdGroup.classList.remove("hidden");
    noteTitleGroup.classList.remove("hidden");
    noteContentGroup.classList.remove("hidden");
    noteSecretGroup.classList.remove("hidden");
    noteTitleInput.required = true;
    noteContentInput.required = true;
    setFormError("");

    openNoteForm(addNewNoteFormLayer);
    noteTitleInput.focus();
};

/**
 * @param {String} noteId
 * @return {void}
 */
const openDeleteConfirmForm = (noteId) => {
    noteFormMode = FORM_MODE.DELETE_CONFIRM;
    pendingDeleteNoteId = noteId;

    noteFormTitle.innerText = "Delete Note?";
    noteSubmitButton.innerText = "Delete Note";

    noteIdGroup.classList.add("hidden");
    noteTitleGroup.classList.add("hidden");
    noteContentGroup.classList.add("hidden");
    noteSecretGroup.classList.remove("hidden");
    noteTitleInput.required = false;
    noteContentInput.required = false;
    setFormError("");

    openNoteForm(addNewNoteFormLayer);
    noteSecretInput.focus();
};

/**
 * @return {void}
 */
const closeAndResetNoteForm = () => {
    closeNoteForm(addNewNoteFormLayer);
    noteFormMode = FORM_MODE.CREATE;
    pendingDeleteNoteId = "";

    noteFormTitle.innerText = "Add New Note";
    noteSubmitButton.innerText = "Add Note";

    noteIdInput.value = "";
    noteTitleInput.value = "";
    noteContentInput.value = "";

    noteIdGroup.classList.add("hidden");
    noteTitleGroup.classList.remove("hidden");
    noteContentGroup.classList.remove("hidden");
    noteSecretGroup.classList.remove("hidden");
    noteTitleInput.required = true;
    noteContentInput.required = true;
    noteSubmitButton.disabled = false;
    setFormError("");
};

/**
 * @param {Object} note
 * @return {void}
 */
const createAndAttachNoteCard = (note) => {
    const noteCard = createNoteCard(note.title, note.content, note.id);
    addNoteCardToContainer(noteCard);
    setupDeleteNoteButton(noteCard, note.id, (noteId) => {
        openDeleteConfirmForm(noteId);
    });

    const editNoteButton = noteCard.getElementsByClassName("edit-note-button")[0];
    editNoteButton.addEventListener("click", () => {
        onEditNoteClick(note.id, note.title, note.content);
    });
};

/**
 * @param {Object[]} notes
 * @return {void}
 */
const renderNotes = (notes) => {
    clearNotesContainer();
    for (const note of notes) {
        createAndAttachNoteCard(note);
    }
};

/**
 * @param {String} searchTerm
 * @return {Object[]}
 */
const filterNotesFromMemory = (searchTerm) => {
    const normalizedSearchTerm = (searchTerm || "").trim().toLowerCase();
    if (!normalizedSearchTerm) {
        return notesMemory;
    }

    return notesMemory.filter((note) => {
        const normalizedTitle = String(note.title || "").toLowerCase();
        const normalizedContent = String(note.content || "").toLowerCase();
        return normalizedTitle.includes(normalizedSearchTerm) || normalizedContent.includes(normalizedSearchTerm);
    });
};

/**
 * @param {String} searchTerm
 * @return {void}
 */
const applyNotesFilter = (searchTerm) => {
    const filteredNotes = filterNotesFromMemory(searchTerm);
    renderNotes(filteredNotes);
};

/**
 * @return {String}
 */
const getActiveSearchTerm = () => {
    const searchInput = document.getElementById("notes-search-input");
    return searchInput ? searchInput.value : "";
};

addNoteButton.addEventListener("click", () => {
    openCreateNoteForm();
});

/**
 * @param {String} noteId
 * @return {void}
 */
const onEditNoteClick = (noteId, noteTitle, noteContent) => {
    openEditNoteForm(noteId, noteTitle, noteContent);
};

addNewNoteForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const noteId = noteIdInput.value;
    const noteTitle = noteTitleInput.value;
    const noteContent = noteContentInput.value;
    const formToken = noteSecretInput.value;
    const defaultSubmitLabel = noteSubmitButton.innerText;
    let isSuccess = false;

    setFormError("");
    noteSubmitButton.disabled = true;
    noteSubmitButton.innerHTML = spinningIcon;

    try {
        if (noteFormMode === FORM_MODE.CREATE) {
            const newNote = await postNote(apiUrl, noteTitle, noteContent, formToken);
            if (!newNote) {
                setFormError("Add failed. Please try again.");
            } else {
            notesMemory = [newNote, ...notesMemory];
            applyNotesFilter(getActiveSearchTerm());
            isSuccess = true;
            }
        } else if (noteFormMode === FORM_MODE.EDIT) {
            const editedNote = await editNote(apiUrl, noteId, noteTitle, noteContent, formToken);
            if (!editedNote) {
                setFormError("Edit failed. Please try again.");
            } else {
                notesMemory = notesMemory.map((storedNote) => {
                    if (String(storedNote.id) === String(editedNote.id)) {
                        return editedNote;
                    }
                    return storedNote;
                });
                applyNotesFilter(getActiveSearchTerm());
                isSuccess = true;
            }
        } else if (noteFormMode === FORM_MODE.DELETE_CONFIRM && pendingDeleteNoteId) {
            const success = await deleteNote(apiUrl, pendingDeleteNoteId, formToken);
            if (success) {
                notesMemory = notesMemory.filter((storedNote) => String(storedNote.id) !== String(pendingDeleteNoteId));
                applyNotesFilter(getActiveSearchTerm());
                isSuccess = true;
            } else {
                setFormError("Delete failed. Check secret and try again.");
            }
        }
    } catch (error) {
        console.log(error);
        if (noteFormMode === FORM_MODE.DELETE_CONFIRM) {
            setFormError("Delete failed. Check secret and try again.");
        } else if (noteFormMode === FORM_MODE.EDIT) {
            setFormError("Edit failed. Please try again.");
        } else if (noteFormMode === FORM_MODE.CREATE) {
            setFormError("Add failed. Please try again.");
        } else {
            setFormError("Save failed. Please try again.");
        }
    }

    if (isSuccess) {
        closeAndResetNoteForm();
        return;
    }

    noteSubmitButton.disabled = false;
    noteSubmitButton.innerText = defaultSubmitLabel;
});

for (const inputElement of [noteTitleInput, noteContentInput, noteSecretInput]) {
    inputElement.addEventListener("input", () => {
        setFormError("");
    });
}

/** @type {HTMLButtonElement} */
const closeFormButton = document.getElementById(
    "close-note-form-button",
);
closeFormButton.addEventListener("click", () => {
    closeAndResetNoteForm();
});

if (notesSearchInput) {
        notesSearchInput.addEventListener("input", (event) => {
                applyNotesFilter(event.target.value);
        });
}

showStartupLoading();
try {
    notesMemory = await getNotes(apiUrl);
    renderNotes(notesMemory);
    hideStartupLoading();
    console.log("Fetched notes:", notesMemory);
} catch (error) {
    console.log(error);
    notesMemory = [];
    renderNotes(notesMemory);
    showStartupError("Unable to load notes. Please refresh and try again.");
}

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
