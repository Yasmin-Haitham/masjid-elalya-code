const express = require("express");
const User = require("../schemas/user");
const router = express.Router();
const passport = require("passport");
const joi = require("joi");
const bcrypt = require("bcrypt");

router.get("/",async(req,res)=>{
    res.render("homepage")
})
router.get("/login",(req,res)=>{
    res.render("login")
})
router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
});
router.get("/signup",(req,res)=>{
    res.render("signup")
})

router.post("/signup",async(req,res)=>{
    //first step is to assign the joi schema to check the req aganist 
    const body = req.body
    const schema = joi.object({
        Name: joi.string().required(),
        PhoneNumber: joi.string().required(),
        Address: joi.string(),
        Username: joi.string().alphanum().min(3).max(30).required(),
        Password: joi.string().required().min(8),
    });
    const {error} = schema.validate(body);
    if(error)
        res.send(error);
    else{
        const newUser = new User({
            Name: body.Name ,
            PhoneNumber: body.PhoneNumber,
            Address: body.Address,
            Username: body.Username,
            Password: body.Password,
        })
        
            newUser.save().then(() => res.redirect("/login")).catch((e)=>res.status(500).send(e));
        }
    }

);
router.post("/login",(req,res,next)=>{
    console.log("authenticating")
    passport.authenticate("local",{successRedirect: "/",failureRedirect: "/login"})
    (req,res,next)
})
module.exports = router;