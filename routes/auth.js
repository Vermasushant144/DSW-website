const express=require("express");
const fs = require('fs')
const multer = require('multer')
require("dotenv").config();


const router = express();


require("../db/config");
const userModel = require("../db/users")
let {templates}= require("../server.js");


router.get('/login',(req,res)=>{
    res.render(templates+"/auth/login.ejs",{status:"interface",user:"none"});
})

router.post('/login',async(req,res)=>{
    if(req.body.ERP_ID!=null && req.body.password!=null){
        let user = await userModel.findOne({ERP_ID:req.body.ERP_ID,password:req.body.password});
        if(user && user.isverified){
            res.render(templates+"/auth/login.ejs",{status:"AddLocalUser",user:{id:user._id,ERP_ID:user.ERP_ID,name:user.name,access:user.access}});
        }else{
            res.send("<h1 style='color:red'>Invalid User:(<br>Try Again</h1>")
        }
    }else{
        res.send({status:"Insufficient Data"});
    }
})

router.post("/forgetPassword",async(req,res)=>{
    let user = await userModel.findOne(req.body);
    if(user){
        require("./sendEmail")(user.ERP_ID+"@niet.co.in","Recover your password",
        `
        <h1>Recover your password from the link below</h1>
        <a href='${process.env.MAIN_DIR+'auth/resetpassword/'+user._id}' style="color:white;background-color:#19a100;padding:7px;font-size:20px;text-decoration:none">Reset Password</a>
        `
        )
        res.redirect('/auth/login')
    }else{
        res.send("<h1 style='color:red'>No such user Exist</h1>")
    }
})

router.get("/resetpassword/:id",async(req,res)=>{
    let user = await userModel({_id:req.params.id});
    if(user){
        res.render(templates+"/auth/resetpassword.ejs",{userID:user._id})
    }else{
        res.send("<h1 style='color:red;'>Illegal KEY:/</h1>")
    }
})

router.post("/resetpassword/:id",async(req,res)=>{
    
    let user = await userModel.findOne({_id:req.params.id,ERP_ID:req.body.ERP_ID,name:req.body.name});
    if(user){
        user.password = req.body.password;
        user.save()
        res.redirect("/auth/login");
    }else{
        res.send("<h2 style='color:red'>!!Illegal Access Denied</h2><h1>:/</h1>")
    }
})


router.get("/register",(req,res)=>{
    res.render(templates+"/auth/register.ejs")
})

var upload = multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            
            cb(null,'public/dynamic/images')
        },
        filename:(req,file,cb)=>{
            console.log(req.body);
            cb(null,req.body.ERP_ID+"-avatar.png")
        }
    })
});

router.post("/register",upload.single("avatar"),async(req,res)=>{
        let user = await userModel.findOne({ERP_ID:req.body.ERP_ID})
        if(user && user.isverified){
            res.send("<h1 style='color:red'>User Already registered with this ERP_ID<h1>")
        }else{
            let validateERP_ID = await userModel.findOne({ERP_ID:req.body.ERP_ID})
            if(req.body.password==req.body.conformpassword && (validateERP_ID==null || validateERP_ID.ERP_ID!=req.body.ERP_ID)){
                
                await new userModel({
                    name:req.body.name,
                    year:req.body.year,
                    branch:req.body.branch,
                    ERP_ID:req.body.ERP_ID,
                    avatar:"/dynamic/images/"+req.body.ERP_ID+"-avatar.png",
                    contactNo:req.body.contactNo,
                    medialink:{
                        whatsapp:"https://wa.me/"+req.body.whatsapp,
                        linkedin:req.body.linkedin
                    },
                    password:req.body.password,
                    gender:req.body.gender,
                }).save();
                let newUser=await userModel.findOne({ERP_ID:req.body.ERP_ID})
                require('./sendEmail')(
                    req.body.ERP_ID+"@niet.co.in","Verify your Email address",
                    `Thanks for registering in our website.<br><a href='${process.env.MAIN_DIR+"auth/verify/"+newUser._id}'>Click Here</a>to verify Email`
                )
                res.redirect('/auth/login')
                
            }else{
                res.redirect('/auth/register')
            }
        }
    // }
})


//Verify Registered User
router.get('/verify/:id',async(req,res)=>{
    let user=await userModel.findOne({_id:req.params.id})
    if(user){
        user.isverified=true;
        await user.save();
        res.send("<h1 style='color:green'>Succesfully account verified:)<h1>")
    }else{
        res.send("<h1 style='color:red'>No such user exist!!<h1>")
    }
})




module.exports = router;