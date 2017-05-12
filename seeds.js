var mongoose = require("mongoose");
var Parlor = require("./models/campground");
var Comment = require("./models/comment");
var data = [
    {
        name: "what a time", 
        image: "https://cdn.pixabay.com/photo/2016/03/28/18/17/ice-cream-man-1286520__340.jpg",
        description: "Blah blah"
    },
    {
        name: "Another one",
        image: "https://cdn.pixabay.com/photo/2014/05/30/04/52/restaurant-357891__340.jpg",
        description: "Seeding data"
    },
    {
        name: "Aesthetic",
        image: "https://cdn.pixabay.com/photo/2012/07/09/13/10/table-52176__340.jpg",
        description: "Beautiful tables"
    }
];

function seedDB() {
    //Remove all parlors
    Parlor.remove({}, function(err) {
        if(err) {
            console.log(err);
        }
        console.log("removed parlor!");
    
        //add a few parlors
        data.forEach(function(seed) {
            Parlor.create(seed, function(err, parlor) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("added parlor");
                    //create comment
                    Comment.create(
                        {
                            text: "This place is great but no internet",
                            author: "Homer"
                        }, function(err, comment) {
                            if(err) {
                                console.log(err);
                                
                            } else {
                                parlor.comments.push(comment);
                                parlor.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });       
        });
    });
}

module.exports = seedDB;