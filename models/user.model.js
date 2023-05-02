const mongoose = require ("mongoose")
const { isEmail } = require("validator")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema (
    {
        pseudo: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 40,
            unique: true,
            trim: true //permet de supprimer les espaces si l'utilisateur en laisse après ses infos
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail], //on telecharge la bibliotheque npm validator pour ca
            lowercase: true, //pas de majuscules acceptées
            unique: true, //pk ca marche pas?
            trim: true
        },
        password: {
            type: String,
            required: true,
            max: 1024,
            minLength: 6,
        },
        picture: {
            type: String,
            default: "./uploads/profil/random-user.png", //on met une image par defaut à l'utilisateur
        },
        bio: {
            type: String,
            max: 1024,
        },
        followers: {
            type: [String]
        },
        following: {
            type: [String]
        },
        likes: {
            type: [String]
        }
    },
    {
    timestamps: true, // a timestamps permet de récupérer les dates les heures etc (createdAt, updatedAt sont crées dans l'objet renvoyé)
    }   
)

userSchema.pre("save", async function(next) { //pre save signifie avant d'enregistrer le client dans la DB / on crée une promesse pour pour attendre que le mot de passe soit salé
    const salt  = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt) //le this ne marche pas ans une fonction fléchée
    next()
})

const UserModel = mongoose.model("user", userSchema) 

module.exports = UserModel