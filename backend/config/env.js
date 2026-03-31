const env = {
    /** @type {String} */
    PORT: process.env.PORT,
    /** @type {String} */
    SECRET_TOKEN: process.env.SECRET_TOKEN,
    /** @type {String} */
    FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
    /** @type {String} */
    POCKET_HOST_URL: process.env.POCKET_HOST_URL,
    /** @type {String} */
    POCKET_HOST_TOKEN: process.env.POCKET_HOST_TOKEN,
    /** @type {Number} */
    USER_ID: Number(process.env.USER_ID),
};

/**
 * @type {() => boolean}
 */
const validateEnv = () => {
    let isValid = true;
    const requiredVariables = [
        'PORT',
        'SECRET_TOKEN',
        'FRONTEND_ORIGIN',
        'POCKET_HOST_URL',
        'POCKET_HOST_TOKEN',
        'USER_ID',
    ];

    for (const variable of requiredVariables) {
        const value = env[variable];
        if (value === undefined || String(value).trim() === '') {
            console.error(`${variable} is missing or empty in environment variables`);
            isValid = false;
        }
    }

    if (!Number.isFinite(env.USER_ID)) {
        console.error('USER_ID must be a numeric value');
        isValid = false;
    }

    return isValid;
};

module.exports = { env, validateEnv };
