var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    seedDB      = require("./seeds");
    
// auth variables
var passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    User            = require("./models/user"),
    Post            = require("./models/post");


mongoose.connect("mongodb://localhost/gamer_exchange");
app.use(bodyParser.urlencoded({extended: true})); // needed to run body-parser properly. for some reason.
app.set("view engine", "ejs");

// seed the DATABAS
seedDB();

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

app.get("/gameResults", isLoggedIn, function(req, res) {
    // get all entries from DB
    Post.find({}, function(err, entries){
        if(err){
            console.log(err);
        } else {
            res.render("gameResults", {entries:entries});
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
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){ // register handles hashing the password here.
        if(err){
            console.log(err);
            return res.render("register") // return gets out of callback if we hit this point.
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/gameResults");
        });
    });
});

//show login form
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/gameResults",
    failureRedirect: "/login"
    }), function(req, res){
});

//logout route (just a get request)
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
})

//our middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The gamer exchange server has started!");
});