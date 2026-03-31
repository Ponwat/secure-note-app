const { env } = require('../config/env.js');

const pocketHost = {
    /** @type {() => Promise<Array<Object>>} */
    list: async () => {
        // TODO: Inplement this
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
                throw new Error(`Cannot fetch from PocketHost response was ${response.status} ${response.statusText}`)
            }
            /** @type {{ page: Number, perPage: Number, totalItems: Number, totalPages: Number, items: Array<Object> }} */
            const notes = await response.json();

            return notes.items;
        } catch(error) {
            return [];
        }
    },
    /** @type {(token: String, data: Object) => Promise<Object>} */
    create: async (token, data) => {
        // TODO: Inplement this
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
                throw new Error(`Cannot fetch from PocketHost response was ${response.status} ${response.statusText}`)
            }
            const note = await response.json();
            console.log(note);
            return note;
        } catch(error) {
            console.error(error);
            return {};
        }
    },
    /** @type {(id: String) => Promise<Object>} */
    view: async (id) => {
        // TODO: Inplement this
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
                throw new Error(`Cannot fetch from PocketHost response was ${response.status} ${response.statusText}`)
            }
            const note = await response.json();
            return note;
        } catch(error) {
            console.error(error);
            return {};
        }
    },
    /** @type {(token: String, id: String , data: Object) => Promise<Object>} */
    update: async (token, id, data) => {
        // TODO: Inplement this
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
                throw new Error(`Cannot fetch from PocketHost response was ${response.status} ${response.statusText}`)
            }
            const note = await response.json();
            return note;
        } catch(error) {
            console.error(error);
            return {};
        }
    },
    /** @type {(token: String, id: String) => Promise<Response>} */
    delete: async (token, id) => {
        // TODO: Inplement this
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
                throw new Error(`Cannot fetch from PocketHost response was ${response.status} ${response.statusText}`)
            }
            return response;
        } catch(error) {
            console.error(error);
            return {};
        }
    }
}

module.exports = { pocketHost };
