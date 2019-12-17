var express = require('express');
var router = express.Router();

var db = require("../../models/db"),
    model = require("../../models/admin/Jobs");

//Création des métier
router.post('/create', (req, res) => {
    var entity = require("../../models/entities/Jobs").Jobs(),
        objetRetour = require("../ObjetRetour").ObjetRetour();
    
    entity.name = req.body.nom;
    entity.icon = req.body.icon;
    entity.describe = req.body.describe;

    model.initialize(db);
    model.create(entity, (isCreated, message, result) => {
        objetRetour.getEtat = isCreated;
        objetRetour.getMessage = message;
        objetRetour.getObjet = result;

        res.status(200).send(objetRetour);
    })
})

module.exports = router;