const express = require("express");
const book = require("../schemas/book");
const router = express.Router();
const joi = require("joi");
const authenticated = require("../middleware/authenticated")
const authorized = require("../middleware/authorize");

router.get("/",authenticated,async (req,res,next)=>{
    const{page = 1}= req.query 
    const books =  await book.find({}).limit(2).skip(2*(page-1))
    const totalBooks =  await book.find({}).count()
    // console.log(totalActivities + " "+ Activity.length)
    var authority= "0"

    if(authorized && req.user.AdminFlag == "1"){
        authority= "1"
    }else{
        authority= "0" 
}
    res.render("library",{ 
        books,
        totalPages: Math.ceil(totalBooks / 2),
        currentPage: page,
        authority
         });
})

router.get("/addBook",(req,res)=>{
    res.render("addBook")
})



router.post("/addBook", async(req,res)=>{
    var body = req.body
    const schema = joi.object({
        Name: joi.string().required(),
        Description:joi.string().required(),
        PicURL:joi.string().uri().required(),
        BookURL:joi.string().uri().required(),
        ISBN:joi.string().required()
    });
    const {error} = schema.validate(body);
    if(error)
        res.send(error);
    else{
        const newBook = new book({
            Name: body.Name ,
            Description:body.Description,
            PicURL: body.picURL,
            BookURL: body.BookURL,
            ISBN:body.ISBN
        })
        newBook.save().then((doc) =>{ 
            console.log(doc);
            res.redirect("/library")})
            .catch((e)=>console.log(e));
    }
})


module.exports = router;