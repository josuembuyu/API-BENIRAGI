var db = require("./db");

var collection = {
    value: null
};

module.exports.initialize = (db) => {
    collection.value = db.get().collection("Jobs");
}

//Récupération des métier
module.exports.getJobs = (limit, callback) => {
    try {
        var limit = limit && parseInt(limit) ? {"$limit": parseInt(limit)} : {"$match": {}};

        collection.value.aggregate([
            {
                "$match": {}
            },
            limit
        ]).toArray((err, resultAggr) => {
            if (err) {
                callback(false, "Une erreur lors de la récupération des metier : " +err)
            } else {
                if (resultAggr.length > 0) {
                    callback(true, "Les metiers sont renvoyés", resultAggr)
                } else {
                    callback(false, "Aucun metier")
                }
            }
        })
    } catch (exception) {
        callback(false, "Une exceptiona été lévée de la récupération des metier : " + exception)
    }
}

//Recherche d'un job
module.exports.findOneById = (id, callback) => {
    try {
        collection.value.aggregate([
            {
                "$match": {
                    "_id": require("mongodb").ObjectId(id)
                }
            }
        ]).toArray((err, resultAggr) => {
            if (err) {
                callback(false, "Une erreur est survenue lors de la recherche du job : " +err)
            } else {
                if (resultAggr.length > 0) {
                    callback(true, "Le job y est", resultAggr[0])
                } else {
                    callback(false, "Ce job n'existe pas")
                }
            }
        })
    } catch (exception) {
        callback(false, "Une exceptiona été lévée lors de la recherche du job : " + exception)
    }
}

//Recherche intelligent d'un job
module.exports.searchJob = (value, callback) => {
    try {
        collection.value([
            {
                "$match": {
                    "$or": [
                        {"name": new RegExp(value, "i")},
                        {"describe": new RegExp(value, "i")}
                    ]
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "name": 1,
                    "icon": 1,
                    "describe": 1
                }
            }
        ]).toArray((err, resultAggr) => {
            if (err) {
                callback(false, "Une erreur lors de la recherche du job : " +err)
            } else {
                if (resultAggr.length > 0) {
                    callback(true, "Voici les jobs", resultAggr)
                } else {
                    callback(false, "Aucun job n'y correspond")
                }
            }
        })
    } catch (exception) {
        
    }
}