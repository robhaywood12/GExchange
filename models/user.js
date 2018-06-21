var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

// now we need our userschema. username and password. mongoDB stuff.
var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

// this adds methods to our user!
UserSchema.plugin(passportLocalMongoose);

// export our schema model
module.exports = mongoose.model("User", UserSchema);