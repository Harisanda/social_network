//inscription connexion et deconnexion 
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

const maxAge = 3 * 24 * 60 * 60 * 1000 ;

const createToken = (id)  =>{
    jsonTonken = jwt.sign({id},process.env.TOKEN_SECRET,{
        expiresIn: '5s'
    });
    return ({jsonTonken});
}

module.exports.signUp = async(req , res) =>{
    const{pseudo , email , password} = req.body

    try{
        const user = await UserModel.create({pseudo, email , password});
        res.status(201).json({user : user._id})
    }
    catch (err){
        res.status(200).send({err})
    }
}


// MBOLA TSY MANDEHA
module.exports.signIn = async (req , res) =>{
    const{email, password} = req.body;
    const user = await UserModel.login({email, password});
    // console.log(user.email);
    try{
        // const user = await UserModel.login(email, password);
        const token = createToken(user._id);
        //le token permet de justifier l'identifier
        res.cookies(`jwt`, token , {httpOnly: true, maxAge});
        res.status(200).json(ok);
       
    }
    catch (err){
        console.log(err);
        res.status(400).send({err});
    }
    // if(email == user.email && password == user.password){
    //                 const token = createToken(user._id);
    //                 res.cookies(`jwt`, token , {httpOnly: true, maxAge});
    // } else {
    //     res.status(400).send(error);
    // }
}
module.exports.logout = (req , res) =>{
    res.cookie('jwt','',{maxAge: 1});
    res.redirect('/');
}
// ATRETO