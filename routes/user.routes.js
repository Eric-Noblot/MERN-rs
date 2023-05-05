const router = require("express").Router()
const authController = require("../controllers/auth.controller")
const userController = require("../controllers/user.controller")
const uploadController = require("../controllers/upload.controller")
const multer = require("multer")
const upload = multer()

//auth
router.post("/register", authController.signUp) //router permet de récupérer le chemin de l'url avec register (app.use("api/user", userRoutes) dans server.js)
router.post("/login", authController.signIn)
router.get("/logout", authController.logout)

//user
router.get("/", userController.getAllUsers)
router.get("/:id", userController.getOneUser)
router.put("/:id", userController.updateOneUser)
router.delete("/:id", userController.deleteOneUser)
router.patch("/follow/:id", userController.follow)
//router.patch("/unfollow/:id", userController.unfollow)

//upload
router.post("/upload", upload.single("file"), uploadController.uploadProfil) // on passe d'abord par une middleware multer avant d'aller dans le controller

module.exports = router 

