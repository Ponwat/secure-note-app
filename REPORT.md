# Report
1. JS Engine vs. Runtime
    - The frontend runs on the V8 JavaScript engine inside the browser runtime environment.
    - The backend runs on the V8 JavaScript engine inside the Node.js runtime environment.

2. DOM
    - The frontend manipulates the DOM using `document.getElementById("...")` to select elements.
    - A note card is added to the page using `appendChild(...)` on the `#notes-container` element.
    - The create or edit note form popup is shown or hidden by removing or adding the `hidden` class on `#note-form-layer`.

3. HTTP/HTTPS
    - When the user submits the note form:
        1. The frontend sends a `POST` request to `/api/notes` with:
            - `Authorization: Bearer {TOKEN}`
            - `Content-Type: application/json`
            - A JSON body containing `title` and `content`
        2. The backend can return:
            - `401 Unauthorized` if the token is invalid
            - `415 Unsupported Media Type` if `Content-Type` is not `application/json`
            - `400 Bad Request` if JSON is invalid or note fields fail validation
            - `201 Created` with the created note object if the request is valid
        3. The frontend creates and displays a new note card when creation succeeds.
    - HTTPS is important because it encrypts data in transit (request and response), including sensitive headers like `Authorization`.
    - In local development, this project currently uses HTTP localhost; in deployment, HTTPS should be used to protect credentials and note content.

4. Environment Variable
    - `SECRET_TOKEN` is stored in the backend environment (`.env`) so only the server can verify authorization.
    - Putting `SECRET_TOKEN` in the frontend would expose it to users and break security.


