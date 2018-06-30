var mongoose = require("mongoose");

var convoSchema = new mongoose.Schema({
    convoId: String,
    participants: {
        person1: String,
        person2: String
    }
    
});

module.exports = mongoose.model("Convo", convoSchema);