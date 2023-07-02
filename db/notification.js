const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    date:String,
    title:String,
    detail:String,
})
module.exports = mongoose.model('users',messageSchema);