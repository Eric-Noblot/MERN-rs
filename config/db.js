const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://" + process.env.DB_USER_PASS + "@cluster.ikh9fvo.mongodb.net/?retryWrites=true&w=majority")

.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("Failed to conncet MongoDB", err)) 