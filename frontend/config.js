window.API_CONFIG = {
    apiUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:7070/api'
        : `https://secure-note-app-x7us.onrender.com/api`
};
