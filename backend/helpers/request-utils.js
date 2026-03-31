'use strict';

/**
 * @param {string | undefined} contentType
 * @returns {boolean}
 */
const hasJsonContentType = (contentType) => {
    if (!contentType) {
        return false;
    }

    const normalized = contentType.toLowerCase();
    return normalized === 'application/json' || normalized.startsWith('application/json;');
};

/**
 * @param {string | undefined} requestUrl
 * @returns {string}
 */
const getPathname = (requestUrl) => {
    if (!requestUrl) {
        return '/';
    }

    try {
        const parsedUrl = new URL(requestUrl, 'http://localhost');
        return parsedUrl.pathname;
    } catch {
        return requestUrl;
    }
};

/**
 * @param {string | undefined} requestUrl
 * @returns {string | undefined}
 */
const getNoteIdFromUrl = (requestUrl) => {
    const pathname = getPathname(requestUrl);
    const match = pathname.match(/^\/api\/notes\/([A-Za-z0-9_-]+)$/);
    if (!match) {
        return undefined;
    }

    return match[1];
};

/**
 * @param {unknown} value
 * @returns {value is string}
 */
const isString = (value) => typeof value === 'string';

/**
 * @param {unknown} payload
 * @returns {{ ok: true, value: { title: string, content: string } } | { ok: false, message: string }}
 */
const validateNotePayload = (payload) => {
    if (!payload || typeof payload !== 'object') {
        return { ok: false, message: 'Request body must be a JSON object' };
    }

    const note = /** @type {{ title?: unknown, content?: unknown }} */ (payload);

    if (!isString(note.title) || !isString(note.content)) {
        return { ok: false, message: 'title and content are required and must be strings' };
    }

    const title = note.title.trim();
    const content = note.content.trim();

    if (title.length === 0 || content.length === 0) {
        return { ok: false, message: 'title and content cannot be empty' };
    }

    if (title.length > 120) {
        return { ok: false, message: 'title exceeds max length of 120' };
    }

    if (content.length > 5000) {
        return { ok: false, message: 'content exceeds max length of 5000' };
    }

    return { ok: true, value: { title, content } };
};

module.exports = {
    getPathname,
    getNoteIdFromUrl,
    hasJsonContentType,
    validateNotePayload,
};
