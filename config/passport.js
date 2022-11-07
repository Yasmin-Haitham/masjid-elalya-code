const LocalStrategy = require("passport-local").Strategy;
const User = require("../schemas/user");
const bcrypt = require("bcrypt");

//implement strategy 
module.exports=(passport) =>{
    passport.use(new LocalStrategy(
        async(Username,Password,done)=>{
            /*verify fuction returns cb done where 
            where done has 2 parametres 
            (err|| null , false||user)
            first user.findOne and catch error of actual database ex: database faliure to connect 
            return done(e)
            if user not found (null,false)
            if user found check password if matched (null, user)
            else (null, false)*/
            const user = await User.findOne({Username}).catch((e)=>done(e));
            if (!user){
                done(null,false);
            }
            else{
                bcrypt.compare(Password,user.Password,(err,result)=>{
                    if(result){
                        done(null,user);
                        console.log(user);}
                    else
                        done(null,false);//(null,false)
                })
            }
        }
    ))

    //serialize user
    passport.serializeUser((user,done)=>done(null,user.id))

    //deserialize user
    passport.deserializeUser(async(id,done)=>{
        const user = await User.findById(id) 
        done(null,user);
    })
}