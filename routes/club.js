const express=require("express");
const route = express();

let {templates}  = require("../server");
require("../db/config.js");
const userModel = require("../db/users");
const clubModel = require("../db/clubs");


route.get("/dsw",async(req,res)=>{
    let club = await clubModel.findOne({name:"dsw"}).select(["-_id"]);
    if(club){
        console.log(club);
        console.log(club.desc2);
        res.render(templates+"/dsw.ejs",{club:club,SERVER_DIR:process.env.SERVER_DIR})
    }else{
        res.send("This club is restricted!!")
    }
});

route.get("/booking",async(req,res)=>{
    res.render(templates+"/booking.ejs");
});

route.get("/ticket",async(req,res)=>{
    res.render(templates+"/ticket.ejs");
});

route.get("/:club",async(req,res)=>{
    let club = await clubModel.findOne({name:req.params.club}).select(["-_id"]);
    if(club){
        res.render(templates+"/club.ejs",{club:club})
    }else{
        res.send("Club not found!!")
    }
})
route.post("/getMembers",async(req,res)=>{   
    let club = await clubModel.findOne({name:req.body.name});
    if(club){
        let result=[];
        for(let i=0;i<club.members.length;i++){
            let user = await userModel.findOne({_id:club.members[i].userId});
            let member = {position:club.members[i].position}
            if(user){
                member.name = user.name;
                member.ERP_ID=user.ERP_ID;
                member.avatar = user.avatar;
                result.push(member);
            }else{
                continue;
            }
        }
        res.send({status:"ok",members:result})
    }else{
        res.send({status:"false"})
    }
})



module.exports = route;