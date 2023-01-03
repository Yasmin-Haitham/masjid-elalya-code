const express = require("express");
const Activity = require("../schemas/activites");
const router = express.Router();
const joi = require("joi");
const authenticated = require("../middleware/authenticated")
const authorized = require("../middleware/authorize");






router.get("/",authenticated,async (req,res,next)=>{
    const{page = 1}= req.query 
    const activites =  await Activity.find({}).limit(2).skip(2*(page-1))
    const totalActivities =  await Activity.find({}).count()
    // console.log(totalActivities + " "+ Activity.length)
    var authority= "0"

    if(authorized && req.user.AdminFlag == "1"){
        authority= "1"
    }else{
        authority= "0" 
}
    res.render("activites",{ 
        activites,
        totalPages: Math.ceil(totalActivities / 2),
        currentPage: page,
        authority
         });
})
router.get("/addActivity",(req,res)=>{
    res.render("addActivities")
})
router.get("/editActivity/:id", async (req,res)=>{ 
    const id = req.params.id
    
    const activity = await Activity.findById(id);
    
    res.render("editActivities",{activity})})
router.post("/addActivity", async(req,res)=>{
    var body = req.body
    const schema = joi.object({
        Name: joi.string().required(),
        Description:joi.string().required(),
        Price:joi.string().required()
    });
    const {error} = schema.validate(body);
    if(error)
        res.send(error);
    else{
        const newActivity = new Activity({
            Name: body.Name ,
            Description:body.Description,
            Price:body.Price
        })
        newActivity.save().then((doc) =>{ 
            console.log(doc);
            res.redirect("/activites")})
            .catch((e)=>console.log(e));
    }
})

router.put("/editActivity/:id", (req,res)=>{
    const body = req.body;
    const id = req.params.id;
    const schema = joi.object({
        Name: joi.string().empty(""),
        Description:joi.string().empty(""),
        Price:joi.string().empty("")
    });
    const {error} = schema.validate(body);
    if(error)
        res.send(error);
    else{
        Activity.findByIdAndUpdate(id,{
            ...body
        }).then(()=>res.redirect("/activites")).catch((e)=>res.status(500).send(e));
    }
})
router.get("/deleteActivity/:id", async (req,res)=>{
    const id = req.params.id
    await Activity.findByIdAndDelete(id)
    res.redirect("/activites")
})
module.exports = router;