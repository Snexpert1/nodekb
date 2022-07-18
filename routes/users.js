const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//bring the users model
let User = require('../models/users');

// Register form router

router.get('/register', (req,res)=>{
    res.render('register');
})

router.post('/register', (req,res)=>{
    const name = req.body.name;
    const username= req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;
    

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not correct').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords not match').equals(req.body.password);

    let errors = req.validationErrors();

    if (errors){
        res.render('register', {
            errors:errors
        });


    }else{
        let newUser = new User({
            name:name,
            email:email,
            username:username,
            password:password

        });
        bcrypt.genSalt(10, (err,salt)=>{
            bcrypt.hash(newUser.password, salt, (err,hash)=>{
                if (err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save((err)=>{
                        if (err){
                            console.log(err);
                            return;
                        }else{
                            req.flash('success', 'You are now registered and can log in');
                            res.redirect('/users/login');
                        }
            
                    });
                
            });
        

        });

    }



});
// Login form route
router.get('/login', (req,res)=>{
    res.render('login');
});

//Login post process

router.post('/login', (req,res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);

});

//route for logout

router.get('/logout', function(req,res){
    req.logout((err)=>{
        if (err) {
            throw err;
        }else {
            res.redirect('/users/login');
        };
    });
    req.flash('success', 'You are logged out!');
    

});

module.exports = router;
