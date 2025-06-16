// index.js
const http = require('http');
const fs = require('fs');

const serveur = http.createServer((req, res) => {
  fs.readFile('index.html', (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Fichier non trouvé');
    } else {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(data);
    }
  });
});

serveur.listen(3333);