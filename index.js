var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var path = require("path");

var Connection = require("./db/connection");
var User = Connection.models.User;
var userId;
var pg = require('pg');
// var database = "";


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname + "/public")));
app.set("view engine", "hbs");

var usersController = require("./controllers/users");
var pinsController = require("./controllers/pins");
var photosController = require("./controllers/photos");

app.use("/", usersController);
app.use("/", pinsController);
app.use("/", photosController);

app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function(){
  console.log("listening on port 3000")
});

var passport = require("passport");
var TwitterStrategy = require("passport-twitter").Strategy;


//does this work for heroku?
// var fs = require("fs")
// if (fs.existsSync("./env.js")){
//   console.log("yes")
//   var env = require("./env");
// }
// else {
//   var env = process.env;
// }


passport.use(new TwitterStrategy(
  {
    consumerKey: env.twitterConsumerKey,
    consumerSecret: env.twitterConsumerSecret,
    callbackURL: env.twitterCallbackUrl
  },
  function(token, tokenSecret, profile, cb){
    return cb(null, profile);
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(require("express-session")({ secret: "keyboard cat", resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

// app.get("/", function(req, res) {
//   res.send("<a href='/auth/twitter/login'>Login</a>");
// });

app.get("/auth/twitter/login", passport.authenticate("twitter"));

app.get("/auth/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
  function(req, res) {
    // console.log(req.session)
    // console.log(req.session.passport.user.id)
    // console.log("HELLLLLOOOOOOOOOO")
    console.log("------------------------------------------------")
    console.log("req.session.passport.user.id: "+req.session.passport.user.id)
    console.log("------------------------------------------------")
    User.find({
      where: {
        "twitter_id": req.session.passport.user.id
      }
    }).then(function(user){
      console.log(user);
      if(!user){
        User.create({
          twitter_id: req.session.passport.user.id
        }).then(function(user){
          userId = user.id
          return user;
        });
      }
      else {
        console.log("user already exists")
        userId = user.id
        return user;
      }
    })

    res.redirect("/");
  }
);

app.use(function(req, res, callback){
   if (req.user){
       res.locals.user = req.user
      //  set up middleware to talk between the database and your browser
   }
   callback();
})

app.get("/auth/twitter/show", function(req, res){
  if(userId){
    req.session["userId"] = userId;
  }
  res.json(req.session);
});

app.get('/signout', function(req, res){
  req.session.destroy()
  userId = null;
  res.redirect("/")
})

app.get("/", function(req, res){
  res.render("index", {userId: userId})
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Whee, I'm working!");
});
