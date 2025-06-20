const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/LaPlateforme', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const studentSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    students_number: String,
    year_id: mongoose.ObjectId
});

const Student = mongoose.model('student', studentSchema);

// Routes de l'API
app.get('/etudiants', async (req, res) => {
    try {
        const etudiants = await Student.find();
        res.json(etudiants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/etudiant/:id', async (req, res) => {
    try {
        const etudiant = await Student.findById(req.params.id);
        if (!etudiant) return res.status(404).json({ message: 'Étudiant non trouvé' });
        res.json(etudiant);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/etudiants', async (req, res) => {
    const etudiant = new Student({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        students_number: req.body.students_number,
        year_id: req.body.year_id
    });

    try {
        const nouvelEtudiant = await etudiant.save();
        res.status(201).json(nouvelEtudiant);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/etudiant/:id', async (req, res) => {
    try {
        const etudiant = await Student.findByIdAndDelete(req.params.id);
        if (!etudiant) return res.status(404).json({ message: 'Étudiant non trouvé' });
        res.json({ message: 'Étudiant supprimé' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/etudiant/:id', async (req, res) => {
    try {
        const etudiant = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!etudiant) return res.status(404).json({ message: 'Étudiant non trouvé' });
        res.json(etudiant);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Démarrage du serveur
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`API démarrée sur http://localhost:${PORT}`);
});