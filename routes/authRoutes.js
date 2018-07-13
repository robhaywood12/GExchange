var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

// nodemailer things
var nodemailer = require("nodemailer");
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "gamerexchange.org@gmail.com",
            pass: "9E5Rdz*VHT0s"
        
        }
    });

// #######################################
// AUTHENTICATION ROUTES
// ######################################

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle signup logic
router.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username,
        country: req.body.country,
        nativeLang: req.body.nativeLang,
        practLang: req.body.practLang,
        gamesPlaying: req.body.gamesPlaying,
        desc: req.body.desc,
        email: req.body.email
    });
    
    // user is stored with a random token string and a variable set to false
    User.register(newUser, req.body.password, function(err, user){ // register handles hashing the password here.
        if(err){
            console.log(err); // return gets out of callback if we hit this point.
        }
        if (!newUser.isAuthenticated) {
            const mailOptions = {
                from: "Gamer Exchange",
                to: user.email,
                subject: "Please confirm your e-mail address",
                text: "Hello! Please confirm your e-mail here: https://www.gamerexchange.org/activation/"+user.authToken
            };
            transporter.sendMail(mailOptions, function(err, info){
                if(err) {
                    console.log(err);
                } else {
                    console.log(info);
                }
            })
            res.redirect("/pleaseConfirm");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/gameresults");
                })   
        };
    });
});

// ###############################################
// TOKEN HANDLING ROUTES. EMAIL VERIFICATION LOGIC
// ###############################################
router.get("/activation/:authToken", function(req, res){
    console.log(req.params.authToken);
    User.findOne({"authToken": req.params.authToken}, function(err, foundUser) {
        if(err) {
            console.log("error. sorry buddy :(");
        } else {
            //foundUser.isAuthenticated = true; -- wrong place
            res.render("verifyaccount", {user: foundUser});
        };
    }
    );
});

router.post("/activation/:authToken", function(req, res){
    User.findOne({"authToken": req.params.authToken}, function(err, foundUser){
        if(err) {
            console.log("error upon second entry. sorry buddy");
        } else {
            foundUser.isAuthenticated = true;
            foundUser.save(function(err){
                if(err) {
                    console.log(err);
                }
            })
            res.redirect("/");
        }
    })
})

module.exports = router;