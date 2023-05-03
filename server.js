//npm start
// bernard pass : test33
const express = require("express");
const userRoutes = require("./routes/user.routes.js");
const cookieParser = require("cookie-parser")

require("dotenv").config({ path: "./config/.env" });
require("./config/db");

const {checkUser, requireAuth} = require("./middleware/auth.middleware.js")
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get("*", checkUser) 
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id)
})

app.use("/api/user", userRoutes);

//server
app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
