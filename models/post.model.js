const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema ( 
    {
        posterId : {
            type: String,
            required: true
        },
        message : {
            type: String, 
            trim: true,
            maxlength: 500
        },
        picture : {
            type: String
        },
        video : {
            type: String
        },
        likers : {
            type: [String],
            required: true
        }, 
        comments : {
            type : [
                {
                 commenterId: String,
                 commenterPseudo: String,
                 text: String,
                 timestamps: Number

                }
            ],
            required: true // ca nous permet de créer le tableau de base
        }
    },
    {
        timestamps : true // on recupere le timestamps de l'objet en dehors de l'objet
    }
)

module.exports = mongoose.model("post", PostSchema) // ici post est le nom de la table sur MongoDB