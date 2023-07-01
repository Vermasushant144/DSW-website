const express=require("express");
const fs = require('fs')
const jwt = require("jsonwebtoken");
const multer = require('multer')
require("dotenv").config();


const router = express();


require("../db/config");
const userModel = require("../db/users")
let {templates, verifyToken}= require("../server.js");


router.get('/login',verifyToken,(req,res)=>{
    if(!req.body.validation.verify){
        res.render(templates+"/auth/login.ejs");
    }else{
        res.redirect("/profile/"+user.ERP_ID)
    }
})
//for login validation whether user login or not
router.get("/validate",verifyToken,async(req,res)=>{
    res.send(req.body.validation);
})

router.post('/login',async(req,res)=>{
    if(req.body.ERP_ID!=null && req.body.password!=null){
        
        let user = await userModel.findOne({ERP_ID:req.body.ERP_ID,password:req.body.password});
        console.log(user);
        if(user){
            if(user.isverified){
                let data = {
                    ERP_ID:user.ERP_ID,
                    Password:user.password,
                    Name:user.name,
                }
                let token = jwt.sign(data,process.env.JWT_KEY)
                res.send({status:200,token:token});
            }else{
                res.send({status:403});
            }
        }else{
            res.send({status:400})
        }
    }else{
        res.send({status:400});
    }
})

router.post("/forgetPassword",async(req,res)=>{
    console.log(req.body);
    let user = await userModel.findOne({name:req.body.name,ERP_ID:req.body.ERP_ID});
    if(user){
        require("./sendEmail")(user.ERP_ID+"@niet.co.in","Recover your password",
        `
        <h1>Recover your password from the link below</h1>
        <a href='${process.env.MAIN_DIR+'auth/resetpassword/'+user._id}' style="color:white;background-color:#19a100;padding:7px;font-size:20px;text-decoration:none">Reset Password</a>
        `
        )
        res.send({status:200});
    }else{
        res.send({status:400});
    }
})

router.get("/resetpassword/:id",async(req,res)=>{
    let user = await userModel.findOne({_id:req.params.id});
    if(user){
        res.render(templates+"/auth/resetpassword.ejs",{userID:user._id})
    }else{
        res.render(templates+"/error.ejs",{code:404});
    }
})

router.post("/resetpassword/:id",async(req,res)=>{
    console.log(req.body);
    let user = await userModel.findOne({_id:req.params.id,ERP_ID:req.body.ERP_ID,name:req.body.name});
    console.log(user);
    if(user){
        user.password = req.body.password;
        user.save()
        res.send({status:200});
    }else{
        res.send({status:404});
    }
});


router.get("/register",verifyToken,(req,res)=>{
    if(!req.body.validation.verify){
        res.render(templates+"/auth/register.ejs");
    }else{
        res.redirect("/profile/"+req.body.validation.ERP_ID);
    }
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
            res.render(templates+"/error.ejs",{code:404});
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
                res.send({status:200});
                
            }else{
                res.send({status:422});
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
        res.render(templates+"/auth/verification.ejs");
    }else{
        res.render(templates+"/error.ejs",{code:404});
    }
})


module.exports = router;