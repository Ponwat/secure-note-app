# Report
1. JS Engine vs. Runtime
    - The frontend uses V8 Engine and Browser Runtime Environment
    - The backend uses V8 Engine and Node.js Runtime Environment
2. DOM
    - The frontend manipulate DOM by getElementById(#id) to select element to manipulate.
    - Add note by use appendChild(Note) on #notes-container element.
    - Do popup for create note form by add and remove class '.hidden' on #add-new-note-form-layer element.
3. HTTP/HTTPS
    - When you click "Submit".
        1. The website send POST request to the server with
            - Authorization header with value of "Bearer {TOKEN}"
            - Content-Type header with value of "application/json"
            - Body that is JSON object with "title" and "content" field
        2. Then the server will response with
            - 401 Unauthorized if the TOKEN was not correct
            - 400 Bad Request if the body does not have title or content field
            - 201 Created with the Note object if the request is correct
        3. Then the website create new Note card if the response is Created
        4. Then put it and display inside noteContainer.
    - The HTTPS is important for encrypt data in transit when the request is sending to the server or the server responding to the website
    - If HTTPS was not use. The data will be the plain text and anyone can read the sensitive data like Authorization Header
    - Uses HTTPS will encrypt the data so anyone can not read the sensitive data like Authorization Header
4. Environment Variable
    - We store the SECRET_TOKEN in the backend .env file because we want only authorized user to access the data
    - If we put it in the frontend everyone will be able to access the data


