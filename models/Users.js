var db = require("./db"),
    bcrypt = require("bcryptjs"),
    nodemailer = require("nodemailer");

var collection = {
    value: null
};

module.exports.initialize = (db) => {
    collection.value = db.get().collection("Users");
}

module.exports.register = (newUser, callback) => {
    try {
        //On commence par crypter le mot de passe        
        var valeur_pwd = "Beniragi" + newUser.password + "jach";

        bcrypt.hash(valeur_pwd, 10, function (errHash, hashePwd) {

            if (errHash) { //Si une erreure survient lors du hashage du mot de passe
                callback(false, "Une erreur est survenue lors du hashage du mot de passe : " + errHash);
            } else { //Si non le mot de passe a été bien hashé

                newUser.password = hashePwd;

                testEmail(newUser, (isNotExist, message, result) => {
                    if (isNotExist) {
                        let type_users = require("./TypeUsers");

                        type_users.initialize(db);
                        type_users.findOne(newUser.id_type, (isFound, messageType, resultType) => {
                            if (isFound) {
                                newUser.id_type = "" + resultType._id;
                                //On appele la méthode insertOne (une methode propre à mongoDB) de notre collection qui doit prendre la structure de l'entité
                                collection.value.insertOne(newUser, (err, result) => {

                                    //On test s'il y a erreur
                                    if (err) {
                                        callback(false, "Une erreur est survénue lors de la création de l'utilisateur", "" + err);
                                    } else { //S'il n'y a pas erreur

                                        //On vérifie s'il y a des résultat renvoyé
                                        if (result) {
                                            //callback(true, "L'utilisateur est enregistré", result.ops[0])
                                            var code = require("./Code");

                                            code.initialize(db);
                                            code.generate(result.ops[0], (isGenerate, message, resultWithCode) => {
                                                if (isGenerate) {
                                                    sendCode(resultWithCode, (isSend, message, resultSend) => {
                                                        if (isSend) {
                                                            callback(true, "Le code est envoyé à votre adresse e-mail", resultWithCode)
                                                        } else {
                                                            callback(true, "Verifier votre connexion à internet puis demandé un nouveau code", resultWithCode)
                                                        }
                                                    })
                                                } else {
                                                    callback(true, "Demandé un nouveau code", result.ops[0])
                                                }
                                            })

                                        } else { //Si non l'etat sera false et on envoi un message
                                            callback(false, "Désolé, l'utilisateur non enregistrer")
                                        }
                                    }
                                })
                            } else {
                                callback(false, messageType)
                            }
                        })
                    } else {
                        callback(false, message)
                    }
                })

            }
        })
    } catch (exception) {

    }
}

//Pour tester l'adresse e-mail
function testEmail(user, callback) {
    if (user.email) {
        if (/^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/i.test(user.email)) {
            collection.value.aggregate([
                {
                    "$match": {
                        "email": user.email
                    }
                }
            ]).toArray((err, resultAggr) => {
                if (err) {
                    callback(false, "Une erreur est survenue lors du test de l'adresse e-mail : " + err)
                } else {
                    if (resultAggr.length > 0) {
                        callback(false, "Adresse e-mail déjà utilisé")
                    } else {
                        callback(true, "Autorisation accordé")
                    }
                }
            })
        } else {
            callback(false, "Le format d'adresse est invalide")
        }

    } else {
        callback(false, "Aucun adresse e-mail n'est spécifié")
    }
}

function sendCode(account, callback) {

    const output = 'Votre code de confirmation : <b style="color: #ff4500; font-family: Century Gothic; font-size: 1.4em">' + account.code + '</b><br>e-Bantu, votre parcours commence maintenant';

    let transporter = nodemailer.createTransport({
        host: "smtp.live.com",
        port: 587,
        secure: false,
        auth: {
            user: "frdrcpeter@hotmail.com",
            pass: "tubemate123"
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: '"e-Bantu / Le côté magique du commerce" <frdrcpeter@hotmail.com>',
        to: account.email,
        subject: "Activation de compte",
        html: output
    };

    transporter.sendMail(mailOptions, (error, info) => {

        if (error) {
            console.log("Erreur d'envoi de mail");
            console.log(error);
            callback(false, "Code de confirmation non-envoyé : " + error, account)
        } else {
            console.log("Mail envoyé avec succès");
            callback(true, "Code envoyé avec succès", account)
        }

        transporter.close();

    })
}

//Récupère les details pour un user
module.exports.findOneById = (id, callback) => {
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
                    var type = require("./TypeUsers");

                    type.initialize(db);
                    type.getTypeForUser(obj, (isGet, message, resultWithType) => {
                        if (isGet) {
                            callback(true, message, resultWithType)
                        } else {
                            callback(false, "Pas de type défini, ça nous impossible de vous donner les détails")
                        }
                    })
                } else {
                    callback(false, "Ce user n'existe pas ou n'est pas autorisé")
                }
            }
        })
    } catch (exception) {
        callback(false, "Une exception de recherche de user : " + exception)
    }
}

//Module d'activation du compte
module.exports.activateAccount = (obj, callback) => {
    try {
        var filter = {
                "_id": require("mongodb").ObjectId(obj.id_user)
            },
            update = {
                "$set": {
                    "visibility": true,
                    "flag": true
                }
            };

            collection.value.updateOne(filter, update, (err, result) => {
                if (err) {
                    callback(false, "Une erreur lors de la mise à jour du flag du user: " +err)
                } else {
                    if (result) {
                        callback(true, "Le compte a été activé", result)
                    } else {
                        callback(false, "Aucune mise à jour")
                    }
                }
            })
    } catch (exception) {
        callback(false, "Une exception a été lévée de la mise à jour du flag du user: " + exception)
    }
}