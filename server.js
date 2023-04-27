const express=require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const path = require("path")
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
module.exports = {templates,public};



app.get("/",(req,res)=>{
    res.render(templates+"/index.ejs");
});

app.use('/auth',require("./routes/auth.js"))
app.use('/club',require("./routes/club.js"))
app.use("/test",require("./routes/test_route.js"))//Only for test purpose
app.use('/profile',require("./routes/profile.js"))
app.use('/admin',require("./routes/admin.js"))
app.use("/clubAdmin",require("./routes/clubAdmin.js"))

app.listen(3000,()=>{
    console.log("Listening to port 3000")
})