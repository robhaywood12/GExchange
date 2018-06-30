var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Convo = require("../models/conversation");
var Message = require("../models/message");

// ###############################
// USER PROFILES ROUTE
// ###############################
router.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
       if(err) {
           console.log(err);
           res.redirect("/");
       } 
       res.render("users/show", {user: foundUser});
    });
    
});

router.get("/users/:id/edit", checkOwnership, function(req, res){
        User.findById(req.params.id, function(err, foundUser){
            res.render("users/edit", {user: foundUser}); 
                });
});

// MESSAGING ROUTES
router.get("/message/:id", function(req, res){
        User.findById(req.params.id, function(err, foundUser){
            res.render("message", {user: foundUser});
        });
});


router.post("/message/:id", function(req, res){
   var recipientID = req.params.id;
   res.send(" ohboy")
   // search if (user is person1 and recipient is person2) OR (user is person2 and recipient is person1)
        // if not found, create a new convoDB entry 
            // add id and participants
            // add in a messageDB entry with that ID
        
        // else, 
            // add in a messageDB entry with that ID
        // redirect to /inbox
});



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