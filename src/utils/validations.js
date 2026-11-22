const validator = require("validator");


const validateSignupData=(req)=>{
    const {firstName,lastName,password,age,emailId} = req.body;
    if(!firstName || !lastName || !password || !emailId){
        throw new Error("Name,lastname,email and password cannot be empty");
    }
    if(!validator.isEmail(emailId)){
        throw new Error("Invalid email id");
    }
}
module.exports = {validateSignupData}