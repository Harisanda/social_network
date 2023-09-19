const express = require('express');
const bodyParsser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes.js');
require('dotenv').config({path: './config/.env'});
require('./config/db');
const {checkUser} = require('./middleware/auth.middleware');
const app = express();



app.use(bodyParsser.json());
app.use(bodyParsser.urlencoded({extended: true}));
app.use(cookieParser());


//jwt 
app.get('*', checkUser);

//routes
app.use('/api/user', userRoutes); 


//serveur
app.listen(5000, () =>{
    console.log(`Listening on port ${process.env.PORT}`);
})