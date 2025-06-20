const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/etudiants', async (req, res) => {
    try {
        
        const response = await axios.get('http://localhost:4000/etudiants');
        let html = '<h1>Liste des étudiants</h1><ul>';
        response.data.forEach(etudiant => {
            html += `<li>${etudiant.firstname} ${etudiant.lastname} (${etudiant.students_number})</li>`;
        });
        html += '</ul>';
        res.send(html);
    } catch (err) {
        res.status(500).send('Erreur lors de la récupération des étudiants');
    }
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});


app.listen(8080, () => {
    console.log('Serveur démarré sur http://localhost:8080');
});