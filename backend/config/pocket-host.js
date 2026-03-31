const { env } = require('../config/env.js');
const { UpstreamError } = require('../helpers/upstream-error.js');

/**
 * @param {string} action
 * @param {number} status
 * @param {string} statusText
 */
const createStatusError = (action, status, statusText) => {
    const isUnavailable = status >= 500;
    const mappedStatus = isUnavailable ? 503 : 502;
    return new UpstreamError(`PocketHost ${action} failed: ${status} ${statusText}`, mappedStatus);
};

/**
 * @param {string} action
 */
const createNetworkError = (action) => {
    return new UpstreamError(`PocketHost ${action} failed: network error`, 503);
};

const pocketHost = {
    /** @type {() => Promise<Array<Object>>} */
    list: async () => {
        const apiUrl = `${env.POCKET_HOST_URL}?perPage=500`;

        /** @type {RequestInit} */
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            const response = await fetch(apiUrl, options);
            if (!response.ok) {
                throw createStatusError('list', response.status, response.statusText);
            }

            /** @type {{ items: Array<Object> }} */
            const notes = await response.json();
            return Array.isArray(notes.items) ? notes.items : [];
        } catch (error) {
            if (error instanceof UpstreamError) {
                throw error;
            }
            throw createNetworkError('list');
        }
    },
    /** @type {(token: String, data: Object) => Promise<Object>} */
    create: async (token, data) => {
        const apiUrl = env.POCKET_HOST_URL;

        /** @type {RequestInit} */
        const options = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };

        try {
            const response = await fetch(apiUrl, options);
            if (!response.ok) {
                throw createStatusError('create', response.status, response.statusText);
            }

            return await response.json();
        } catch (error) {
            if (error instanceof UpstreamError) {
                throw error;
            }
            throw createNetworkError('create');
        }
    },
    /** @type {(id: String) => Promise<Object>} */
    view: async (id) => {
        const apiUrl = `${env.POCKET_HOST_URL}/${id}`;

        /** @type {RequestInit} */
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            const response = await fetch(apiUrl, options);
            if (!response.ok) {
                throw createStatusError('view', response.status, response.statusText);
            }

            return await response.json();
        } catch (error) {
            if (error instanceof UpstreamError) {
                throw error;
            }
            throw createNetworkError('view');
        }
    },
    /** @type {(token: String, id: String , data: Object) => Promise<Object>} */
    update: async (token, id, data) => {
        const apiUrl = `${env.POCKET_HOST_URL}/${id}`;

        /** @type {RequestInit} */
        const options = {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };

        try {
            const response = await fetch(apiUrl, options);
            if (!response.ok) {
                throw createStatusError('update', response.status, response.statusText);
            }

            return await response.json();
        } catch (error) {
            if (error instanceof UpstreamError) {
                throw error;
            }
            throw createNetworkError('update');
        }
    },
    /** @type {(token: String, id: String) => Promise<Response>} */
    delete: async (token, id) => {
        const apiUrl = `${env.POCKET_HOST_URL}/${id}`;

        /** @type {RequestInit} */
        const options = {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };

        try {
            const response = await fetch(apiUrl, options);
            if (!response.ok) {
                throw createStatusError('delete', response.status, response.statusText);
            }

            return response;
        } catch (error) {
            if (error instanceof UpstreamError) {
                throw error;
            }
            throw createNetworkError('delete');
        }
    }
}

module.exports = { pocketHost };
