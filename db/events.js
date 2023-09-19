const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    Name:String,
    clubName:String,
    eventDate:String,
    Desc:String,
    regDate:{type:String,default:"none"},
    eventPhotos:[],
    report:String,
    icon:String,
})
module.exports = mongoose.model('events',eventSchema);