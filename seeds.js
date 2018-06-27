var mongoose = require("mongoose");
var Post = require("./models/post");

var data = [
    {
        username: "baguette99",
        game: "Rocket League",
        nativeLang: "French",
        practLang: "English",
        desc: "bonjour, je m'appelle baguette et je suis une baguette mdr",
        password: "password"
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