var mongoose = require("mongoose");

var PostSchema = new mongoose.Schema({
    author: String,
    game: String,
    speaking: String,
    learning: String
    
});

module.exports = mongoose.model("Post", PostSchema);