const url = require('url');

const URL = "https://www.google.com&search=nodejs";
const urlAnalysee = new url.URL(URL.replace('&', '?'));

console.log(`Protocole : ${urlAnalysee.protocol}`);
console.log(`Nom d'hôte : ${urlAnalysee.hostname}`);
console.log(`Paramètres de l'URL : ${JSON.stringify(Object.fromEntries(urlAnalysee.searchParams))}`);

urlAnalysee.hostname = "www.laplateforme.io";
console.log(`Nouvelle URL après modification du nom d'hôte : ${urlAnalysee.toString()}`);

urlAnalysee.searchParams.append('lang', 'fr');
console.log(`Nouvelle URL après ajout d'un paramètre : ${urlAnalysee.toString()}`);