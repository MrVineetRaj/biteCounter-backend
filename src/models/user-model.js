const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
require('dotenv').config();

const userSchema = mongoose.Schema({
    name:{
        type:String,
        trim:true
    },
    email: {
        type: String,
        trim:true,
        unique:true,
        lowercase:true,
        
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error("Password cannot contain 'password'");
            }
            if(value.length < 7){
                throw new Error("Password must be at least 7 characters long");
            }
        }
    },
    age:{
        type:Number,
        trim:true,
        validate(value){
            if(value > 100 && value<=0){
                throw new error("Age must be more then 0 and less then equal to 100")
            }
        }
    },
    weight:{
        type:Number,
    },
    height:{
        type:Number,
    },
    activity:{
        type:String,
    },
    tokens:[{
        token:{
            type:String,
        }
    }]
})


userSchema.statics.findByCredential = async function (email,password){
    const user = await User.findOne({email});

    if(!user){
        throw new Error("unable to Login");
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error("unable to Login");
    }

    return user;
}

userSchema.methods.generateAuthToken = async function (){
    const user = this;

    const token = jwt.sign({_id:user._id.toString()}, 'personal-healthcare')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token;
}

userSchema.pre('save',async function(next) {
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    
    next()
})




const User = mongoose.model('user',userSchema);

module.exports = User;