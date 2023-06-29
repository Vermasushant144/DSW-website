const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clubSchema = mongoose.Schema({
    name:String,
    description:String,
    desc2:String,
    icon:String,
    number:[{type:String}],
    Email:[{type:String}],
    video:String,
    whatsapp:String,
    members:[
        {
            userId:{type:Schema.Types.ObjectId,ref:'users'},
            position:String
        }
    ],
    events:[
        {
            eventName:String,
            eventDesc:String,
            eventIcon:String
        }
    ],
    admin:{type:Schema.Types.ObjectId,ref:'user'},
})
module.exports = mongoose.model('clubs',clubSchema);