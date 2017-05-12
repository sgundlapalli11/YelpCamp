var express = require("express");
var router = express.Router();
var Parlor = require("../models/campground");
var middleware = require("../middleware");

//INDEX - show all Ice Cream Parlors
router.get("/", function(req, res) {
    //Get all parlors from DB
    Parlor.find({}, function(err, parlors) {
        if (err) {
            console.log(err);
        } else {
            res.render("parlors/index", {campgrounds: parlors});
        }
    });
});

//NEW - show form to create new parlor
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("parlors/new.ejs");
});

//CREATE - add new parlor to database
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = { name: name, image: image, description : desc, author: author};
    console.log("New campground: " + newCampground);
    //Create a new parlor and save to DB
    Parlor.create(newCampground, function(err, newParlor) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campground");    
        }
    });
});

//SHOW - shows more info about one campground
router.get("/:id", function(req, res) {
    //find the parlor with the provided ID
    Parlor.findById(req.params.id).populate("comments").exec(function(err, foundParlor) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that parlor
            // console.log('*********');
            // console.log(foundParlor);
            res.render("parlors/show.ejs", {parlor : foundParlor});
        }
    });
});

// EDIT PARLOR ROUTE
router.get("/:id/edit", middleware.checkParlorOwnership, function(req, res) {
    Parlor.findById(req.params.id, function(err, foundParlor) {
        if(err) {
            res.redirect("/campground");
        } else {
            res.render("parlors/edit", {parlor : foundParlor});
        }
    });
});

// UPDATE PARLOR ROUTE
router.put("/:id", middleware.checkParlorOwnership, function(req, res) {
    //find and update the correct campground
    Parlor.findByIdAndUpdate(req.params.id, req.body.parlor, function(err, updatedParlor) {
        if(err) {
            res.redirect("/campground");
        } else {
            res.redirect("/campground/" + req.params.id);
        }
    });
});

// DESTROY PARLOR ROUTE
router.delete("/:id", middleware.checkParlorOwnership, function(req, res) {
    Parlor.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/campground");
        } else {
            res.redirect("/campground");
        }
    });
});






module.exports = router;