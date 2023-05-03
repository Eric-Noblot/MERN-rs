const UserModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const maxAge = 3 * 24 * 60 * 60 * 1000 //en est en millisecondes, le premier chiffre (3) coreespond aux nombres de jours (le reste c'est pour calculer 24h)
//const signUpErrors = require("../utils/errors.utils")
const {signUpErrors, signInErrors} = require("../utils/errors.utils")

const createToken = (id) => {
    return jwt.sign({id}, process.env.SECRET_TOKEN, {
        expiresIn: maxAge
    })
}

module.exports.signUp = async (req, res, next) => {
    console.log(req.body)
    const {pseudo, email, password} = req.body

    try{
        const user = await UserModel.create({ pseudo, email, password })
        res.status(201).json({user: user._id})
    }
    catch(err){
        const errors = signUpErrors(err)
        res.status(200).send({errors})
    }
} 


module.exports.signIn = async (req, res) => {
    const { email, password } = req.body

    try{
        const user = await UserModel.login(email, password)
        const token = createToken(user._id)
        console.log(token)
        res.cookie("jwt", token, {httpOnly: true, maxAge:maxAge})
        res.status(200).json({user: user._id})
    } catch (err) {
        const errors = signInErrors(err)
        res.status(200).json({ errors })
    }
}

module.exports.logout = async (req, res) => {

    try{
        res.cookie("jwt", "", { maxAge: 1}) // quand on LOGOUT on supprimre le token en lui précisant le nom du token, une string vide et une durée de vie de 1 milliseconde
        res.redirect("/") // on redirige vers une page pour que ca marche dans postman (meme si ca fait)
    } catch {
        res.status(400).send({err})
    }
}