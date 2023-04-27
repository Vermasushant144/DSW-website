const express = require("express");
const fs = require('fs')
const multer = require('multer')
require("dotenv").config();

require("../db/config");
const userModel = require("../db/users")
const clubModel = require("../db/clubs")
let {templates} = require("../server.js");

const route=express()


route.get("/",async(req,res)=>{
    let clubs = await clubModel.find({},{"name":1,"_id":0});
    res.render(templates+"/admin.ejs",{clubs:clubs});
});

route.post("/",async(req,res)=>{
    if(req.body.id){
        let user = await userModel.findOne({_id:req.body.id,access:"admin"});
        if(user){
            
            res.send({status:"ok"});
        }else{
            res.send({status:"false"});
        }
    }else{
        res.send({status:"error"});
    }
});


var upload = multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            console.log(req.body);
            cb(null,'public/images')
        },
        filename:(req,file,cb)=>{
            console.log(req.body);
            cb(null,req.body.name+"-clubIcon.png")
        }
    })
});

route.post("/addClub",upload.single("icon"),async(req,res)=>{
    if(req.body.adminID && req.body.password){
        let admin = await userModel.findOne({_id:req.body.adminID,password:req.body.password,access:"admin"});
        if(admin && admin._id==req.body.adminID){
            let clubAdmin = await userModel.findOne({ERP_ID:req.body.ERP_ID});
            if(clubAdmin || clubAdmin.ERP_ID==req.body.name){
                if(clubAdmin.access=='clubAdmin'){
                    res.send({status:"Alreday clubAdmin"});
                }else{
                    let club = await userModel.findOne({name:req.body.name});
                    if(club && club.name==req.body.name){
                        res.send({status:"Club Already Exist"});
                    }else{
                        
                        let newClub =new clubModel({
                            name:req.body.name,
                            admin:clubAdmin._id,
                            description:req.body.desc,
                            whatsapp:req.body.whatsapp,
                            members:[],
                            number:req.body.number,
                            Email:req.body.Email,
                            icon:"data:image/png;base64,"+fs.readFileSync("public/images/"+req.body.name+"-clubIcon.png").toString('base64'),
                            event:[]
                        })
                        await newClub.members.push({userId:clubAdmin._id,position:"clubAdmin"});
                        if(req.body.icon){
                            fs.unlinkSync("public/images/"+req.body.ERP_ID+"-clubIcon.png")
                        }
                        clubAdmin.access = "clubAdmin";
                        clubAdmin.accessID = newClub._id;
                        await clubAdmin.save();
                        await newClub.save();
                        res.redirect("/admin");
                    }
                }
            }else{
                res.send({status:"Admin not exist"})
            }
        }else{
            res.send("Invalid Admin")
        }
    }else{
        res.redirect("/")
    }
    
});

module.exports = route;