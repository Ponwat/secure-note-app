require('dotenv').config();
const http = require('http');

const dbUser = process.env.DB_USER;
const apiKey = process.env.API_KEY;

console.log(`Database User: ${dbUser}`);
console.log(`API Key: ${apiKey}`);

const port = process.env.PORT;
const secretToken = process.env.SECRET_TOKEN;

console.log(`Port: ${port}`);
console.log(`Secret Token: ${secretToken}`);


const hostname = '127.0.0.1';
// const port = 3000;

const server = http.createServer((req, res) => {
    console.log(`Raw request URL: ${req.url}`);
    console.log(`Raw request method: ${req.method}`);
    console.log('Raw request headers:', req.headers);

    res.writeHead(200, { 'Content-Type': 'text/plain' });

    res.end('Hello World! This is a raw HTTP response.');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

