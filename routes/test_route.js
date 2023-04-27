const express=require("express");
const fs = require('fs');
const multer = require('multer');

const route = express();

//db calling
require("../db/config.js");
const club_model = require("../db/clubs.js");

//image upload config
var upload = multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            
            cb(null,'images')
        },
        filename:(req,file,cb)=>{
            console.log(req.body);
            cb(null,req.body.name+"-"+"icon"+".png")
        }
    })
});


route.post("/add_club",upload.single('icon'),async(req,res)=>{

    const newClub = new club_model({
        name:req.body.name,
        icon:"data:image/png;base64,"+fs.readFileSync("images/"+req.body.name+"-icon.png").toString('base64'),
        description:req.body.desc,
    });
    await newClub.save().then(()=>{
        console.log("saved")
    }).catch((err)=>{
        console.log(err)
    });
    fs.unlinkSync("images/"+req.body.name+"-"+"icon.png");
    res.send("Ok")
})

module.exports = route