const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:String,
    ERP_ID:String,
    year:String,
    password:String,
    avatar:String,
    medialink:{
        whatsapp:String,
        linkedin:String,
    },
    branch:String,
    contactNo:Number,
    gender:String,
    access:{type:String},//user,admin,clubAdmin
    accessID:{type:String},
    isverified:{type:Boolean}
})
module.exports = mongoose.model('users',userSchema);