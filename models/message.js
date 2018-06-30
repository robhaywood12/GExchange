var mongoose = require("mongoose");

var messageSchema = new mongoose.Schema({
    author: String,
    content: String,
    convoId: String
    
});

module.exports = mongoose.model("Message", messageSchema);