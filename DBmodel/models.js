const mongoose = require('mongoose')
const marked = require('marked')                         //-->  it converts markdown to html
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)  //it allows to create html and purify it with 
                                                     //with JS-dom window object

const usersSchema = new mongoose.Schema({
    name : {
          type : String ,
          required : true
    },
    password : {
     type : String , 
     required : true
    },
    email : {
     type : String,
     required : true
    },
    age : {
        type : Number,
        required : false
    },
    profession : {
        type : String,
        required : false 
    },
    githublink : {
        type : String,
        required : false
    },
    education : {
        type : String,
        required : false
    },
    achievements : {
        type : String,
        required : false
    },
    linkedIn : {
        type : String,
        required : false
    }
})

//-------------------------------------------------------------------//

const articleSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    markdown : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now         ///() => Date.now()
    },
    slug : {                              //--> slug for title
        type : String,
        required : true,
        unique : true
    },
    sanitizedHtml : {
        type: String,
        required : true
    }
})


//how to slug make automatically calculate everytime
// we need to validate before making an article everytime before update,create,delete
//validation means --> everything should be in defined order like unqueness of the order
// "function(next)" is going to run right before validate of an article so we cant save unlikely values

articleSchema.pre('validate' , function(next){ 
    if (this.title)                                    //-> create slug by title
    {
        this.slug = slugify(this.title, { lower : true , strict : true}) //-> lower : true -> for lower case
                                            //strict-> to force our slugify to get rid of unwanted character
    }
    if(this.markdown)
    {
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))  //-> convert markdown to html and thn sanitizes it
        
    }
    next()
    })

var userAuth = mongoose.model('userData' , usersSchema)                 //userdatas in Mongo
var Article = mongoose.model('Article' , articleSchema)                  //articles in Mongo

module.exports = { userAuth : userAuth , Article : Article }
