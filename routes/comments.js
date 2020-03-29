var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware/index");

//COMMENT
//===========================
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res)
{
  //find campground by id
  Campground.findById(req.params.id, function(err, foundCamp)
  {
    if(err)
    {
      req.flash("error", err);
    }
    else
    {
      //console.log(foundCamp);
      res.render("comments/new", {campground:foundCamp});
    }
  });
});

//Comment Create
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res)
{
  //lookup campground using ID
  Campground.findById(req.params.id, function(err, foundCamp)
  {
    if(err)
    {
      req.flash("error", err);
    }
    //ad new comment to the campground
    else{
      Comment.create(req.body.comment, function(err, newComment)
      {
        if(err)
        {
          req.flash("error", err);
        }
        else{
          //add username and id to comment
          newComment.author.id=req.user._id;
          newComment.author.username=req.user.username;
          //console.log(req.user);
          //save comment
          newComment.save();
          foundCamp.comments.push(newComment);
          foundCamp.save();
          //redirect if success
          //console.log(newComment);
          req.flash("success", "Comment added successfully!");
          res.redirect("/campgrounds/"+foundCamp.id);
        }
      });
    }
  });
});

//EDIT COMMENT
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentAuthorization, function(req, res)
{
  Comment.findById(req.params.comment_id, function(err, foundComment)
  {
    if(err)
    {
      req.flash("error", err);
      res.redirect("back");
    }
    else{
      res.render("comments/edit", {campground_id:req.params.id, comment:foundComment});
    }
  });
  
});

//UPDATE COMMENT
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentAuthorization, function(req, res)
{
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err)
  {
    if(err)
    {
      req.flash("error", err);
      res.redirect("back");
    }
    else{
      req.flash("success", "Comment updated successfully!");
      res.redirect("/campgrounds/"+req.params.id);
    }
  });
});

//DELETE COMMENT
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentAuthorization, function(req, res)
{
  //find by ID and Remove
  Comment.findByIdAndDelete(req.params.comment_id, function(err)
  {
    if(err)
    {
      req.flash("error", err);
      res.redirect("back");
    }
    else{
      req.flash("success", "Comment deleted successfully!");
      res.redirect("/campgrounds/"+req.params.id);
    }
  });
});

//#region middleware
//middleware
// function isLoggedIn(req, res, next)
// {
//   if(req.isAuthenticated())
//   {
//     return next();
//   }
//   res.redirect("/login");
// }

// // //middleware check authorization
// function checkCommentAuthorization(req, res, next)
// {
//   //check if user is logged in
//   if(req.isAuthenticated())
//   {

//     Comment.findById(req.params.comment_id, function(err, foundComment){
//       if(err)
//       {
//         res.redirect("back");
//       }
//       else
//       {
//         //check if user created the comment
//         if(foundComment.author.id.equals(req.user._id))
//         {
//           next();
//         }
//         else{
//           res.redirect("back");
//         }
//       }
//     });
//   }
//   else{
//     res.redirect("back");
//   }
// }
//#endregion

module.exports=router;