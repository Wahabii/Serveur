const path = require('path');
const mongoose=require('mongoose');
const express = require("express");
const cors=require("cors");
const app = express();
var bodyParser = require("body-parser");
const socketIo = require('socket.io');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy
const session = require('express-session');

require("dotenv").config();
console.log(process.env);

/// Use body parser middleware to parse body of incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use(passport.initialize());
app.use(passport.session());
app.use(session({secret:"fffvvfgbbddrrrs"}))


// make our facebook strategy
passport.use(new facebookStrategy({
    clientID : "1725834984241163",
    clientSecret : "066fff8ac372c8bf9b9af53e4bf33fe4",
    callbackURL : "http://localhost:3000/auth/facebook/callback",
    profileFields : ['id','displayName','name','gender','picture.type(large)','email']
},//facebook will send back the token and profile
function(token,refreshToken,profile,done){
    console.log(profile);
    return done(null,profile)

}));


app.get('/auth/facebook',passport.authenticate('facebook',{scope:'email'}));

app.get('/facebook/callback', passport.authenticate('facebook',{
      successRedirect: '/profile',
      failureRedirect: '/failed'
}))

app.get('/profile',(req,res) => {
    res.send("you are a valid user")
})


app.get('/faild',(req,res) => {
    res.send("you are non a valid user")
})

//used to serialized the user
passport.serializeUser(function(user,done){
   return done(null,user)
});

//used to deserialized the user
passport.deserializeUser(function(id,done){
 return done(null,id)
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////


// Setup CORS
app.use(cors());

// Setup static files path
//app.use("/uploads", express.static("uploads"));
app.use("/uploads",express.static(path.join(__dirname,"uploads")))

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config").getKeyPass();


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`connected with port ${port} ...`));
