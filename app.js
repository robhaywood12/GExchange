var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    seedDB      = require("./seeds"),
    
// auth variables
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    User            = require("./models/user"),
    Post            = require("./models/post"),
    
// method override
    methodOverride  = require("method-override");
    
    
// nodemailer things
var nodemailer = require("nodemailer");
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "emailhere",
            pass: "passwordhere"
        
        }
    });
    
    



mongoose.connect("mongodb://localhost/gamer_exchange");
app.use(bodyParser.urlencoded({extended: true})); // needed to run body-parser properly. for some reason.
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

// seed the DATABAS
//seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Pineapple pizza is the best!",
    resave: false,
    saveUninitialized: false
})); // i don't understand why this part is necessary. need to research more

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //authenticate method comes from userschema.plugin
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// ^^^^^ is more setup for passport auth

// custom function to pass user data to decide if user is logged in or not.
// IOW, it handles whether to show Login/Register or Logout
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});


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

app.get("/pleaseConfirm", function(req, res) {
    res.render("pleaseConfirm");
})

app.get("/gameResults", isLoggedIn, function(req, res) {
    //// get all entries from DB
    // Post.find({}, function(err, entries){
    //     if(err){
    //         console.log(err);
    //     } else {
    //         var speaking = req.query.speaking;
    //         var learning = req.query.learning;
    //         res.render("gameResults", {entries:entries, speaking:speaking, learning:learning});
    //         }
    // })
    User.find({}, function(err, persons){
        if(err){
            console.log(err);
        } else {
            var username    = req.query.username,
                speaking    = req.query.speaking,
                learning    = req.query.learning,
                desc        = req.query.desc,
                country     = req.query.country
                
            res.render("gameResults", 
            {
                entries:persons,
                speaking:speaking,
                learning:learning,
                desc:desc,
                country:country
            })
        }
    })
    
});

app.get("/search", function(req, res){
   res.render("search"); 
});


// AUTHENTICATION ROUTES

// show register form
app.get("/register", function(req, res){
   res.render("register"); 
});

//handle signup logic
app.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username,
        country: req.body.country,
        nativeLang: req.body.nativeLang,
        practLang: req.body.practLang,
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
                from: "jellypineappleglaze@gmail.com",
                to: user.email,
                subject: "Please confirm your e-mail address",
                text: "https://gamer-exchange-joseo.c9users.io/activation/"+user.authToken
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


//show login form
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
    }), function(req, res){
});

//logout route (just a get request)
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
})


// USER PROFILES ROUTE
app.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
       if(err) {
           console.log(err);
           res.redirect("/");
       } 
       res.render("users/show", {user: foundUser});
    });
    
});

app.get("/users/:id/edit", checkOwnership, function(req, res){
        User.findById(req.params.id, function(err, foundUser){
            res.render("users/edit", {user: foundUser}); 
                });
        
        //if not, redirect
    // if not, redirect

});

// app.get("/verifyaccount", function(req, res){
//   res.render("verifyaccount"); 
// });


app.put("/users/:id", checkOwnership, function(req, res){
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


// TOKEN HANDLING ROUTES
app.get("/activation/:authToken", function(req, res){
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

app.post("/activation/:authToken", function(req, res){
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


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The gamer exchange server has started!");
});