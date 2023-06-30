const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mainSchema = mongoose.Schema({
    desc1:String,
    desc2:String,
    number:[{type:String}],
    Email:[{type:String}],
    video:String,
    events:[
        {
            eventClub:String,
            eventName:String,
            eventDesc:String,
            eventIcon:String,
            eventDate:String,
        }
    ],
    admin:{type:Schema.Types.ObjectId,ref:'user'},
})
module.exports = mongoose.model('clubs',mainSchema);