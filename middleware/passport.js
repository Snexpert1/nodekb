// bring in few things here
const LocalStrategy = require('passport-local').Strategy; //to use passport authentication
const User = require('../models/users'); //to work on model and its elements from and to the db
const config = require('../config/database'); //to connect with the mongodb
const bcrypt = require('bcryptjs');  // to comapre passwords to generate relevant messages

// use module exports to use this js file in main app file
module.exports = (passport)=>{
    // write your local passport strategy here
    passport.use(new LocalStrategy ((username, password, done)=>{
        // use some query to match username first
        let query = {username:username};
        User.findOne(query, (err, user)=>{
            if (err) throw err;
            if(!user){
                return done(null, false, {message:"No user found!"});
            }
            // If there is a user found then now we want to match the password by using bcryptjs
            bcrypt.compare(password, user.password, ((err, isMtach)=>{
                if (err) throw err;
                if (isMtach){
                    return done(null, user);
                }else{
                    return done(null, false, {message:"Wrong Password!"});
                }

            }));

        });

    }));
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
    passport.deserializeUser(function(id, done) {
        User.findById(id, (err, user)=>{
            done(err, user);
        });
        
      });

};
