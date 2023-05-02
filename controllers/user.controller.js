const UserModel = require("../models/user.model");
const ObjectId = require("mongoose").Types.ObjectId;

// exports.getAllUsers = (req, res, next) => {
//     UserModel.find()
//       .then(users => res.status(200).json(users))
//       .catch(error => res.status(400).json({ error }));
//   }

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password"); //select permet d'enlever des infos quand on renvoie les User avec le Get
  res.status(200).json(users);
};

module.exports.getOneUser = (req, res) => {
  console.log(req.params);
  if (!ObjectId.isValid(req.params.id))
    // on test si on trouve pas l'Id grace a isValid qui est une fonction intégrée
    return res.status(400).json("Id unknown: " + req.params.id);

  UserModel.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(404).json({ error }));
};
//------------------------------------
// module.exports.updateOneUser = async (req, res, next) => {
//     if (!ObjectId.isValid(req.params.id))
//         return res.status(400).send("Id unknown: " + req.params.id)

//     try {
//         await UserModel.findOneAndUpdate (
//             {_id: req.params.id},
//             {
//                 $set: {
//                     bio: req.body.bio
//                 }
//             },
//             {new: true, upsert: true, setDefaultOnInsert: true},
//             (err, data) => {
//                 if (!err) return res.send(data)
//                 if (err) return res.status(500).send({message :err})
//             }
//         )
//     } catch (err) {
//         return res.status(500).json({message: err})
//     }
// }
//-----------------

// }

module.exports.updateOneUser = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("Id unknown: " + req.params.id);
  const userId = req.params.id;
  const user = await UserModel.findByIdAndUpdate(userId, req.body).select(
    "-password"
  ); //on passe par postman donc on recupere avec req.body
  res.send(user);
};

// module.exports.deleteOneUser = async (req, res, next) => {
//     if (!ObjectId.isValid(req.params.id))
//         return res.status(400).send("Id unknown: " + req.params.id)
//     try {
//         await UserModel.remove({_id: req.params.id}).exec()
//         res.status(200).json({ message: "Successfully deleted !"})
//     } catch(err) {
//         return res.status(500).json({message: err})
//     }
// }

module.exports.deleteOneUser = (req, res, next) => {
  UserModel.findOne({ _id: req.params.id })
    .then((user) => {
      UserModel.deleteOne({ _id: req.params.id })
        .then(() => {
          res.status(200).json({ message: "Objet supprimé !" });
        })
        .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

    // FOLLOW / UNFOLLOW

module.exports.follow = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("Id unknown: " + req.params.id);

    try {
        //add to the follower list
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { following: req.body.idToFollow}},
            {new: true, upsert: true},
            (err, data) => {
                if (!err) res.status(201).json(data)
                else return res.status(400).json(err)
            }
        )
        await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            { $addToSet: { followers: req.params.id}},
            {new: true, upsert: true},
            (err, data) => {
                //if (!err) res.status(201).json(data)
                if (err) return res.status(400).json(err)
            }
        )
    }catch (err) {
        return res.status(500).json({message: err})
    }
}

// module.exports.unfollow = async (req, res, next) => {
//     if (!ObjectId.isValid(req.params.id))
//     return res.status(400).send("Id unknown: " + req.params.id);

//     try {
        

//     }catch (err) {
//         return res.status(500).json({message: err})
//     }
// }