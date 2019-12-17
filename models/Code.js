var db_js = require("./db");

var collection = {
    value: null
}

module.exports.initialize = function (db_js) {

    collection.value = db_js.get().collection("Code");
}

/**
 * Module permettant de générer le code d'activation du compte au moment de l'inscription
 */
module.exports.generate = function (user, callback) {
    try {
        var entity = require("./entities/Code").Code();

        entity.id_user = "" + user._id;
        entity.code = Math.ceil(Math.random() * 34567);

        collection.value.insertOne(entity, function (err, result) {
            if (err) {
                callback(false, "Une erreur est survenue lors de la génération du code de confirmation : " + err)
            } else {
                if (result) {
                    user.code = result.ops[0].code
                    callback(true, "Le code est générer avec succès", user)
                } else {
                    callback(false, "Aucun code n'a été générer", user)
                }
            }
        })
    } catch (exception) {
        callback(false, "Une exception a été lévée lors de la génération du code de confirmation : " + exception)
    }
}