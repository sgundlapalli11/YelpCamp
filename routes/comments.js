var express = require("express");
var router = express.Router({mergeParams: true});
var Parlor = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments new
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //find campground by ID
    Parlor.findById(req.params.id, function(err, parlor) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { parlor : parlor});
        }
    });
});


//Comments create
router.post("/", middleware.isLoggedIn, function(req, res) {
    //loopup parlor using ID
    Parlor.findById(req.params.id, function(err, parlor) {
        if(err) {
            console.log(err);
            res.redirect("/campground");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    req.flash("error", "Something went wrong.");
                    console.log(err);
                } else {
                    // add username and ID to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //console.log("new comment username wil be : " + req.user.username);
                    comment.save();
                    parlor.comments.push(comment);
                    parlor.save();
                    //console.log("Saved comment: " + comment);
                    req.flash("success", "Succesfully created comment.");
                    res.redirect("/campground/" + parlor._id);
                }
            });
        }
    });
});


// EDIT COMMENT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnerhip, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {parlor_id : req.params.id, comment : foundComment});
        }
    });
});

// COMMENTS UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnerhip, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/campground/" + req.params.id);
        }
    });
});

// COMMENTS DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnerhip, function(req, res) {
   Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted.");
            res.redirect("/campground/" + req.params.id);
        }
    });
});

module.exports = router;