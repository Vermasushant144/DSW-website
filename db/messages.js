const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    date:String,
    title:String,
    detail:String,
    access:[{type:String}],
    readed:[{type:String}]//conatin address of readed message user
})
module.exports = mongoose.model('messages',messageSchema);