const route = require('express').Router()
const { userAuth } = require("../DBmodel/models.js");
const methodOverride = require('method-override');
const bcrypt = require("bcrypt"); 
route.use(methodOverride('_method'));

route.get("/signup", (req, res) => {
    res.render("signup");
  });
  
route.post("/signup", async (req, res) => {
    try {
      const hashedpassword = await bcrypt.hash(req.body.password, 10);
      console.log(hashedpassword);
      const user = new userAuth({
        name: req.body.name,
        email: req.body.email,
        password: hashedpassword,
        age: req.body.age,
        profession: req.body.profession,
        githublink: req.body.githublink,
        education : req.body.education,
        achievements : req.body.achievements,
        linkedIn : req.body.linkedIn
      });
      let newuser = await user.save();
       console.log(newuser)
      //res.status(201).send(newuser);
      res.render('login')
    } catch (e) {
      console.log(e)
      res.status(404).redirect("/signup"); ///send back app.get('/signup')
    }
  });
  
route.get('/profilepage/editprofile',async (req,res)=>
{
  if (!req.session.userId) {
    return res.render('login');
  }
  
  let id = req.session.userId;
  console.log(id)
  let user = await userAuth.findById(id);  
  res.render('editprofile' , { user : user})
})
  
  ////--------               all user             ----------------///
route.get("/allusers", async (req, res) => {
    try {
      const userval = await userAuth.find();
      if (userval == null) {
        return res.send("there are no users");
      }
      console.log(userval);
      res.send(userval);
    } catch {
      res.status(500).send("sorry there is an error");
    }
  });
   /// ------- profile page  -------------------------///
  
route.get("/profile", async (req, res) => {
    if (!req.session.userId) {
      //if cookie is not available thn redirect to login again
      res.redirect("/login");
    }
    const id = req.session.userId;
    const user = await userAuth.findById(id);
    //res.send(user_value);
    res.render("profile", { user });
  });
  
  
  //// --------------------- to get user by LOGIN -------------------------///
  
  
route.post("/login", async (req, res) => {
   
    var uservalue = await userAuth.findOne({ email: req.body.email });
    let err_msg = ' ';
    let err_password = '';
    console.log(uservalue);
    if (!uservalue) {
      err_msg = "User's Email-ID doesn't match, please enter it again";
      return res.render('login', { err_msg: err_msg } );
    }
    try {
      if (await bcrypt.compare(req.body.password, uservalue.password)) {
        req.session.userId = uservalue.id;         //yaha se ye cookie value login ke liye use hogi
        return res.redirect("/user/profile");           //-->   directed to app.get('/profile')
      } 
      else {
      err_password = "Password doesn't match with User ID"
      return res.render("login" , {err_password : err_password});
      }
    } 
    catch {
        console.log(e)
      res.redirect("/login");
    }
  });
  
 
  //----------------  Forgot PAssword        ------------------///
route.get('/ForgotPass', (req, res) => {
    res.render('forgotPass');
  });
  
route.post('/searchemail', async (req, res) => {
    let userpass = await userAuth.findOne({ email: req.body.email });
    let err_msg = '';
    if (!userpass) {
      err_msg = 'No such Email-Id exist'
      return res.render('forgotPass', {
        err_msg : err_msg,
      });
    }
    req.session.userId = userpass.id;                //storing user-id in session
    //console.log(req.session.userId)
    //res.send(req.session.userId)
    res.render('setPass');                           //setpass rendered from here
  }); 
  
  //----------    Update/Set new password   ---------------------///
  
route.put('/forgetpassword/updatepass', async (req, res) => {
    let err_msg= ' ';
    if (!req.session.userId) {
      err_msg = 'your session is expired ,Please enter your email id again'
      return res.render('forgotPass', {err_msg : err_msg});
    }
    
    const id = req.session.userId;
    console.log(id)
    const user = await userAuth.findById(id);       
  
    if(req.body.setnewpassword == null)
    {
    res.redirect('/forgotPass')
    }
  
  if(req.body.setnewpassword != null)    
    {
      user.password =  await bcrypt.hash(req.body.setnewpassword, 10);
    }
    try{
      let updateduser = await user.save()
      return res.redirect('/login')
      //res.json(updateduser)
      //res.json(updateduser)
    //   return res.render('login')
    }
    catch
    {
        res.render('signup')
    }
   
  });
  
  /////--------          LOGOUT       --------------/////
  
route.get('/logout', (req, res) => {
    req.session.userId = null;
    res.render('login');
  });





//------------ UPDATE USER-PROFILE DATA     -------------------/////  


 
route.put('/userprofile/updateprofile', async (req, res) => {
  let err_msg= ' ';
  if (!req.session.userId) {
    err_msg = 'your session is expired ,Please enter your email id again'
    return res.render('login', {err_msg : err_msg});
  }
  
  let id = req.session.userId;
  console.log(id)
  let user = await userAuth.findById(id);       

//   if(req.body.githublink != null)
//   {
//     user.githublink = req.body.githublink
//   }
// if(req.body.name != null)    
//   {
//     user.name =  req.body.name;
//   }
//   if(req.body.education != null)    
//   {
//     user.education =  req.body.education;
//   }
//   if(req.body.profession != null)
//   {
//     user.profession = req.body.profession
//   }
//   if(req.body.age !=null )
//   {
//     user.age = req.body.age
//   }
//   if(req.body.achievements != null)
//   {
//     user.achievements = req.body.achievements
//   }
  user.name = req.body.name
  user.email = user.email
  user.password = user.password
  user.age = req.body.age
  user.profession = req.body.profession
  user.education = req.body.education
  user.achievements = req.body.achievements
  user.githublink = req.body.githublink
  user.linkedIn = req.body.linkedIn

  try{
    user = await user.save()
     res.redirect('/profile')
    //res.json(updateduser)
    //res.json(updateduser)
  //   return res.render('login')
  }
  catch(e)
  {
    console.log(e)
      res.redirect('/login')
  }
 
});



module.exports = route