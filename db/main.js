const mongoose = require('mongoose');

const mainSchema = mongoose.Schema({
    icon:String,
    video:String,
    desc1:String,
    desc2:String,
    helplineNo:[{type:String}],
    email:[{type:String}],
    clubOftheYear:{type:mongoose.Schema.Types.ObjectId,res:'clubs'}
})
module.exports = mongoose.model('main',mainSchema);