const http = require('http');

function createServer(routeHandler) {
  const server = http.createServer((req, res) => {
    routeHandler(req, res);
  });

  return server;
}

module.exports = createServer;