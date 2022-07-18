let mongoose = require('mongoose');

// create a new schema
let articleSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    }
});
let article = module.exports = mongoose.model('article', articleSchema);

// note once we have created model js file at app level we need to bring this model into our main js file
