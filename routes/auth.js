var express=require("express");
var router=express.Router();
var User=require("../models/user");
var passport = require("passport");
//AUTH ROUTES

//SHOW register
router.get("/register", function(req, res)
{
  res.render("register");    
});
//POST create user
router.post("/register", function(req, res)
{
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user)
  {
    if(err)
    {
      console.log(err);
      req.flash("error", err.message);
      return res.redirect("/register");
    }
    console.log(user);
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Welcome to YelpCamp "+user.username);
      res.redirect("/campgrounds");
    });
    
  });
});

//SHOW login
router.get("/login", function(req, res)
{
  res.render("login");
});
router.post("/login", 
  passport.authenticate("local",
  {
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
  }),function(req, res){res.send("Login screen");}
);

//LOGOUT
router.get("/logout", function(req,res)
{
  req.logOut();
  req.flash("success", "Logged out successfully");
  res.redirect("/campgrounds");
});
module.exports=router;