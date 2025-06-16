const path = require('path');
const cheminFichier = __filename;

console.log(`Nom du fichier: ${path.basename(cheminFichier)}`);
console.log(`Extension du fichier: ${path.extname(cheminFichier)}`);
console.log(`Répertoire parent du fichier: ${path.dirname(cheminFichier)}`);