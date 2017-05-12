var Parlor = require("../models/campground");
var Comment = require("../models/comment");
// all the middleware goes here
var middlewareObject = {};

middlewareObject.checkParlorOwnership = function checkParlorOwnership(req, res, next) {
    if(req.isAuthenticated()) {
        Parlor.findById(req.params.id, function(err, foundParlor) {
            if(err) {
                req.flash("error", "Campground not found.");
            } else {
                // does user own campground
                // console.log(foundParlor.author.id)
                // console.log(req.user._id)
                if(foundParlor.author.id.equals(req.user._id)) {
                    next();   
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
                
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObject.checkCommentOwnerhip = function checkCommentOwnerhip(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();   
                } else {
                    req.flash("error", "You do not have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObject.isLoggedIn = function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
};

module.exports = middlewareObject;