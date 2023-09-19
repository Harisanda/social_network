const mongoose = require("mongoose");

mongoose
    .connect("mongodb://localhost:27017/mern-project",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    ) 
    .then( () => console.log("connected to mongodb"))
    .catch( (err) => console.log("failed to connect to mongoDB", err));
     
