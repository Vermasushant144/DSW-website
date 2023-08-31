const route = require("express")()
const fs = require('fs');
const multer = require('multer');
const multerS3 = require("multer-s3");
const AWS = require('aws-sdk');
require("dotenv").config();

require("../db/config")
const userModel = require("../db/users")
var {verifyToken,unlinkFileStream} = require("../server");
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

AWS.config.update({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
})
const s3 = new AWS.S3();
var upload = multer({
    
    storage: multerS3({
        s3: s3,
        bucket: 'niet-dsw',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            cb(null,req.body.ERP_ID+Date.now()+ "-avatar");
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
    var fileList = user.avatar.split("/");
    await unlinkFileStream(fileList[fileList.length-1]);
    user.avatar = "/files/" + file.key;
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