const express=require("express");
const ejs = require("ejs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const path = require("path")
require("dotenv").config();
require("./db/config.js");
const userModel = require("./db/users.js");
const clubModel = require("./db/clubs.js");
const mainModel = require("./db/main.js");
const eventModel = require("./db/events.js");
const messageModel = require("./db/messages.js")


const app = express();

//MiddleWare
app.set("view engine","ejs");//configuring templates files to ejs extension
app.use(express.static(path.join(__dirname,"./public")));//location of static file
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

var templates = __dirname+"/templates";
var public  =  __dirname+"/public";


const verifyToken = async(req,res,next)=>{
    let token = req.headers.authorization;
    if(!token){
        // console.log("got called token")
        req.body.validation = {verify:false};
    }else{
        jwt.verify(token,process.env.JWT_KEY,(err,decode)=>{
            if(err){
                console.log("Token Verification failed:",err.message);
                req.body.validation = {verify:false};
            }else{
                let user = jwt.decode(token,process.env.JWT_KEY);
                req.body.validation = user;
                req.body.validation.verify = true;
            }
        });
    }
    next();
    
}

module.exports = {templates,public,verifyToken};
app.get("/", async (req, res) => {
    let main = await mainModel.findOne({});
    let events = await eventModel.find({},{_id:0});
    let coty = await clubModel.findOne({_id:main.clubOftheYear},{name:1,icon:1,_id:0});//coty => club of the year
    let currentDate = new Date();
    let liveEvents = [];
    for (let i = 0; i < events.length; i++) {
      let eventDate = new Date(events[i].Date);
      if (currentDate <= eventDate) {
        liveEvents.push(events[i]);
      }
    }
    res.render(templates + "/index.ejs", {
      main: main,
      SERVER_DIR: process.env.SERVER_DIR,
      events: liveEvents,
      coty:coty,
    });
});

app.get("/unread-notification",verifyToken,async(req,res)=>{
  if(req.body.validation.verify){
    let notifications = await messageModel.find({});
    // user = await userModel.find({name:req.body.validation.Name});
    for(let i=0;i<notifications.length;i++){
      if(!notifications[i].readed.includes(`${req.body.validation.ERP_ID}`)){
        res.send({status:true});
        return;
      }
    }
  }
  res.send({status:false});
});
app.get("/notification",verifyToken,async(req,res)=>{
  if(req.body.validation.verify){
    let notifications = await messageModel.find({});
    res.send({status:200,notifications:notifications,ERP_ID:req.body.validation.ERP_ID});
  }else{
    res.send({status:401});
  }
});
app.put("/notification-readed",verifyToken,async(req,res)=>{
  if(req.body.validation.verify){
    let response = await messageModel.findOne({_id:req.body.notifyID});
    if(response.readed.includes(req.body.validation.ERP_ID)){
      res.send({status:false})
    }else{
      response.readed.push(req.body.validation.ERP_ID);
      await response.save();
      res.send({status:true});
    }
  }else{
    res.send({status:false});
  }
});

app.use('/auth',require("./routes/auth.js"))
app.use('/club',require("./routes/club.js"))
app.use('/profile',require("./routes/profile.js"))
// app.use("/notification",require("./routes/notifiction.js"))

app.listen(3000,()=>{
    console.log("Listening to port 3000")
})