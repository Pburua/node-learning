const http = require('http');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    res.setHeader('Content-Type', 'text/html');

    if (url === '/' && method === 'GET') {
        res.write('<html>');
        res.write('<head><title>Assignment 1</title></head>');
        res.write('<body>');
        res.write('<form action="/create-user" method="POST">');
        res.write('<input type="text" name="username"><button type="submit">Submit username</button>');
        res.write('</form>');
        res.write('</body>');
        res.write('</html>');
        return res.end();

    } else if (url === '/users' && method === 'GET') {
        res.write('<html>');
        res.write('<head><title>Assignment 1</title></head>');
        res.write('<body>');
        res.write('<ul>');
        res.write('<li>User 1</li>');
        res.write('<li>User 2</li>');
        res.write('<li>User 3</li>');
        res.write('<li>User 4</li>');
        res.write('</ul>');
        res.write('</body>');
        res.write('</html>');
        return res.end();

    } else if (url === '/create-user' && method === 'POST') {
        const body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        })

        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const username = parsedBody.split('=')[1];

            console.log(username);

            res.statusCode = 302;
            res.setHeader('Location', '/');
            res.end();
        })
    }
});

server.listen(3000);

console.log(`Server is listening on port ${3030}!`);
