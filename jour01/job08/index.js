const fs = require('fs');

fs.readFile('data.txt', 'utf-8', (err, contenu) => {
  if (err) throw err;
  let resultat = '';
  for (let i = 0; i < contenu.length; i += 2) {
    resultat += contenu[i];
  }
  console.log(resultat);
});