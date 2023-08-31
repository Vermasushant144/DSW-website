const express=require("express");
const route = express();
require("dotenv").config();

require("../db/config.js");
const userModel = require("../db/users");
const clubModel = require("../db/clubs");
const eventModel = require("../db/events");

route.get("/searchClubs",async(req,res)=>{
    let clubs = await clubModel.find({name:{'$regex':new RegExp(req.query.clubName,'i')}}).limit(3);
    res.send({clubs:clubs})
});

route.get("/booking",async(req,res)=>{
    res.render("booking.ejs");
});

route.get("/ticket",async(req,res)=>{
    res.render("ticket.ejs");
});

route.get("/:club",async(req,res)=>{
    let club = await clubModel.findOne({name:req.params.club}).select(["-_id"]);
    let events = [];
    if(club.events.length>0){
        for(let i=0;i<club.events.length;i++){
            let event = await eventModel.findOne({_id:club.events[i]});
            if(event){
                events.push(event);
            }
        }
        events.sort((a, b) => {
            // Assuming 'date' is the field containing the date in each notification object
            const dateA = new Date(a.Date);
            const dateB = new Date(b.Date);
            return dateB - dateA; // Compare dateB with dateA for descending order
        });
    }
    if(club){
        res.render("club.ejs",{club:club,SERVER_DIR:process.env.SERVER_DIR,events:events})
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