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
    USER_ID: 66010449,
};

/**
 * @type {() => boolean}
 */
const validateEnv = () => {
    let isValid = true;
    for (const vairable in env) {
        if (env[vairable] === undefined) {
            console.error(`${vairable} is not defined in .env`);
            isValid = false;
        }
    }
    return isValid;
};

module.exports = { env, validateEnv };
