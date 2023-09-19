const mongoose = require('mongoose');
// on peut utiliser le regex mais validator c'est deja mieux
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 55,
            unique: true,
            trim: true,//supprime les éspaces au début et à la fin
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            max: 1024,
            minLength: 6
        },
        picture: {
            type: String,
            default: "./uploads/profil/random-user.png"
        },
        bio: {
            type: String,
            max: 1024
        },
        followers: {
            type: [String]
        },
        following: {
            type: [String]
        },
        likes: {
            type: [String]
        }
    },
    {
        timestamps: true,
    }
)
//crypter le mot de passe avant d'enregistrer dans la base de donnée
userSchema.pre("save",async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})
//décryptage du mot de passe
userSchema.statics.login = async function( email, password){
    const user = this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        // if (auth){
        //     return user;
        // }
        // throw Error('incorrect password');
        if (!auth) return ('incorrect password');
    }
    throw Error('incorrect email')
};

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;