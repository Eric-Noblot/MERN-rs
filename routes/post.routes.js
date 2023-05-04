const router = require("express").Router()
const postController = require("../controllers/post.controller")

router.get("/", postController.readPost)
router.post("/", postController.createPost)
router.put("/:id", postController.updatePost)
router.delete("/:id", postController.deletePost)
router.patch("/like-post/:id", postController.likePost) //PATCH permet  intervenir au niveau d'un array au travers de notre élément
router.patch("/unLike-post/:id", postController.unLikePost)

// comments

router.patch("/comment-post/:id", postController.commentPost)
router.patch("/edit-comment-post/:id", postController.editCommentPost)
router.patch("/delete-comment-post/:id", postController.deleteCommentPost)

module.exports = router