const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    Name:String,
    clubName:String,
    Date:String,
    Desc:String,
    icon:String,
})
module.exports = mongoose.model('events',eventSchema);