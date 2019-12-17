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