const express=require("express");
const ejs = require("ejs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const path = require("path")
require("dotenv").config();
require("./db/config.js");
const clubModel = require("./db/clubs.js");


const app = express();

//MiddleWare
app.set("view engine","ejs");//configuring templates files to ejs extension
app.use(express.static(path.join(__dirname,"./public")));//location of static file
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

var templates = __dirname+"/templates";
var public  =  __dirname+"/public";

const verifyToken = async(req,res,next)=>{
    let token = req.header.authorization;
    if(!token){
        res.body.validation = {verify:false};
    }else{
        jwt.verify(token,process.env.JWT_KEY,(err,decode)=>{
            if(err){
                console.log("Token Verification failed:",err.message);
                res.body.validation = {verify:false};
            }else{
                let user = jwt.decode(token,process.env.JWT_KEY);
                res.body.validation = user;
                req.body.validation.verify = true;
            }
        });
    }
    next();
}

module.exports = {templates,public,verifyToken};
app.get("/",async(req,res)=>{
    let clubs = await clubModel.find().select(["-_id"]);
    res.render(templates+"/index.ejs",{clubs:clubs});
});

app.use('/auth',require("./routes/auth.js"))
app.use('/club',require("./routes/club.js"))
app.use('/profile',require("./routes/profile.js"))

app.listen(3000,()=>{
    console.log("Listening to port 3000")
})