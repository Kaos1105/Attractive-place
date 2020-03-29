var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var seedDb = require('../models/seeds.js');

var passport = require("passport");
var LocalStrategy=require("passport-local");
var User = require('../models/user.js');

var flash = require("connect-flash");

//seed database
//seedDb();
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });
//test db connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("WE ARE CONNECTED");
});

//PASSPORT configuration
router.use(require("express-session")({
  secret:"Talion will conquer all Middle Earth",
  resave:false,
  saveUninitialized:false
}));
router.use(passport.initialize());
router.use(passport.session());
router.use(flash());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


router.use(function(req, res, next)
{
  res.locals.currentUser=req.user;
  res.locals.error=req.flash("error");
  res.locals.success=req.flash("success");
  next();
});
//SCHEMA SETUP

// Campground.create(
//   {
//     name: " Ho Chi Minh City", image: "https://www.planetware.com/photos-large/VIE/vietnam-ho-chi-minh-city-street.jpg",
//     description:"Ho Chi Minh City, the buzzing and crazy commercial hub of the VietNam"
//   },
//   function(err, campground)
//   {
//     if(err)
//     {
//       console.log(err);
//     }
//     else{
//       console.log("NEWLY CREATED CAMPGROUND: ");
//       console.log(campground);
//     }

//   }
// );

// var _campgrounds =[
//   {name: "Halong Bay", image: "https://www.planetware.com/photos-large/VIE/vietnam-halong-bay.jpg"},
//   {name: " Ho Chi Minh City", image: "https://www.planetware.com/photos-large/VIE/vietnam-ho-chi-minh-city-street.jpg"},
//   {name: "Hue", image: "https://www.planetware.com/photos-large/VIE/vietnam-hue-imperial-palace-gate.jpg"},
//   {name: "Phong Nha-Ke Bang National Park", image: "https://www.planetware.com/photos-large/VIE/vietnam-phong-nha-ke-bang-national-park-cave.jpg"},
//   {name: "My Son", image: "https://www.planetware.com/photos-large/VIE/vietnam-my-son-ruins.jpg"},
//   {name: "Hoi An", image: "https://www.planetware.com/photos-large/VIE/vietnam-hoi-an-riverfront.jpg"},
//   {name: "Sapa Countryside", image: "https://www.planetware.com/photos-large/VIE/vietnam-sapa-countryside.jpg"},
//   {name: "Hanoi", image: "https://www.planetware.com/photos-large/VIE/vietnam-hanoi-alleyway-scene.jpg"}
// ]

router.use(bodyParser.urlencoded({ extended: true }));
/* GET home page. */
router.get('/', function (req, res) {
  res.render("landing");
});
//===========================

module.exports = router;
