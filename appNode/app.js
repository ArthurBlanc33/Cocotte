const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();
const port = 3000;





// Définir le dossier public comme un dossier statique
app.use(express.static(path.join(__dirname, 'public')));

// Ajoutez cela après avoir configuré vos autres routes
app.use('/images', express.static(path.join(__dirname, 'public/images')));




app.use(express.static('/js/script'));




// Configuration d'express-session
app.use(session({
    secret: 'votreCleSecrete', // Changez ceci par une chaîne de caractères aléatoire et sécurisée
    resave: false,
    saveUninitialized: true,
}));

// Configuration d'EJS comme moteur de modèle
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));


// Configuration de Mongoose

mongoose.connect('mongodb+srv://Arthur:motdepasse@cluster0.kwfzfqx.mongodb.net/blog?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const routes = require('./routes/index');
app.use('/', routes);




// Écouter le serveur sur le port spécifié
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});

// Fermer la connexion MongoDB lorsque l'application est arrêtée