const express = require("express");
const Activity = require("../schemas/activities");
const router = express.Router();
const joi = require("joi");
const cloudinary = require('cloudinary').v2;
const joiImg = require("joi-image-extension");
const authenticated = require("../middleware/authenticated")
const authorized = require("../middleware/authorize")

var authority= "0"

if(authorized){
    authority= "1"
}else{
    authority= "0"
}




router.get("/",authenticated,(req,res)=>{
    const{page = 1}= req.query 
    const activites =  Activity.find().limit(2).skip(2*(page-1))
    const totalActivities =  Activity.find().count()
    res.render("activities",{ 
        activites,
        totalPages: Math.ceil(totalActivities / 2),
        currentPage: page,
        authority
         });
})
router.get("/addActivity",(req,res)=>{
    res.render("addActivities")
})
router.post("/addActivity",(req,res)=>{
    const body = req.body
    const schema = joi.object({
        Name: joi.string().required(),
        Description:joi.string().required(),
        image:joiImg.minWidth(300).minHeight(230).maxWidth(300).maxHeight(230).required(),
        Price:joi.string().required()
    });
    const {error} = schema.validate(body);
    if(error)
        res.send(error);
    else{
        imgObj= cloudinary.uploader.upload(body.image)
            .then(result=>console.log(result)).catch((e)=>res.status(500).send(e));
        const newActivity = new Activity({
            Name: body.Name ,
            Description:body.Description,
            image:imgObj.url,
            Price:body.Price
        })
        newActivity.save().then(() => res.redirect("/activities")).catch((e)=>res.status(500).send(e));
    }
})
module.exports = router;