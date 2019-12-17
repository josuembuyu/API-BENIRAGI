var db = require("../db");

var collection = {
    value: null
};

module.exports.initialize = (db) => {
    collection.value = db.get().collection("Jobs");
}

//Création des métier
module.exports.create = (newJobs, callback) => {
    try {
        collection.value.insertOne(newJobs, (err, result) => {
            if (err) {
                callback(false, "Une erreur lors de l'ajout du metier : " +err)
            } else {
                if (result) {
                    callback(true, "Le metier est ajouté", result.ops[0])
                } else {
                    callback(false, "Aucun enregistrement")
                }
            }
        })
    } catch (exception) {
        callback(false, "Une exception a été lévée lors de l'ajout du metier : " + exception)
    }
}