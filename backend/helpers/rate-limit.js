'use strict';

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 60;

/** @type {Map<string, { count: number, resetAt: number }>} */
const buckets = new Map();

/**
 * @param {string} key
 * @returns {boolean}
 */
const isRateLimited = (key) => {
    const now = Date.now();
    const existing = buckets.get(key);

    if (!existing || now > existing.resetAt) {
        buckets.set(key, {
            count: 1,
            resetAt: now + WINDOW_MS,
        });
        return false;
    }

    existing.count += 1;
    return existing.count > MAX_REQUESTS_PER_WINDOW;
};

module.exports = { isRateLimited };
