const express = require('express');
const router = express.Router();

// bring in article model
let article_1 = require('../models/article');

// lets bring in user model to do query on this model to fetch attributes like author name

let User = require('../models/users');

// create another route to a page to add articles
router.get('/add', ensureAuthenticated, (req,res)=>{
    res.render('add_articles', {
        title: "Add Articles"
    });
});


// load edit form
router.get('/edit/:id', ensureAuthenticated, (req,res)=>{
    article_1.findById(req.params.id, (err, x)=>{
        if (x.author != req.user._id){
            req.flash('danger', 'Not Authorized!');
            res.redirect('/');
        }
        res.render('edit_article', {
            title: 'Edit Article',
            y: x
        });
        return;
    });
})




// add post submit request route here

router.post('/add', (req,res)=>{
    req.checkBody('title', 'Title is mandatory').notEmpty();
    //req.checkBody('author', 'Author is mandatory').notEmpty();
    req.checkBody('body', 'Body is mandatory').notEmpty();

// get the errors if they are any validation failures

    let errors = req.validationErrors();

    if (errors){
        res.render('add_articles', {
            title: 'Add Article',
            errors: errors

        });

    } else{
        let article_4 = new article_1();
        article_4.title = req.body.title;
        article_4.author = req.user._id;
        article_4.body = req.body.body;
    
        article_4.save((err)=>{
            if (err){
                console.log(err);
                return;
            }else {
                req.flash('success', "Article added successfully");
                res.redirect('/');
            };
        });
        return;

    }


 
});

// Add post edit request route back to database
router.post('/edit/:id', (req,res)=>{
    let article_5 = {};
    article_5.title = req.body.title;
    article_5.author = req.body.author;
    article_5.body = req.body.body;

    let query_1 = {_id:req.params.id};

    article_1.updateOne(query_1, article_5, (err)=>{
        if (err){
            console.log(err);
            return;
        }else {
            req.flash('success', 'Article updated succefully');
            res.redirect('/');
        };
    });
    return;
});

// Add delete article route here

router.delete('/:id', ensureAuthenticated, (req,res)=>{
    let query = {_id:req.params.id}

    article_1.deleteMany(query, (err)=>{
        if(err){
            console.log(err);

        }
        res.send('Success');
    });

});
// route to get single article and display it user when someone clicks on article from list
router.get('/:id', (req,res)=>{
    article_1.findById(req.params.id, (err, x)=>{
        User.findById(x.author, (err, t)=>{
            
            res.render('article', {
                y: x,
                r: t.username
            
        })
       
        });
        return;
    });
})
// Special function for access control or user authorisation control we can also add this special function to any
// route that we want to protect example lets use at add article page and edit article page to protect them

function ensureAuthenticated(req,res,next){
    if (req.isAuthenticated()){
        return next();

    } else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }

};


module.exports = router;
