const express = require("express");
const app = express();



app.use("/test",(req,res)=>{
    res.send('Hi in test path');
});

app.use("/dashboard",(req,res)=>{
    res.send('Hi dashboard');
});

app.use("/",(req,res)=>{
    res.send('Hi');
});

app.listen(3000,()=>{
    console.log("server listning");
})