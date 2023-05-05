const UserModel = require('../models/user.model')
const fs = require("fs") 
const { promisify } = require("util")
const pipeline = promisify(require("stream").pipeline)
const {uploadErrors} = require ("../utils/errors.utils.js")

module.exports.uploadProfil = async (req, res) => { //POST http://localhost:5000/api/user/upload (on va dans Body(query) key : file value  rgtf.jpg, puis key: name value "nameDeLaPhoto", ^puis userId "505605vdv5v59")
    try {
        if (
            req.file.detectedMimeType !== "image/jpg" &&
            req.file.detectedMimeType !== "image/png" &&
            req.file.detectedMimeType !== "image/jpeg" 
        )
        throw Error("Invalid file") //un throw permet d'arreter directement le try et d'aller direct au catch

        if (req.file.size > 500000) throw Error("max size") //50000 ko
        } catch (err){
            const errors = uploadErrors(err)
        return res.status(201).json( {errors})
    }
    const fileName = req.body.name + ".jpg"  //on force l'image en jpg

    await pipeline ( //pipeline nous permet de créer via fs le fichier
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../client/public/uploads/profil/${fileName}`
        )
    )

    try {
        await UserModel.findByIdAndUpdate(
            req.body.userId,
            { $set : {picture: "./uploads/profil/" + fileName}},
            { new: true, upsert: true, setDefaultsOnInsert: true},
            (err, data) => {
                if (!err) return res.send(data)
                else return res.status(500).send({ message: err })
            }
        )
    } catch (err) {
        return res.status(500).send({ message : err })
}
}



//npm i multer@2.0.0-rc.1