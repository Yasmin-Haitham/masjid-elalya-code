require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');


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
const libraryRouter = require('./routes/library');
//connect the database
mongoose.connect(
    process.env.CONNECTION_STRING,
    {},
    () => console.log("Connected to DB")
);


app.use(express.static(path.join(__dirname, 'public')))//to be able to access photos from anywhere
app.use(session({ secret: "secret", resave: true, saveUninitialized: true }));
app.use(passport.initialize())
app.use(passport.session())

//body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'))


app.use("/",(req,res,next)=>{
    res.locals.user=req.user
    next();
})

//routes
app.use('/',userRouter);
app.use('/activites',activitesRouter);
app.use('/library',libraryRouter);
app.listen(port,()=>{console.log(`this server is up and running on: ${port}`)})
