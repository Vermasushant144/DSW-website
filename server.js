const express = require("express");
const ejs = require("ejs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const path = require("path")
const fs = require("fs")
require("dotenv").config();
require("./db/config.js");
const clubModel = require("./db/clubs.js");
const mainModel = require("./db/main.js");
const eventModel = require("./db/events.js");
const messageModel = require("./db/messages.js")
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region:'eu-north-1'
})
const s3 = new AWS.S3();


const app = express();

//MiddleWare
app.set("view engine", "ejs");//configuring templates files to ejs extension
app.set("views", path.join(__dirname, "views"))//configuring templates files to ejs extension
app.use(express.static(path.join(__dirname, "public")));//location of static file
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var public = __dirname + "/public";


const verifyToken = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    // console.log("got called token")
    req.body.validation = { verify: false };
  } else {
    jwt.verify(token, process.env.JWT_KEY, (err, decode) => {
      if (err) {
        console.log("Token Verification failed:", err.message);
        req.body.validation = { verify: false };
      } else {
        let user = jwt.decode(token, process.env.JWT_KEY);
        req.body.validation = user;
        req.body.validation.verify = true;
      }
    });
  }
  next();

}


app.get("/", async (req, res) => {
  let main = await mainModel.findOne({});

  let events = await eventModel.find({}, { _id: 0 });
  let coty = await clubModel.findOne({ _id: main.clubOftheYear }, { name: 1, icon: 1, _id: 0 });//coty => club of the year
  let currentDate = new Date();
  let clubs = await clubModel.find({}, { _id: 0 });
  let liveEvents = [];
  let lastEvent;
  for (let i = 0; i < events.length; i++) {
    let regDate = new Date(events[i].regDate);
    if (currentDate <= regDate) {
      liveEvents.push(events[i]);
    }
    let eventDate = new Date(events[i].eventDate);
    if(eventDate<currentDate ){
      if(lastEvent ){
        if(eventDate>new Date(lastEvent)){
          lastEvent = events[i];
        }
      }else{
        lastEvent = events[i];
      }
    }
  }
  if (!main) {
    res.render("index.ejs", {
      main: {},
      events: [],
      coty: {},
      clubs:clubs,
      events:liveEvents,
      lastEvent:lastEvent,
    });
    return;
  }
  if (!coty) {
    res.render("index.ejs", {
      main: main,
      events: [],
      coty: {},
      clubs:clubs,
      events:liveEvents,
      lastEvent:lastEvent,
    });
    return;
  }
  
  res.render("index.ejs", {
    main: main,
    events: liveEvents,
    clubs: clubs,
    coty: coty,
    lastEvent:lastEvent,
  });
});

app.get("/unread-notification", verifyToken, async (req, res) => {
  if (req.body.validation.verify) {
    let notifications = await messageModel.find({ access: req.body.validation.ERP_ID });
    // user = await userModel.find({name:req.body.validation.Name});
    for (let i = 0; i < notifications.length; i++) {
      if (!notifications[i].readed.includes(`${req.body.validation.ERP_ID}`)) {
        res.send({ status: true });
        return;
      }
    }
  }
  res.send({ status: false });
});
app.get("/notification", verifyToken, async (req, res) => {
  if (req.body.validation.verify) {
    let notifications = await messageModel.find({ access: req.body.validation.ERP_ID });
    notifications.sort((a, b) => {
      // Assuming 'date' is the field containing the date in each notification object
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA; // Compare dateB with dateA for descending order
    });
    res.send({ status: 200, notifications: notifications, ERP_ID: req.body.validation.ERP_ID });
  } else {
    res.send({ status: 401 });
  }
});

// for updating readed notification
app.put("/notification-readed", verifyToken, async (req, res) => {
  if (req.body.validation.verify) {
    let response = await messageModel.findOne({ _id: req.body.notifyID });
    if (response.readed.includes(req.body.validation.ERP_ID)) {
      res.send({ status: false })
    } else {
      response.readed.push(req.body.validation.ERP_ID);
      await response.save();
      res.send({ status: true });
    }
  } else {
    res.send({ status: false });
  }
});


// set file operation

app.get("/files/:key", async (req, res) => {
  var getParams = {
    Bucket: 'niet-dsw',
    Key: req.params.key,
  }
  s3.headObject(getParams, (err, data) => {
    if (err) {
      console.log("File not found");
      res.sendStatus(404);
    } else {
      var object = s3.getObject(getParams).createReadStream();
      object.pipe(res);
    }
  });
})

const unlinkFileStream = async (key) => {
  var params = {
    Bucket: "niet-dsw",
    Key: key
  }
  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.log("Got error on deleting:", err);
      return { status: 400 };
    } else {
      console.log("delete sucessfully:)");
      return { status: 200 };
    }
  });
}

module.exports = { public, verifyToken, unlinkFileStream };
app.use('/auth', require("./routes/auth.js"))
app.use('/club', require("./routes/club.js"))
app.use('/profile', require("./routes/profile.js"))
app.use('/events', require("./routes/event.js"))
// app.use("/notification",require("./routes/notifiction.js"))

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening ...");
})