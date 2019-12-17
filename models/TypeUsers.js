var db = require("./db");

var collection = {
    value: null
}

//Pour initialisation
module.exports.initialize = (db) => {

    collection.value = db.get().collection("typeUsers");
}

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

module.exports.getAll = (callback) => {
    try {
        collection.value.aggregate([
            {
                "$match": {
                    "flag": true
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "intitule": 1
                }
            }
        ]).toArray((err, resultAggr) => {
            if (err) {
                callback(false, "Erreur de recupération des types : " + err)
            } else {
                if (resultAggr.length > 0) {
                    callback(true, "les resultats", resultAggr)
                } else {
                    callback(false, "Il nl'y en a aucun")
                }
            }
        })
    } catch (exception) {
        callback(false, "Exception lors de la recupération des types : " + exception)
    }
}

module.exports.findOne = (id, callback) => {
    try {
        collection.value.aggregate([
            {
                "$match": {
                    "_id": require("mongodb").ObjectId(id),
                    "flag": true
                }
            }
        ]).toArray((err, resultAggr) => {
            if (err) {
                callback(false, "Une erreur de recherche de type : " + err)
            } else {
                if (resultAggr.length > 0) {
                    callback(true, "Le type y est", resultAggr[0])
                } else {
                    callback(false, "Ce type n'existe pas ou n'est pas autorisé")
                }
            }
        })
    } catch (exception) {
        callback(false, "Une exception de recherche de type : " + exception)
    }
}

module.exports.isEmployer = (id, callback) => {
    try {
        collection.value.aggregate([
            {
                "$match": {
                    "_id": require("mongodb").ObjectId(id),
                    "intitule": new RegExp("Employeur", "i")
                }
            }
        ]).toArray((err, resultAggr) => {
            if (err) {
                callback(false, "Une erreur de détermination : " + err)
            } else {
                if (resultAggr.length) {
                    callback(true, "Est employeur")
                } else {
                    callback(false, "N'est pas employeur")
                }
            }
        })
    } catch (exception) {
        callback(false, "Une exception de détermination : " + exception)
    }
}