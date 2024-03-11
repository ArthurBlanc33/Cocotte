const express = require('express');
const router = express.Router();
const Article = require('../models/article'); // Assurez-vous du bon chemin vers votre modèle
const User = require('../models/user');
const multer = require('multer');
const path = require('path');

const bcrypt = require('bcrypt');




// Définir la route pour la page d'accueil

router.get('/', (req, res) => {
    const userRole = req.session.user ? req.session.user.role : 'guest';
    res.render('pages/index', { userRole, user: req.session.user });
});


// Définissez le dossier de destination pour les fichiers téléchargés
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// Configurez Multer avec le stockage défini
const upload = multer({ storage: storage });







router.get('/register', (req, res) => {
    res.render('pages/register'); // Assurez-vous que vous avez une vue appelée 'register'
});

router.post('/register', async(req, res) => {
    const { username, password } = req.body;

    try {
        // Vérifiez si l'utilisateur existe déjà
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.render('register', { error: 'Nom d\'utilisateur déjà pris' });
        }

        // Créez un nouvel utilisateur
        const newUser = new User({ username, password });

        // Enregistrez l'utilisateur dans la base de données
        await newUser.save();

        // Redirigez l'utilisateur vers une page de confirmation ou une autre page appropriée
        res.redirect('/login'); // Vous devrez créer la page de connexion
    } catch (error) {
        console.error(error);
        res.render('register', { error: 'Une erreur s\'est produite lors de l\'inscription' });
    }
});
router.get('/login', (req, res) => {
    res.render('pages/login')
});

router.post('/login', async(req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && user.password === password) {
            // Authentification réussie
            req.session.user = user; // Stocke l'utilisateur dans la session
            res.redirect('/admin-dashboard'); // Redirige vers la page de tableau de bord
        } else {
            // Authentification échouée
            res.render('pages/login', { error: 'Nom d\'utilisateur ou mot de passe incorrect.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur de serveur');
    }
});

router.get('/dashboard', (req, res) => {
    // Vérifie si l'utilisateur est connecté
    if (req.session.user) {
        const userId = req.session.user; // Assurez-vous que c'est le bon champ pour l'identifiant de l'utilisateur

        res.render('pages/dashboard', { userId });
    } else {
        res.redirect('/login'); // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
    }
});

router.get('/admin-dashboard', async(req, res) => {
    try {
        // Vérifie si l'utilisateur est connecté
        if (req.session.user) {
            const userId = req.session.user; // Assurez-vous que c'est le bon champ pour l'identifiant de l'utilisateur

            // Récupérer la liste des articles depuis la base de données
            const articles = await Article.find();

            // Rendre la vue en passant les variables dans un seul objet
            res.render('pages/admin-dashboard', { userId, articles });
        } else {
            res.redirect('/login'); // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des articles :', error);
        res.status(500).send('Erreur lors de la récupération des articles');
    }
});




router.get('/logout', (req, res) => {
    // Déconnectez l'utilisateur en détruisant la session
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la déconnexion :', err);
            return res.redirect('/dashboard'); // Redirigez vers le tableau de bord en cas d'erreur
        }
        res.redirect('/'); // Redirigez vers la page d'accueil après la déconnexion
    });
});


// Route pour afficher la liste des articles
router.get('/articles', async(req, res) => {
    try {
        // Récupérer tous les articles depuis la base de données
        const articles = await Article.find();
        res.render('pages/articles', { articles: articles }); // Assurez-vous que vous passez correctement les articles à la vue
    } catch (error) {
        console.error('Erreur lors de la récupération des articles :', error);
        res.status(500).send('Erreur lors de la récupération des articles');
    }
});

// Exemple dans votre route article-details
router.get('/article-details/:articleId', async(req, res) => {
    const articleId = req.params.articleId;

    try {
        // Récupérer l'article par son identifiant depuis la base de données
        const selectedArticle = await Article.findById(articleId);

        if (!selectedArticle) {
            res.status(404).send('Article non trouvé');
        } else {
            // Passer la variable 'path' au rendu de la page
            res.render('pages/article-details', {
                article: selectedArticle,
                headPartial: 'partials/head',
                headerPartial: 'partials/header',
                footerPartial: 'partials/footer',
                scriptPath: '/js/script.js',
                path: path // Ajoutez cette ligne
            });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'article :', error);
        res.status(500).send('Erreur lors de la récupération de l\'article');
    }
});




// Route pour supprimer un article

// index.js (ou le fichier où vous définissez vos routes)

// Route pour supprimer un article
router.post('/delete-article/:articleId', async(req, res) => {
    const articleId = req.params.articleId;

    try {
        // Vérifie si l'utilisateur est un administrateur
        if (req.session.user && req.session.user.role === 'admin') {
            // Utilisez la méthode Mongoose pour supprimer l'article par son ID
            await Article.findByIdAndDelete(articleId);

            // Redirigez l'utilisateur vers une page appropriée après la suppression
            res.redirect('/articles');
        } else {
            // Redirigez vers une page d'erreur ou une autre page appropriée si l'utilisateur n'est pas un administrateur
            res.status(403).send('Accès interdit');
        }
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'article :', error);
        res.status(500).send('Erreur lors de la suppression de l\'article');
    }
});

module.exports = router;




router.get('/create', (req, res) => {
    res.render('pages/create');
});


router.post('/creer-article', upload.single('articleImage'), async(req, res) => {
    const { articleTitle, articleHashtags, articleContent, articleMode } = req.body;

    // Vérifiez si le titre de l'article est fourni
    if (!articleTitle) {
        return res.status(400).send('Le titre de l\'article est requis');
    }

    // Obtenez le chemin de l'image téléchargée
    const imagePath = req.file ? req.file.path : '';

    // Créer un nouvel article dans la base de données avec la date actuelle
    const newArticle = new Article({
        title: articleTitle,
        hashtags: articleHashtags,
        content: articleContent,
        mode: articleMode,
        imagePath: imagePath,
        date: new Date() // Ajoutez la date actuelle à l'article
    });

    try {
        // Sauvegarder le nouvel article
        await newArticle.save();
        res.redirect('/articles'); // Rediriger vers la liste des articles après création
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'article :', error);
        res.status(500).send('Erreur lors de la sauvegarde de l\'article');
    }
});





module.exports = router;