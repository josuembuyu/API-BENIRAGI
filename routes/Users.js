var express = require('express');
var router = express.Router();

var db = require("../models/db"),
    model = require("../models/Users");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

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

module.exports = router;
