const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const ObjectId = require("mongoose").Types.ObjectId;

// module.exports.readPost = (req, res) => { // GET http://localhost:5000/api/post
//     PostModel.find((err, data) => {      //MongooseError: Model.find() no longer accepts a callback
//         if (!err) res.send(data)
//         else console.log("Error to get data ", err)
//     })
// }

module.exports.readPost = async (req, res) => {
  const posts = await PostModel.find();
  res.status(200).json(posts);
};

module.exports.createPost = async (req, res) => {
  const newPost = new PostModel({
    posterId: req.body.posterId, // pour le POST {"posterId", "message"}
    message: req.body.message,
    video: req.body.video,
    likers: [],
    comments: [],
  });

  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).send(err);
  }
};
//le 1er paramametre à mettre est l'id qu'on récupère dans l'URL
module.exports.updatePost = (req, res) => {
  //CA MARCHE PAS   PUT http://localhost:5000/api/post/645172f45e7c24e32e41007b
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("Id unknown: " + req.params.id);

  const updatedRecord = {
    message: req.body.message, // pour le PUT {"message"}
  };

  PostModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true },
    (err, data) => {
      //MongooseError: Model.findByIdAndUpdate() no longer accepts a callback
      if (!err) res.send(data);
      else console.log("update error", err);
    }
  );
};

module.exports.deletePost = (req, res) => {
  //MongooseError: Model.findByIdAndRemove() no longer accepts a callback
  if (!ObjectId.isValid(req.params.id))
    // ici comme dhab on recupere l'id de L'URL et on vérifie qu'elle existe
    return res.status(400).send("Id unknown: " + req.params.id);

  PostModel.findByIdAndRemove(
    req.params.id, //1er parametre l'id à supprimer
    (err, data) => {
      if (!err) res.send(data);
      else console.log("Delete error ", err);
    }
  );
};
