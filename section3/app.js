const http = require('http');
const requestListener = require('./routes');

const server = http.createServer(requestListener);

server.listen(8080);

console.log(`Server is listening on port ${8080}!`);
