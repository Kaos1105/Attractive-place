var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware=require("../middleware/index");

//===========================
//CAMP
//===========================

//INDEX--show all campground
router.get("/campgrounds", function (req, res) {
  // res.render("campgrounds", {campgrounds:_campgrounds});

  //Get all campground from db
  Campground.find({}, function (err, resultCampgrounds) {
    if (err) {
      req.flash("error", err);
    }
    else {
      res.render("campgrounds/index", { campgrounds: resultCampgrounds });
    }
  });
});


//CREATE-add new data to the db
router.post("/campgrounds", middleware.isLoggedIn, function (req, res) {
  //get data from form and add data to campground array
  var _name = req.body.name;
  var _image = req.body.image;
  var _description = req.body.description;
  var _author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCamp = { name: _name, image: _image, description: _description, author: _author };

  //add new campGround to the database
  Campground.create(newCamp,
    function (err, newCampground) {
      if (err) {
        req.flash("error", err);
      }
      else {
        console.log(newCampground);
        //redirect back to campgrounds
        req.flash("success", "Campground added successfully!");
        res.redirect("/campgrounds");
      }
    }
  );
});


//NEW -- show form to create new data
router.get("/campgrounds/new", middleware.isLoggedIn, function (req, res) {
  res.render("campgrounds/new");
});


//SHOW--show campground at specific ID
router.get("/campgrounds/:id", function (req, res) {
  //find the campground with the specific ID
  Campground.findById(req.params.id).populate("comments").exec(
    function (err, foundCamp) {
      if (err) {
        req.flash("error", err);
      }
      else {
        //render show template with that campground

        //console.log(foundCamp);
        res.render("campgrounds/show", { campground: foundCamp });
      }
    }
  );
});

//EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampAuthorization, function (req, res) {
  Campground.findById(req.params.id, function (err, foundCamp) {
    if (err) {
      req.flash("error", err);
    }
    else {
      res.render("campgrounds/edit", { campground: foundCamp });
    }
  });
});

//UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", middleware.checkCampAuthorization, function (req, res) {
  //find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err) {
    if (err) {
      req.flash("error", err);
      res.redirect("/campgrounds");
    }
    else {
      req.flash("success", "Campground updated successfully!");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
  // redirect to index page
});

// DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id", middleware.checkCampAuthorization, function (req, res) {
  Campground.findByIdAndDelete(req.params.id, function (err) {
    if (err) {
      req.flash("error", err);
      res.redirect("/campgrounds");
    }
    else {
      req.flash("success", "Campground deleted successfully!");
      res.redirect("/campgrounds");
    }
  });
});

//#region middleware

//middleware check authenticated
// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect("/login");
// }

// //middleware check authorization
// function checkCampAuthorization(req, res, next) {
//   //check if user is logged in
//   if (req.isAuthenticated()) {

//     Campground.findById(req.params.id, function (err, foundCamp) {
//       if (err) {
//         res.redirect("back");
//       }
//       else {
//         //check if user created the camp
//         if (foundCamp.author.id.equals(req.user._id)) {
//           next();
//         }
//         else {
//           res.redirect("back");
//         }
//       }
//     });
//   }
//   else {
//     res.redirect("back");
//   }
// }
//#endregion

module.exports = router;
