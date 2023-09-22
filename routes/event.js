const route = require("express")();
const eventModel = require("../db/events.js");


route.get("/",async(req,res)=>{
    let events = await eventModel.find({}, { _id: 0 });
    events.reverse();
    
    res.render("events.ejs",{events:events});
});

route.get("/:eventName",async(req,res)=>{
    let event = await eventModel.findOne({Name:req.params.eventName},{_id:0});
    res.render("event.ejs",{event,event});
});


module.exports = route