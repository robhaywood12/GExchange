var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    shortid     = require("shortid"),
    mongoose    = require("mongoose"),
    seedDB      = require("./seed"),
    forceSsl    = require("force-ssl-heroku"),
    
// auth variables
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    
// database variables
    User            = require("./models/user"),
    Message         = require("./models/message"),
    Convo           = require("./models/conversation"),
    
// routes
    authRoutes      = require("./routes/authRoutes"),
    userRoutes      = require("./routes/userRoutes"),
    indexRoutes     = require("./routes/index"),
    
// method override
    methodOverride  = require("method-override");

// connecting to mongoDB
mongoose.connect(process.env.DATABASEURL);

app.use(bodyParser.urlencoded({extended: true})); // needed to run body-parser properly. for some reason.
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(forceSsl);
app.set("view engine", "ejs");

// seed the DATABAS
//seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Pineapple pizza is the best!",
    resave: false,
    saveUninitialized: false
}));

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


// use our route variables
app.use(indexRoutes);
app.use(userRoutes);
app.use(authRoutes); 
// ^ can say app.use("/something", xRoutes); to start every route with /something


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The gamer exchange server has started!");
});