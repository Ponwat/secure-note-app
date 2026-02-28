/**
 * @param {RequestInfo | URL} url 
 * @param {RequestInit} options 
 * @returns {Promise<Object>}
 */
const fetchJSON = async (url, options = {}) => {
  try {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
} catch (error) {
  console.error("Error fetching data:", error);
  throw error;
}
};

/**
 * @param {String} apiUrl
 * @return {Promise<Object[]>}
 */
export const getNotes = async (apiUrl) => {
  return fetchJSON(`${apiUrl}/notes`);
};

/**
 * @param {String} apiUrl
 * @param {String} noteTitle
 * @param {String} noteContent
 * @param {String} token
 * @returns {Object | null}
 */
export const postNote = async (apiUrl, noteTitle, noteContent, token) => {
    const response = await fetchJSON(`${apiUrl}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: noteTitle, content: noteContent }),
    });
    return response.note;
};

/**
 * @param {String} apiUrl
 * @param {String} noteId
 * @param {String} token
 * @returns {Boolean}
 */
export const deleteNote = async (apiUrl, noteId, token) => {
  const response = await fetch(`${apiUrl}/notes/${noteId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.ok;
};
