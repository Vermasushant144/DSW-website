const mongoose = require('mongoose');

const mainSchema = mongoose.Schema({
    icon:String,
    video:String,
    desc1:String,
    name:String,
    desc2:String,
    helplineNo:[{type:String}],
    email:[{type:String}],
    clubOftheYear:{type:mongoose.Schema.Types.ObjectId,res:'clubs'}
})
module.exports = mongoose.model('mains',mainSchema);