const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const userAuth = async(req,res,next)=>{
    try{
         //Job of this middleware is to read token form req cookies
        const {token} = req.cookies;
        if(!token){
            throw new Error("Token invalid from auth");
        }

        //valiate token
        const decodedData = await jwt.verify(token,"DEV@Tinder006");

        //Find user
        const {_id} = decodedData;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not exist from auth");
        }
        //send user back to api which call this auth as we have 
        // already know logged in user and apis using this auth might need it and they dont need to call it again
        res.user = user;
        next();
    }
    catch(err){
        res.status(400).send("ERROR-", err.message);
    }
};
module.exports = {userAuth}