var mongoose = require("mongoose");
var passportLocalMongooseEmail = require("passport-local-mongoose-email");

// now we need our userschema. username and password. mongoDB stuff.
var tempUser = new mongoose.Schema({
    username: String,
    password: String,
    country: String,
    nativeLang: String,
    practLang: String,
    desc: String,
    email: String
    
    
});

// this adds methods to our user!
tempUser.plugin(passportLocalMongooseEmail);

// export our schema model
module.exports = mongoose.model("User", tempUser);