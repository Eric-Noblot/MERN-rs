const jwt = require("jsonwebtoken")
const UserModel = require("../models/user.model")

module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt // on peut recupere la valeur de req ave le cookie qu'on a ajouté lors du POST login
    if (token) {
        jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null
                res.cookie("jwt", "", { maxAge: 1})
                next()
            } else {
                let user = await UserModel.findById(decodedToken.id)
                res.locals.user = user  
                //console.log("2 - ", res.locals.user)
                next()
            }
        })
            } else { 
                res.locals.user = null 
                next()
    }
 }

module.exports.requireAuth = (req, res, next) =>{
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) => {
            if (err) {
                console.log(err)        //en ne mettant pas de next on bloque l'acces aux autres middleware, 
            } else {
                console.log(decodedToken.id)
                next()
            }
        })
    } else {
        console.log("No token")
    }
}