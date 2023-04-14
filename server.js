const express=require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

//MiddleWare
app.set("view engine","ejs");//configuring templates files to ejs extension
app.use(express.static("public"));//location of static file
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

var templates = __dirname+"/templates";

app.get("/login",(req,res)=>{
    if(login){
        res.redirect("/");
    }else{
        res.render(templates+"/login.ejs",{succesful_signup_flag,incorrect_crediential_flag});
    }
});


app.listen(3000,()=>{
    console.log("Listening to port 3000")
})