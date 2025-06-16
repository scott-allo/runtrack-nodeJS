const fs = require('fs');

const nouveauContenu = "Je manipule les fichiers avec un module node !";
fs.writeFileSync('data.txt', nouveauContenu);