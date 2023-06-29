const route = require("express")()
const fs = require('fs')
const multer = require('multer')
require("dotenv").config();

require("../db/config")
const userModel = require("../db/users")
var {templates} = require("../server");

route.get("/:ERP_ID",async(req,res)=>{
    var user=await userModel.findOne({ERP_ID:req.params.ERP_ID});
    if(user && user.isverified){
        res.render(templates+"/profile",{user:user,store:null})
    }else{
        res.send("<h1 style='color:yellow'>No user Exists!!<h2>")
    }
});
var upload = multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            
            cb(null,'public/dynamic/images')
        },
        filename:(req,file,cb)=>{
            
            cb(null,req.body.adminID+"-avatar.png")
        }
    })
});
route.post("/edit_profile",upload.single("avatar"),async(req,res)=>{
    if(req.body.adminID && req.body.password){
        let user = await userModel.findOne({_id:req.body.adminID,password:req.body.password});
        user.name = req.body.name;
        user.branch = req.body.branch;
        user.year = req.body.year;
        user.contactNo = req.body.contactNo;
        user.medialink.whatsapp = "https://wa.me/"+req.body.whatsapp;
        user.medialink.linkedin = req.body.linkedin;
        user.gender = req.body.gender;
        if(req.file){
            fs.unlinkSync("public"+user.avatar);
            user.avatar = "/dynamic/images/"+req.body.adminID+"-avatar.png";
        }
        await user.save();
        res.redirect(`/profile/${user.ERP_ID}`)
    }else{
        res.send({status:"Insufficient Data"})
    }
});
module.exports = route;