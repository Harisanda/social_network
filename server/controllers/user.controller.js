const UserModel = require('../models/user.model'); 
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (req , res) =>{
    const users = await UserModel.find().select("-password"); 
    res.status(200).json(users);
}

module.exports.userInfo = (req , res) =>{
    //console.log(req.params);
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID inconnu : '+req.params.id)

    UserModel.findById(req.params.id, (err , docs) =>{
        if(!err) res.send(docs);
        else console.log('ID inconnu : '+ err);
    }).select('-password');
}

module.exports.updateUser = async (req , res) =>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID inconnu : '+req.params.id)
    try {
        await UserModel.findOneAndUpdate(
            {_id: req.params.id},
            {
                $set: { 
                    bio: req.body.bio
                }
            },
            //paramètre obligatoire de la méthode put
            { new: true, upsert: true , setDefaultsOnInsert: true},
            // (err , docs) =>{
            //     if(!err) res.send(docs);
            //     if(err) return res.status(500).send({message: err});
            // }
        )
        .then((docs) => res.send(docs))
        .catch((err) => res.status(500).send({message: err}));
    }
    catch(err){
        return res.status(500).json({message: err});
    }
};

module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID inconnu : '+req.params.id)
    try{
        await UserModel.remove({_id: req.params.id}).exec();
        res.status(200).json({message: req.body.pseudo+" is successfully deleted"});
    }
    catch(err){
        return res.status(500).json({message: err});
    }
}

module.exports.follow = async (req , res) =>{
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow))
        return res.status(400).send('ID inconnu : '+req.params.id)
    try{
        //ajout dans la liste des followers
        await UserModel.findByIdAndUpdate(
            req.params.id,
            {$addToSet: { following: req.body.idToFollow}},
            { new: true, upsert: true},
        )
        .then((docs) => res.status(201).json(docs))
        .catch((err) => res.status(400).json(err));
        //ajout dans la liste des following
        await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            {$addToSet: { followers: req.params.id}},
            { new: true, upsert: true},
        )
        // .then((docs) => res.status(201).json(docs))
        .catch((err) => res.status(400).json(err));
    }
    catch(err){
        return res.status(500).json({message: err});
    }
}

module.exports.unfollow = async (req , res) =>{
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnfollow))
        return res.status(400).send('ID inconnu : '+req.params.id)
    try{
        //retirer dans la liste des following
        await UserModel.findByIdAndUpdate(
            req.params.id,
            {$pull: { following: req.body.idToUnfollow}},
            { new: true, upsert: true},
        )
        .then((docs) => res.status(201).json(docs))
        .catch((err) => res.status(400).json(err));
        //retirer dans la litse des followers
        await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow,
            {$pull: { followers: req.params.id}},
            { new: true, upsert: true},
        )
        // .then((docs) => res.status(201).json(docs))
        .catch((err) => res.status(400).json(err));
    }
    catch(err){
        return res.status(500).json({message: err});
    }
}