var db = require("../db");

var collection = {
    value: null
}

//Pour initialisation
module.exports.initialize = (db) => {

    collection.value = db.get().collection("TypeUsers");
}

//Création des types d'utilisateurs
module.exports.create = (new_type_user, callback) => {
    try {
        collection.value.insertOne(new_type_user, (err, result) => {
            if (err) {
                callback(false, "Une erreur de type : " + err)
            } else {
                callback(true, "Enregistrer avec succès", result.ops[0])
            }
        })
    } catch (exception) {
        callback(false, "Une exception sur le type : " + exception)
    }
}