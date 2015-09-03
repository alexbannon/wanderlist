// AM: When I first tried to run the app locally, I got an error saying that I was missing a consumer key / env.js file.
// AM: Which is okay, but should let users know about that in your readme.

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var path = require("path");
var session = require("express-session");
app.use(session({
  secret: "keyboard cat"
}))

var Connection = require("./db/connection");
var pg = require('pg');
var db = require("./db/connection");
var fs = require("fs")

pg.connect(process.env.DATABASE_URL, function(err, client) {
  console.log(process.env.DATABASE_URL);
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      // console.log(JSON.stringify(row));
    });
});

var User = Connection.models.User;
var userId;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname + "/public")));
app.set("view engine", "hbs");

if (fs.existsSync("./env.js")){
  console.log("yes")
  var env = require("./env");
}
else {
  var env = process.env;
}


var usersController = require("./controllers/users");
var pinsController = require("./controllers/pins");
var photosController = require("./controllers/photos");

app.use("/", usersController);
app.use("/", pinsController);
app.use("/", photosController);

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });

var passport = require("passport");
var TwitterStrategy = require("passport-twitter").Strategy;

// +1 using env.js

passport.use(new TwitterStrategy(
  {
    consumerKey: env.twitterConsumerKey,
    consumerSecret: env.twitterConsumerSecret,
    callbackURL: env.twitterCallbackUrl
  },
  function(token, tokenSecret, profile, done){
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());


app.use(function(req, res, callback){
   if (req.user){
       res.locals.user = req.user
      //  set up middleware to talk between the database and your browser
   }
   callback();
})

app.get("/", function(req, res){
  res.render("index", {})
});

app.get("/auth/twitter/login", passport.authenticate("twitter"));

app.get("/auth/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
  function(req, res) {
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
