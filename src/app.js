const express = require("express");
const app = express();
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const {validateSignupData} = require("./utils/validations.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt =  require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth.js");

app.use(express.json());   // middleware to read json object
app.use(cookieParser());    // middleware to read response cookie

app.post("/signup",async(req,res) =>{
    console.log(req.body);

    // just for testing with hardcoded object
    // const user = new User({
    //     firstName:"shreya",
    //     lastName:"Rajmane",
    //     gender:"Female",
    //     passsword:"test",
    //     age: 29,
    //     emailId:"ssr@gmail.com"
    // })
    try{
        validateSignupData(req);
        const {firstName,lastName,emailId,password} = req.body;
        const passwordHash = await bcrypt.hash(password,10);
        const user = new User({firstName,lastName,emailId,password:passwordHash});
        await user.save(); 
        res.send('data saved');
    }
    catch (err){
        console.log(err)
    }
})

app.get("/profile",userAuth,async(req,res) =>{
    try{
        const user = res.user
        console.log('logged in user is -',user);
        res.send(user);
    } 
    catch(error){
        res.status(400).send("ERROR-"+error.message);
    }
    
})

app.post("/login",async(req,res)=>{
    try{
        const {emailId,password} = req.body;
        //first check if email id is resent in db or not and then compare password if user exist
        const user = await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Email id is not present")
        }
        const isPasswordValid = user.validatePassword(password);
        if(isPasswordValid){
            const token = await user.getJWT(); 
            res.cookie("token",token);
            res.send("login successful")
        }
        else{
            throw new Error("Password is not correct");
        }
    }
    catch(err){
        res.status(404).send(err.message)
    }
})


connectDB().then(()=>{
    console.log("connection established");
    app.listen(3000,()=>{
    console.log("server listning");
    })
}).catch((error)=>{
    console.log(error)
})


//get user from email just for testing and understanding purpose
// app.get("/user", async(req,res) => {
//     const userEmail = req.body.emailId;
//     try{
//         const result = await User.find({emailId: userEmail});
//         //const result = await User.findOne({emailId: userEmail});  //returns first found doc in object form
//         if(result.length === 0){
//             res.send("User not found")
//         }
//         else{
//             res.send(result);
//         }
//     }
//     catch(err){
//         res.status(404).send("something wrong");
//     }
// })

//get all users from collection just for testing and understanding purpose
// app.get("/feed", async(req,res) => {
//     try{
//         const result = await User.find({});
//         if(result.length === 0){
//             res.send("No data")
//         }
//         else{
//             res.send(result);
//         }
//     }
//     catch(err){
//         res.status(404).send("something wrong");
//     }
// })

//delete user fro id just for testing and understanding purpose
// app.delete("/deleteUser",async(req,res)=>{
//     const userId = req.body.userId;
//     try{
//         const result = await User.findByIdAndDelete(userId);
//         if(result){
//             res.send("user deleted");
//         }
//         else{
//             res.send("something went wrong");
//         }
//     }
//     catch(err){
//         res.status(404).send("something wrong");
//     }
// })

//patch api fro user data just for testing and understanding purpose
// app.patch("/user/:userId", async(req,res) => {
//     const user = req.params?.userId;
//     const data = req.body;
   
//     try{
//          const ALLOWED_UPDATES = ["skills","about","firstName","lastName","gender","password","age","photoUrl"];
//     const isUpdateAllowed = Object.keys(data).every((k) =>
//         ALLOWED_UPDATES.includes(k)
//     );
//     if(!isUpdateAllowed){
//         throw new Error("Invalid update");
//     }
//         const result = await User.findByIdAndUpdate({ _id : user},data,{
//             runValidators:true
//         });
//         res.send(result);
//     }
//     catch(err){
//         res.status(404).send("error"+ err.message);
//     }
// })


// app.get("/user/:id/:firstname",(req,res)=>{
//     console.log(req.params);
//     res.send({firstname:"shreya",lastname:"Rajmane"})
// })
// app.post("/user",(req,res)=>{
//     res.send("Data saved in db")
// })

// Understanding api route sequence
// app.use("/test/2",(req,res)=>{
//     res.send('Hi in test 2');
// });
// app.use("/test/abc",(req,res)=>{
//     res.send('Hi in test abc');
// });

// app.use("/test",(req,res)=>{
//     res.send('Hi in test path');
// });

// app.use("/dashboard",(req,res)=>{
//     res.send('Hi dashboard');
// });

// app.use("/",(req,res)=>{
//     res.send('Hi');
// });
