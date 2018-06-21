var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");


mongoose.connect("mongodb://localhost/gamer_exchange");
app.set("view engine", "ejs");


// schema setup
var entrySchema = new mongoose.Schema({
    username: String,
    gameName: String
});
// compile this schema into a model
var Entry = mongoose.model("Entry", entrySchema);

// Entry.create(
//     {
//         username: "mitchmcconnell",
//         gameName: "7 Days to Die"
//     }, function(err, entry) {
//         if(err){
//             console.log(err);
//         } else {
//             console.log("newly created entry: ");
//             console.log(entry);
//         }
//     });

app.get("/", function(req, res){
    res.render("landing");    
});

app.get("/gameResults", function(req, res) {
    // get all entries from DB
    Entry.find({}, function(err, entries){
        if(err){
            console.log(err);
        } else {
            res.render("gameResults", {entries:entries});
        }
    })
    
});






app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The gamer exchange server has started!");
});