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
            minlength: 6,
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

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email })
    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user
        }
        throw Error("incorrect password")
    }
    throw Error("incorrect email")
}
// on crée le UserSchema statics car quand on envoie une requete de login via postman ca ne marche pas car le mot
// de passe qu'on rentre (eric33 par ex) n'est pas le meme qui est présent dans la base de donnée(il a été salé)
// On récupère donc dans une fonction l'email de la requete (qui est unique), et on compare le mdp de l'user avec le salé
// grace a bcrypt.compare qui lui sait de quelle origine vient le hash


const UserModel = mongoose.model("user", userSchema) 
module.exports = UserModel