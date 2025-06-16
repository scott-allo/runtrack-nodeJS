const fs = require('fs');

const fichiers = fs.readdirSync('./');
console.log('Contenu du répertoire courant :');
fichiers.forEach(fichier => {
  console.log(`- ${fichier}`);
});