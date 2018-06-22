var mongoose = require("mongoose");
var Post = require("./models/post");

var data = [
    {
        author: "Jacques",
        game: "Rocket League",
        speaking: "French",
        learning: "English"
    },
    {
        author: "Pierre",
        game: "FFXIV",
        speaking: "French",
        learning: "English"
    },
    {
        author: "John",
        game: "Rocket League",
        speaking: "English",
        learning: "French"
    },
    {
        author: "Joseph",
        game: "FFXIV",
        speaking: "English",
        learning: "French"
    }
]


function seedDB(){
    Post.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed posts");
        // add the posts in
        data.forEach(function(seed){
            Post.create(seed, function(err, post){
                if(err) {
                    console.log(err);
                } else {
                    console.log("added a post in!");
                }
            });
        });
    });
}

module.exports = seedDB;