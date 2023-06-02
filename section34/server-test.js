const http = require('http');

const port = 8080;

const server = http.createServer((_req, res) => {
  res.end("Hello Node?")
});

server.listen(port, () => {
  console.log(`Server listeening on ${port}`)
});
