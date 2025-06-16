const fs = require('fs');

fs.readFile('data.txt', 'utf-8', (err, contenu) => {
  if (err) throw err;
  console.log(contenu);
});