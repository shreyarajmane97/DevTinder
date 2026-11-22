const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
    {
    firstName:{
        type:String,
        required:true,
        minLength:3
    },
    lastName:{
        type:String,
        maxLength:100
    },
    gender:{
        type:String,
        validate(value){
            if(!["Male","Female","Others"].includes(value)){
                throw new Error("Gender is not valid");
            }
        }
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email id")
            }
        }
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type: Number,
        min:18
    },
    photoUrl:{
        type: String,
        default:"https://www.citypng.com/photo/20794/free-round-flat-male-portrait-avatar-user-icon-png",
         validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid url")
            }
        }
    },
    about:{
        type: String,
        default: "This is defalut about for user"
    },
    skills: {
        type:[ String],
        validate(arr){
            if(arr.length > 10){
                throw new Error("skills cannot be more than 10") 
            }
        }
    }
},
{
    timestamps: true
}
)
userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash);
    return isPasswordValid;
}

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id},"DEV@Tinder006",{expiresIn:"7d"});
    return token;
}

const User = mongoose.model("User",userSchema);
module.exports = User;

//OR module.exports = mongoose.model("User",userSchema); also valid