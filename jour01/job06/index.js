const fs = require('fs');

const contenu = fs.readFileSync('data.txt', 'utf-8');
console.log(contenu);