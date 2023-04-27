const route = require("express")()
require("dotenv").config();
const fs = require('fs')
const multer = require('multer')

let {templates}  = require("../server");
require("../db/config.js");
const userModel = require("../db/users");
const clubModel = require("../db/clubs");

route.get("/:id",async(req,res)=>{
    if(req.params.id){
        let clubAdmin = await userModel.findOne({_id:req.params.id,access:"clubAdmin"});
        if(clubAdmin){
            let club = await clubModel.findOne({_id:clubAdmin.accessID}).select(["-_id","-members","-admin"]);
            res.render(templates+"/clubAdmin.ejs",{status:"ok",club:club});
        }else{
            res.render(templates+"/serverError.ejs",{status:404})//not found
        }
    }else{
        res.render(templates+"serverError.ejs",{status:503})//denial service
    }
});
route.post("/checkclubAdmin",async(req,res)=>{
    let user = await userModel.findOne({ERP_ID:req.body.ERP_ID});
    if(user && user.ERP_ID==req.body.ERP_ID){
        if(user.access=='user'){
            res.send({status:"ok"});
        }else{
            res.send({status:"already admin"})
        }
    }else{
        res.send({status:"not exist"})
    }
});
route.post("/clubDetail",async(req,res)=>{

    let user = await userModel.findOne({_id:req.body.id}).select("-avatar");
    let club;
    if(user && user.access=="admin" && req.body.clubName){
        club = await clubModel.findOne({name:req.body.clubName});
    }else if(user && user.access=="clubAdmin"){
        club = await clubModel.findOne({_id:user.accessID}).select(["-_id"]);
    }
    if(club){
        res.send({status:"ok",club:club})
    }else{
        res.send({status:"Access Denied"})
    }
})
route.post("/getMemberDetail",async(req,res)=>{
    //validate admin or clubAdmin
    let admin = await userModel.findOne({_id:req.body.adminID});
    if(admin && ""+admin._id==""+req.body.adminID && (admin.access=="admin" || admin.access=="clubAdmin")){
        let member = await userModel.findOne({_id:req.body.memberID});
        if(member){
            
            res.send({status:"ok",member:{name:member.name,ERP_ID:member.ERP_ID,avatar:member.avatar}});
            // console.log("after member");
        }else{
            res.send({status:"not member"})
        }
    }else{
        res.send({status:"Deny"})
    }
})
route.post("/addMember",async(req,res)=>{
    console.log(req.body);
    if(req.body.adminID){
        let admin = await userModel.findOne({_id:req.body.adminID});
        
        if(admin){
            let club;
            if(admin.access=="admin" && req.body.clubID){
                club = await clubModel.findOne({_id:req.body.clubID});
            }else if(admin.access=="clubAdmin"){
                club = await clubModel.findOne({_id:admin.accessID});
            }else{
                res.send({status:"Denied"});
            }
            let newMember = await userModel.findOne({ERP_ID:req.body.ERP_ID});
            if(newMember){
                for(let i=0;i<club.members.length;i++){
                    if(club.members[i].userId==newMember._id){
                        res.send({status:"already member"});
                    }
                }
                club.members.push({userId:newMember._id,position:"member"});
                await club.save();
                if(admin.access=="admin"){
                    res.redirect("/admin");
                }else if(admin.access=="clubAdmin"){
                    res.redirect(`${'/clubAdmin/'+admin._id}`);
                }
            }else{
                res.send({status:"user not exist"});
            }
        }else{
            res.send({status:"Denied"});    
        }
    }else{
        res.send({status:"Denied"});
    }
})
route.post("/isMember",async(req,res)=>{
    if(req.body.adminID && req.body.ERP_ID){
        let admin = await userModel.findOne({_id:req.body.adminID});
        let member = await userModel.findOne({ERP_ID:req.body.ERP_ID});
        let club;
        if(admin.access=="admin" && req.body.clubID){
            club = await clubModel.findOne({_id:req.body.clubID});
        }else if(admin.access=="clubAdmin"){
            club = await clubModel.findOne({_id:admin.accessID});
        }
        if(!club){
            res.send({status:"invalid club"});
        }else{
            if(admin && admin.id==req.body.adminID ){
                if(member  && member.ERP_ID==req.body.ERP_ID){
                    if(admin.access=="admin" || (admin.access=="clubAdmin" && admin.accessID==club.id)){
                        let status = "no";
                        for(let i=0;i<club.members.length;i++){
                            if(""+member._id==""+club.members[i].userId){
                                status = "yes";
                            }
                        }
                        res.send({status:status});
                    }else{
                        res.send({status:"access denied"});
                    }
                }else{
                    res.send({status:"not exist"});
                }
            }else{
                res.send({status:"Invalid admin"});
            }
        }
    }else{
        res.send({status:"Insufficient data"});
    }
})
var upload = multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'public/images')
        },
        filename:(req,file,cb)=>{
            cb(null,req.body.name+"-clubIcon.png")
        }
    })
});
route.post("/editClub",upload.single("icon"),async(req,res)=>{
    if(req.body.adminID){
        let admin = await userModel.findOne({_id:req.body.adminID});
        let club;
        if(admin.access=="admin" && req.body.clubID){
            club = await clubModel.findOne({_id:req.body.clubID});
        }else if(admin.access=="clubAdmin"){
            club = await clubModel.findOne({_id:admin.accessID});
        }
        if(club){
            club.name = req.body.name;
            club.Email = req.body.Email;
            club.number = req.body.number;
            club.whatsapp = req.body.whatsapp;
            club.description = req.body.desc;
            let clubAdmin = await userModel.findOne({ERP_ID:req.body.ERP_ID});
            if(admin=="admin"){
                if(clubAdmin && ((clubAdmin.ERP_ID==req.body.ERP_ID && clubAdmin.access=="user") || ""+clubAdmin._id==""+club.admin)){
                    let currClubAdmin = await userModel.findOne({_id:club.admin});
                    if(currClubAdmin){
                        currClubAdmin.access="user";
                        currClubAdmin.accessID = "";
                        await currClubAdmin.save();
                        clubAdmin.access="clubAdmin";
                        clubAdmin.accessID = club._id;
                        await clubAdmin.save();
                        club.admin = clubAdmin;
                        
                    }else{
                        res.send({status:"Club with no existing admin"});
                    }
                }else{
                    res.send({status:"New admin not exist"})
                }
            }
            if(req.file){
                club.icon="data:image/png;base64,"+fs.readFileSync("public/images/"+req.body.name+"-clubIcon.png").toString('base64');
                fs.unlinkSync("public/images/"+club.name+"-clubIcon.png");
            }
            club.description = req.body.desc;
            await club.save();
            if(admin.access=="admin"){

                res.redirect("/admin");
            }else if(admin.access=="clubAdmin"){
                res.redirect(`${'/clubAdmin/'+admin._id}`);
            }
        }else{
            res.send({status:"club not exist"})
        }
    }else{
        res.send({status:"insufficient data"});
    }
})
route.put("/deleteMember",async(req,res)=>{
    console.log(req.body);
    if(req.body.adminID  && req.body.ERP_ID){
        let admin = await userModel.findOne({_id:req.body.adminID});
        if(admin){
            let member = await userModel.findOne({ERP_ID:req.body.ERP_ID});
            let club;
            if(admin.access=="admin" && req.body.clubID){
                club = await clubModel.findOne({_id:req.body.clubID});
            }else if(admin.access=="clubAdmin"){
                club = await clubModel.findOne({_id:admin.accessID});
            }
            if(club){
                if(member){
                    if(member.access=="clubAdmin" && ""+member.accessID==""+club._id){
                        res.send({status:"clubAdmin can't delete"});
                    }else{
                        for(let i=0;i<club.members.length;i++){
                            if(""+member._id==""+club.members[i].userId){
                                club.members.splice(i,1);
                            }
                        }
                        await club.save();
                        res.send({status:"ok"})
                    }
                }else{
                    res.send({status:"user not exist"})
                }
            }else{
                res.send({status:"Access Denied"})
            }
        }else{
            res.send({status:"insufficient data"})
        }
    }
});

module.exports = route;