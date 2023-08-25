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
    access:{type:String,default:"user"},//user,admin,clubAdmin
    accessID:{type:String},
    isverified:{type:Boolean,default:false}
})
module.exports = mongoose.model('users',userSchema);