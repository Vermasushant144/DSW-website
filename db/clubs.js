const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clubSchema = mongoose.Schema({
    name:String,
    description:String,
    icon:String,
    number:[{type:String}],
    Email:[{type:String}],
    whatsapp:String,
    members:[
        {
            userId:{type:Schema.Types.ObjectId,ref:'users'},
            position:String
        }
    ],
    admin:{type:Schema.Types.ObjectId,ref:'user'},
    events:[]
})
module.exports = mongoose.model('clubs',clubSchema);