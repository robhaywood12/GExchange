var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Convo = require("../models/conversation");
var Message = require("../models/message");
var shortid = require("shortid");

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
            if(err) {
                console.log(err);
            } else {
                res.render("users/edit", {user: foundUser});
            }
                });
});

router.get("/messages/:id/:recipID", function(req, res){
    var convoid = req.params.id;
    var recipID = req.params.recipID;
    console.log(convoid);
    Convo.find({convoId: convoid}, function(err, convo) {
        if(err) {
            console.log(err);
            res.redirect("/");
        } else {
            Message.find({}, function(err, messages) {
                if(err) {
                    console.log(err);
                } else {
                    User.findOne({_id: recipID}, function(err, recipi) {
                        if(err) {
                            console.log(err);
                        } else {
                            res.render("users/showConvo", {convo: convo, messages: messages, recipi: recipi});
                        }
                    })
                }
            })
        }
    });
});

// MESSAGING ROUTES
router.get("/message/:id/newMessage", function(req, res){
        User.findById(req.params.id, function(err, foundUser){
            if(err) {
                console.log(err);
            } else {
                res.render("newMessage", {user: foundUser});
            }
        });
});


// this route is in charge of posting the message into the DB
router.post("/message/:id", function(req, res){
    // look up recipient using ID
    User.findById(req.params.id, function(err, foundUser){
        if(err) {
            console.log(err);
        } else {
            Convo.findOne({ $or:[{ $and: [ {"participants.person1": foundUser.username}, {"participants.person2": req.body.currentuser} ] }, { $and: [ {"participants.person1": req.body.currentuser}, {"participants.person2": foundUser.username} ] }]}, function (err, foundConvo){
                if (err) {
                    console.log(err);
                } else {
                    // if the convo exists, store the convoID into a variable
                    // var conversationID;
                    if (!foundConvo) {
                        var randomID = shortid.generate();
                        var convoEntry = [
                            {
                                convoId: randomID,
                                participants: {
                                    person1: foundUser.username,
                                    person2: req.body.currentuser
                                    },
                                participantID: {
                                    person1: foundUser.id,
                                    person2: req.body.currentUserID
                                }
                            }    
                        ];
                        Convo.create(convoEntry, function(err, createdConvo) {
                            if(err) {
                                console.log(err);
                            } else {
                                console.log("printing post");
                                var messageEntry = [
                                    {
                                        author: req.body.currentuser,
                                        content: req.body.content,
                                        convoId: randomID
                                    }    
                                ]
                                Message.create(messageEntry, function(err, createdMessage) {
                                    if(err) {
                                        console.log(err);
                                    } else {
                                        console.log("message creation success.");
                                        res.redirect("/inbox");
                                    }
                                });
                            }
                        });
                    } else {
                        console.log("entry already exists. assigning convoId:");
                        console.log(foundConvo.convoId);
                        var messageEntry = [
                        {
                            author: req.body.currentuser,
                            content: req.body.content,
                            convoId: foundConvo.convoId
                        }
                        ];
                        Message.create(messageEntry, function(err, post) {
                            if(err) {
                                console.log(err);
                            } else {
                                console.log("message creation success!");
                                res.redirect("/inbox");
                            }
                        });
                    }
                }
            });
            
        }
    });
   // search if (user is person1 and recipient is person2) OR (user is person2 and recipient is person1)
        // if not found, create a new convoDB entry 
            // generate random ID
            // create convoEntry with randomID and participants
            // add convoEntry to convoDB
            // create messageEntry with randomID, author & content
            // add message Entry to messageDB
        // else, 
            // create messageEntry with randomID, author & content
            // add message Entry to messageDB
        // redirect to /inbox
});

// function sendMessage(sender, recipient, message) {
//     console.log("sender is " + sender);
//     console.log("recipient is " + recipient);
//     console.log("mesage is " + message);
// }


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