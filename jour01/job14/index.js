const http = require('http');
const fs = require('fs');
const path = require('path');

const serveur = http.createServer((req, res) => {
  let cheminFichier = '';
  
  if (req.url === '/') {
    cheminFichier = path.join(__dirname, 'index.html');
  } else if (req.url === '/about') {
    cheminFichier = path.join(__dirname, 'about.html');
  } else {
    cheminFichier = path.join(__dirname, 'error.html');
  }
  
  fs.readFile(cheminFichier, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Erreur serveur');
    } else {
      const codeStatut = cheminFichier.includes('error.html') ? 404 : 200;
      res.writeHead(codeStatut, {'Content-Type': 'text/html'});
      res.end(data);
    }
  });
});

serveur.listen(8887);