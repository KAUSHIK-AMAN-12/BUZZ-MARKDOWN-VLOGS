const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bcrypt = require("bcrypt");
const userRoute = require('./routes/userroute')
const articleRouter = require('./routes/article')
const mongoose = require("mongoose");
const session = require("express-session");
const {Article} = require("./DBmodel/models");
const methodOverride = require('method-override')    //use for override post-get
const app = express();
const PORT = process.env.PORT || 4000;
//method-override function
app.use(methodOverride('_method'));

// connect css file to handlebars
app.use(express.static('.'));
app.set("view engine", "ejs");

//-------     connect mongoose lib to mongo DB    --------///

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const db = mongoose.connection;
//db.dropDatabase();
db.on("error", (error) => {
  console.log(error);
});

db.once("open", () => {
  console.log("Connected successfully");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

////----   session setup ---------------/////

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "killer",
  })
);

app.get("/login", (req, res) => {
  res.render("login");
});

app.get('/index', async(req,res)=>
{
//     const articles = [
//         {
//         title : 'Test article',
//         createdAt : new Date(),
//         description : 'Test description'
//     },
//     {
//         title : 'Test article 2',
//         createdAt : new Date(),
//         description : 'Test description 2'
//     },
// ]
    let articles = await Article.find().sort({createdAt : 'desc'}); //sorted on the base of creation
    res.render('articles/index' , {articles : articles })
})


app.use('/user', userRoute );
app.use('/articles', articleRouter ) ; 

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/login`);
});
