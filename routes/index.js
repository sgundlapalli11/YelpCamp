var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res) {
    res.render("landing");
});

//=============
// AUTH ROUTES
//=============

//show register form
router.get("/register", function(req, res) {
   res.render("register", {page: 'register'}); 
});

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to YelpCamp " + user.username + ".");
            res.redirect("/campground");
        });
    });
});

//show login form
router.get("/login", function(req, res) {
    res.render("login", {page: 'login'});
});
// handling login form
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campground",
        failureRedirect: "/login"
    }), function(req, res) {
});

// logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campground");
});


module.exports = router;