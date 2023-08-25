const route = require("express")()
const fs = require('fs')
const multer = require('multer')
require("dotenv").config();

require("../db/config")
const userModel = require("../db/users")
var {verifyToken} = require("../server");
const path = require("path");

route.get("/:ERP_ID",async(req,res)=>{
    var user=await userModel.findOne({ERP_ID:req.params.ERP_ID},"-password -_id -access -accessID");
    if(user && user.isverified){
        res.render("profile.ejs",{user:user,store:null})
    }else{
        res.render("error.ejs")
    }
});
route.get("/:ERP_ID/isOwner",verifyToken,async(req,res)=>{
    if(req.body.validation.verify && req.body.validation.ERP_ID==req.params.ERP_ID){
        res.render("edit_profile.ejs");
    }else{
        res.send(null);
    }
});
var upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'public/dynamic/images');
      },
      filename: (req, file, cb) => {
          cb(null, req.body.ERP_ID+Date.now()+ "-avatar."+file.mimetype.split("/").pop());
      }
    })
  });
  
route.post("/edit_profile", upload.fields([{ name: 'avatar', maxCount: 1 }]), verifyToken, async (req, res) => {
if (req.body.validation.verify && req.body.validation.ERP_ID) {
    let user = await userModel.findOne({ ERP_ID: req.body.validation.ERP_ID });
    user.name = req.body.name;
    user.branch = req.body.branch;
    user.year = req.body.year;
    user.contactNo = req.body.contactNo;
    user.medialink.whatsapp = "https://wa.me/" + req.body.whatsapp;
    user.medialink.linkedin = req.body.linkedin;
    user.gender = req.body.gender;
    if (req.files['avatar']) {
    const file = req.files['avatar'][0];
    fs.unlink(path.join("public", user.avatar), (err) => {
        if (err) {
        console.log("file not exist error=>", err);
        }
    });
    user.avatar = "/dynamic/images/" + file.filename;
    }
    await user.save();
    res.send({ status: "ok" });
} else {
    res.send({ status: "Updation Failed!!" });
}
});
  
route.post("/isOwner",async(req,res)=>{
    
});
module.exports = route;