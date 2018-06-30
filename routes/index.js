var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var Convo = require("../models/conversation");
var Message = require("../models/message");

router.get("/", function(req, res){
    res.render("landing");    
});

router.get("/pleaseConfirm", function(req, res) {
    res.render("pleaseConfirm");
})


// finds users in the database and renders gameresults which shows a list of the users.
router.get("/gameResults", isLoggedIn, function(req, res) {
    User.find({}, function(err, persons){
        if(err){
            console.log(err);
        } else {
            var speaking    = req.query.speaking,
                learning    = req.query.learning
                
            res.render("gameResults", 
            {
                users:persons,
                speaking:speaking,
                learning:learning,
            })
        }
    })
    
});

router.get("/inbox", function(req, res){
    console.log(req.params);
    // search convoDB for convos where user is in participants list
    Convo.find({ $or:[{"participants.person1": "baguette99"}, {"participants.person2": "baguette99"}]}, function(err, foundConvos){
       if(err) {
           console.log(err);
       } else {
           console.log(foundConvos);
       }
        // gather all the messages in the DB
        Message.find({}, function(err, foundMessages){
        if(err) {
            console.log(err);
        } else {
            console.log(foundMessages);
        }
        
        // send all messages and all foundConvos over to inbox
        res.render("inbox", {foundConvos: foundConvos, foundMessages:foundMessages});   
        });
    });
});


// displays search page which decides which filter gameresults will sort through
router.get("/search", function(req, res){
   res.render("search"); 
});


//show login form
router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
    }), function(req, res){
});

//logout route (just a get request)
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
})


router.put("/users/:id", checkOwnership, function(req, res){
    // find and update the correct campground
    User.findByIdAndUpdate(req.params.id, req.body.edits, function(err, updatedEdits){
        if(err){
            res.redirect("/");
        } else {
            res.redirect("/");
        }
    });
    //redirect somewhere
});





//our middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


function checkOwnership(req, res, next) {
    if(req.isAuthenticated()){
        User.findById(req.params.id, function(err, foundUser){
            if(err){
                res.redirect("back");
            } else {
                // does user own the account?
                if(foundUser._id.equals(req.user._id)) {
                   next(); 
                } else {
                    res.redirect("back");
                }
                
            }
        });
    } else {
        res.redirect("back");
    }    
}


module.exports = router;