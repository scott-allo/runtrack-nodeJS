const http = require('http');

const serveur = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World !');
});

serveur.listen(8888, () => {
  console.log('Serveur démarré sur le port 8888');
});