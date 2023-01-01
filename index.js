require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const session = require('express-session');
const cloudinary = require('cloudinary').v2;

require("./config/passport")(passport);

//start app
const app = express();

//set port
const port = process.env.PORT || 3030

//set view engine
app.set('view engine', 'pug')

//set router
const userRouter = require('./routes/user');
const activitesRouter = require('./routes/activities');

//connect the database
mongoose.connect(
    process.env.CONNECTION_STRING,
    {},
    () => console.log("Connected to DB")
);
if (typeof (process.env.CLOUDINARY_URL) === 'undefined') {
    console.warn('!! cloudinary config is undefined !!');
    console.warn('export CLOUDINARY_URL or set dotenv file');
  } else {
    console.log('cloudinary config:');
    console.log(cloudinary.config({
        secure: true
      }));
  }

app.use(express.static(path.join(__dirname, 'public')))//to be able to access photos from anywhere
app.use(session({ secret: "secret", resave: true, saveUninitialized: true }));
app.use(passport.initialize())
app.use(passport.session())

//body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/",(req,res,next)=>{
    res.locals.user=req.user
    next();
})

//routes
app.use('/',userRouter);
app.use('/activites',activitesRouter);

app.listen(port,()=>{console.log(`this server is up and running on: ${port}`)})
