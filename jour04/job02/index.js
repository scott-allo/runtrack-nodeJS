const { MongoClient } = require('mongodb');
const fs = require('fs');
const readline = require('readline');

// Configuration
const MONGO_URI = "mongodb://localhost:27017/LaPlateforme";
const DB_NAME = "LaPlateforme";

// Job 3 - Création étudiants
async function createStudents(client) {
  const students = [
    { id: 1, lastname: "LeBricoleur", firstname: "Bob", students_number: 1001, year_id: 1 },
    { id: 2, lastname: "Doe", firstname: "John", students_number: 1002, year_id: 2 },
    { id: 3, lastname: "Dupont", firstname: "Marine", students_number: 1003, year_id: 3 }
  ];
  await client.db(DB_NAME).collection("student").insertMany(students);
}

// Job 4 - Création années
async function createYears(client) {
  const years = [
    { id: 1, year: "Bachelor 1" },
    { id: 2, year: "Bachelor 2" },
    { id: 3, year: "Bachelor 3" }
  ];
  await client.db(DB_NAME).collection("year").insertMany(years);
}

// Job 5 - Jointure étudiants/années
async function displayStudentsWithYears(client) {
  const pipeline = [
    { $lookup: { from: "year", localField: "year_id", foreignField: "id", as: "year_info" } },
    { $unwind: "$year_info" },
    { $project: { _id: 0, fullname: { $concat: ["$firstname", " ", "$lastname"] }, number: "$students_number", year: "$year_info.year" } }
  ];
  const results = await client.db(DB_NAME).collection("student").aggregate(pipeline).toArray();
  console.log("Liste des étudiants:");
  results.forEach(s => console.log(`- ${s.fullname} (${s.number}) : ${s.year}`));
}

// Job 6 - Filtre par numéro
async function filterByNumber(client) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const minNumber = await new Promise(resolve => rl.question('Numéro étudiant minimum : ', resolve));
  rl.close();

  const students = await client.db(DB_NAME).collection("student")
    .find({ students_number: { $gt: parseInt(minNumber) } })
    .sort({ students_number: 1 })
    .toArray();

  console.log(`Résultats (numéro > ${minNumber}):`);
  students.forEach(s => console.log(`${s.firstname} ${s.lastname} (${s.students_number})`));
}

// Job 7 - Recherche par nom
async function searchByName(client) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const name = await new Promise(resolve => rl.question('Nom à rechercher : ', resolve));
  rl.close();

  const student = await client.db(DB_NAME).collection("student").findOne({ lastname: new RegExp(name, 'i') });
  if (student) {
    const year = await client.db(DB_NAME).collection("year").findOne({ id: student.year_id });
    console.log(`Résultat: ${student.firstname} ${student.lastname} - ${year.year}`);
  } else {
    console.log("Aucun résultat");
  }
}

// Job 8 - Mise à jour cursus
async function updateYear(client) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const id = await new Promise(resolve => rl.question('ID étudiant : ', resolve));
  const yearId = await new Promise(resolve => rl.question('Nouvel ID année : ', resolve));
  rl.close();

  await client.db(DB_NAME).collection("student").updateOne(
    { id: parseInt(id) },
    { $set: { year_id: parseInt(yearId) } }
  );
  console.log("Mise à jour effectuée");
}

// Job 9 - Suppression étudiant
async function deleteStudent(client) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const id = await new Promise(resolve => rl.question('ID étudiant à supprimer : ', resolve));
  rl.close();

  await client.db(DB_NAME).collection("student").deleteOne({ id: parseInt(id) });
  console.log("Étudiant supprimé");
}

// Job 10 - Validation schéma
async function addValidation(client) {
  await client.db(DB_NAME).command({
    collMod: "student",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["id", "lastname", "firstname", "students_number", "year_id"],
        properties: {
          id: { bsonType: "int" },
          lastname: { bsonType: "string" },
          firstname: { bsonType: "string" },
          students_number: { bsonType: "int" },
          year_id: { bsonType: "int" }
        }
      }
    }
  });
  console.log("Validation activée");
}

// Job 11 - Export JSON
async function exportToJson(client) {
  const students = await client.db(DB_NAME).collection("student").find().toArray();
  const years = await client.db(DB_NAME).collection("year").find().toArray();
  fs.writeFileSync('export.json', JSON.stringify({ students, years }, null, 2));
  console.log("Export terminé (export.json)");
}

// Job 2 - Connexion et orchestration
async function main() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();

  // Réinitialisation
  await client.db(DB_NAME).collection("student").deleteMany({});
  await client.db(DB_NAME).collection("year").deleteMany({});

  // Exécution des jobs
  await createStudents(client);
  await createYears(client);
  await displayStudentsWithYears(client);
  await filterByNumber(client);
  await searchByName(client);
  await updateYear(client);
  await deleteStudent(client);
  await addValidation(client);
  await exportToJson(client);

  await client.close();
}

main().catch(console.error);