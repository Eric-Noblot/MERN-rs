const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const ObjectId = require("mongoose").Types.ObjectId;

// module.exports.readPost = (req, res) => { // GET http://localhost:5000/api/post
//     PostModel.find((err, data) => {      //MongooseError: Model.find() no longer accepts a callback
//         if (!err) res.send(data)
//         else console.log("Error to get data ", err)
//     }).sort({ createdAt: -1})  //le fonction sort avec created-1 nous permet de classer les post par ordre du plus récent( de base c'est le contraire)
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

module.exports.likePost = async (req, res) => {
  //MARCHE PAS  //http://localhost:5000/api/post/like-post/645172f45e7c24e32e41007b (id du post)   -  {"id": 645172f45e7c24e32e41007b} (id de l'user)

  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("Id unknown: " + req.params.id);

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id, //on recuperre l'id dans l'url
      {
        $addToSet: { likers: req.body.id }, //on transmet dans notre requete l'id de la personne qui a liké dans les Likers de Post
      },
      { new: true },
      (err, data) => {
        if (err) return res.status(400).send(err);
      }
    );
    await UserModel.findByIdAndUpdate(
      req.body.id, // on recupere le id contenu dans le body de notre requete
      {
        $addToSet: { likes: req.params.id }, // on transmet dans notre requete l'id de l'url dans les likes de User
      },
      { new: true },
      (err, data) => {
        if (!err) res.send(data);
        else return res.status(400).send("hello 1");
      }
    );
  } catch (err) {
    //$addToSet permet d'ajouter des valeur à un élément sans ecraser les précédentes
    return res.status(400).send("hello 2");
  }
};

module.exports.unLikePost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("Id unknown: " + req.params.id);

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id, //on recuperre l'id dans l'url
      {
        $pull: { likers: req.body.id }, //pull permet de retirer une donnée du tableau sans écraser les autres
      },
      { new: true },
      (err, data) => {
        if (err) return res.status(400).send(err);
      }
    );
    await UserModel.findByIdAndUpdate(
      req.body.id, // on recupere le id contenu dans le body de notre requete
      {
        $pull: { likes: req.params.id }, // on transmet dans notre requete l'id de l'url dans les likes de User
      },
      { new: true },
      (err, data) => {
        if (!err) res.send(data);
        else return res.status(400).send("hello 1");
      }
    );
  } catch (err) {
    //$addToSet permet d'ajouter des valeur à un élément sans ecraser les précédentes
    return res.status(400).send("hello 2");
  }
};

module.exports.commentPost = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("Id unknown: " + req.params.id);

  try {
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          //push permet d'interagir avec le sous tableau qu'on a crée pour les comments dans notre post Model
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(), //meme si on a deja une timeStamp récupéré grace à notre postModel, on ne peut pas s'en servir pour notre sous tableau de post, alors on en crée un ici specifique a chaque post du tableau
          },
        },
      },
      { new: true },
      (err, data) => {
        if (!err) return res.send(data);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.editCommentPost = (req, res) => {  //PATCH  //http://localhost:5000/api/post/edit-comment-post/64529e859ae48d3c01d956c1    {"commentId": "64515156944", "text": "merci beaucoup" }
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("Id unknown: " + req.params.id);

  try {
    return PostModel.findById(req.params.id, (err, data) => {
      const theComment = data.comments.find((comment) =>
        comment._id.equals(req.body.commentId)
      );
      if (!theComment) return res.status(404).send("Comment not found");
      theComment.text = req.body.text;

      return data.save((err) => {
        if (!err) return res.staus(200).send(data);
        return res.status(500).send(err);
      });
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.deleteCommentPost = (req, res) => { //PATCH  //http://localhost:5000/api/post/delete-comment-post/64529e859ae48d3c01d956c1    {"commentId": "64515vfd156944" }
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("Id unknown: " + req.params.id);

    try {
  // ATTENTION on utilise findById et pas remove ou delete car on ne veut pas supprimer tous les commentaires mais simplement mettre à jour le tableau sans ce commentaire
        return PostModel.findByIdAndUpdate ( 
          req.params.id,
          {
            $pull: {
              comments: {
                _id: req.body.commentId,
              }
            }
          },
          {new: true },
          (err, data) => {
            if (!err) return res.send(data)
            else return res.status(400).send(err)
          }
        )
    } catch(err) {
      return res.status(400).send(err)
    }
};
