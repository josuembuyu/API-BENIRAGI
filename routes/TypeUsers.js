var express = require('express');
var router = express.Router();

var model = require("../models/TypeUsers");
var db = require("../models/db");


//Pour créer des types, utilisables pour l'admin
router.post('/create', (req, res) => {
    var entity = require("../models/entities/TypeUsers").TypeUsers(),
        objetRetour = require("./ObjetRetour").ObjetRetour();

    entity.intitule = req.body.intitule;

    model.initialize(db);
    model.create(entity, (isCreated, message, result) => {
        objetRetour.getEtat = isCreated;
        objetRetour.getMessage = message;
        objetRetour.getObjet = result;

        res.status(200).send(objetRetour);
    })
})

//Récupération de type pour le mettre dans un combo
router.get('/getAll', (req, res) => {
    var objetRetour = require("./ObjetRetour").ObjetRetour();

    model.initialize(db);
    model.getAll((isGet, message, result) => {
        objetRetour.getEtat = isGet;
        objetRetour.getMessage = message;
        objetRetour.getObjet = result;

        res.status(200).send(objetRetour);
    })
})

module.exports = router;