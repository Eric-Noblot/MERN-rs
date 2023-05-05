module.exports.signUpErrors = (err) => {
    let errors = { pseudo: "", email: "", password: "" }

    if (err.message.includes("pseudo"))
    errors.pseudo = "Pseudo incorrect ou déjà pris"

    if (err.message.includes("email"))
    errors.email = "Email incorrect ou déjà pris"

    if (err.message.includes("password"))
    errors.password = "Erreur sur le mot de passe"

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
    errors.email = "Cet pseudo est déjà enregistré"

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
    errors.email = "Cet email est déjà enregistré"

    return errors
}

// Lorsqu'on recoit une erreur dans postman, on voit que dans la reponse err se trouve un objet qui contient 
// des infos notamment sur le message de l'erreur ou encore le code renvoyé.
// La méthode Object.keys() renvoie un tableau contenant les noms des propriétés propres à un objet

module.exports.signInErrors = (err) => {
    let errors = { email: "", password: ""}

    if (err.message.includes("email"))
    errors.email = "Email inconnu"

    if (err.message.includes("password"))
    errors.password = "Le mot de passe ne correspond pas"

    return errors
}

module.exports.uploadErrors = (err) => {

    let errors = {format: "", maxSize: ""}          //c'est le format qu'on revoie dans err si on postman

    if (err.message.includes("invalid file")) 
    errors.format = "Format incompatible"

    if (err.message.includes("max size"))
    errors.maxSize = "Le fichier dépasse 500ko"
          
    return errors
}