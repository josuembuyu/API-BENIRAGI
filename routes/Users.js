var express = require('express');
var router = express.Router();

var db = require("../models/db"),
    model = require("../models/Users");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//Inscription
router.post('/register', (req, res, next) => {
    var entity = require("../models/entities/Users").Users(),
        objetRetour = require("./ObjetRetour").ObjetRetour();

    entity.email = req.body.email;
    entity.password = req.body.password;
    entity.id_type = req.body.id_type;

    model.initialize(db);
    model.register(entity, (isCreated, message, result) => {
        objetRetour.getEtat = isCreated;
        objetRetour.getMessage = message;
        objetRetour.getObjet = result;

        res.status(200).send(objetRetour)
    })
})

//Connexion
router.post('/login', (req, res, next) => {
    var objetRetour = require("./ObjetRetour").ObjetRetour(),
        obj = {
            "email": req.body.email,
            "password": req.body.password
        };

    model.initialize(db);
    model.login(obj, (isLogged, message, result) => {
        objetRetour.getEtat = isLogged;
        objetRetour.getMessage = message;
        objetRetour.getObjet = result;

        res.status(200).send(objetRetour);
    })
})

//Pour la définition de la disponibilité
router.post('/toggleVisibility/:id_user', (req, res) => {
    var objetRetour = require("./ObjetRetour").ObjetRetour();

    model.initialize(db);
    model.toggleVisibility(req.params.id_user, (isToggle, message, result) => {
        objetRetour.getEtat = isToggle;
        objetRetour.getMessage = message;
        objetRetour.getObjet = result;

        res.status(200).send(objetRetour);
    })
})

module.exports = router;
