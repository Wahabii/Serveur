const path = require('path');
const mongoose=require('mongoose');
const http = require('http');
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
//console.log(process.env);

//twilio credintienls
/*
const accountSid = process.env.TWILO_ACCOUNT_SID;
console.log("account>>>",accountSid);
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages.create({
     body: 'new notification service ',
     from:'+12014307518',
     to:'+21646252982'
}).then((message)=> console.log(message))
.catch(err => console.log(err))
*/







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
  //  console.log(profile);
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

const publicPath = path.join(__dirname,'./public');

app.use(express.static(publicPath));

//var server = http.createServer(app);
//var io = socketIo(server);


// partie pour le test 

const characters = [
    {
        name: 'Luke Skywalker',
        height: '172',
        mass: '77',
        eye_color: 'blue',
        gender: 'male',
    },
    {
        name: 'Darth Vader',
        height: '202',
        mass: '136',
        eye_color: 'yellow',
        gender: 'male',
    },
    {
        name: 'Leia Organa',
        height: '150',
        mass: '49',
        eye_color: 'blue',
        gender: 'female',
    },
    {
        name: 'Anakin Skywalker',
        height: '188',
        mass: '84',
        eye_color: 'blue',
        gender: 'male',
    },
   
];

//***FILTER***//

// 1. Get characters with mass greater than 100
const greater100Characters = characters.filter(
    (character) => character.mass > 100 
);
//console.log(greater100Characters);
//2. Get characters with height less than 200

const shorterChar = characters.filter(
    (character)=> character.height < 200
);
//console.log(shorterChar);

//Get all male characters
const maleCharacters = characters.filter(
    (character)=> character.gender === 'male'
);
//console.log(maleCharacters);
//Get all female characters
const femaleCharacters = characters.filter(
    (character)=> character.gender === 'female'
);
//console.log(femaleCharacters);

//***REDUCE***//
//1.Get total mass of all characters 
const totalMass = characters.reduce((acc, cur) => acc + cur.mass, 0);

//console.log(totalMass);

//1.Get total height of all characters 
const totalHeihgt = characters.reduce((acc, cur) => acc + cur.height, 0);

//console.log(totalHeihgt);

//2. Get total number of characters by eye color 
const charactersByEyeColor = characters.reduce((acc, cur) => {
    const color = cur.eye_color;
    if (acc[color]){
        acc[color]++;

    }else {
        acc[color] = 1;
    }
   return acc;
}, {});

//console.log(charactersByEyeColor);

//4. Get total number of characters in all the character names 

const totalNameCharacters = characters.reduce((acc, cur) => acc + cur.name.length, 0);
//console.log(totalNameCharacters);


//***SORT***//
//1. Sort by mass
const byMass = characters.sort((a, b) => {
   // return b.mass - a.mass;// sort by grand to short
    return a.mass - b.mass;// sort by short to grand
});
//console.log(byMass);

//2. Sort by height
const byHeight = characters.sort((a, b) => 
    // return b.height - a.height;// sort by grand to short
      a.height - b.height// sort by short to grand
 );
 //console.log(byHeight);
 
//3. Sort by name
const byName = characters.sort((a, b) => {
    if(a.name < b.name) return 1;
    return -1;
});

//console.log(byName);


//4. Sort by gender
const byGender = characters.sort((a, b) => {
    if(a.gender < b.gender) return -1;
    return 1;
});

//console.log(byGender);

 //***SOME***//
 //1. Is there at least one male character ?
const oneMaleCharacter = characters.some(
    (character) =>  character.gender === 'male'
);
//console.log(oneMaleCharacter);

//2. Is there at least one male character with blue eyes ?
const oneBlueEyes = characters.some(
    (character) =>  character.eye_color === 'blue'
);
//console.log(oneBlueEyes);


//3. Is there at least one male character taller than 210 ?
const oneTallerThan210 = characters.some(
    (character) =>  character.height > 210 
);
//console.log(oneTallerThan210);


//4. Is there at least one character that mass less than 50 ?
const oneMassLessThan50 = characters.some(
    (character) =>  character.mass < 50
);
//console.log(oneMassLessThan50);

//***EVERY***//
//1. Does every character have blue eyes?
const allBlueEyes = characters.every(
    (character) => character.eye_color === 'blue'
);
//console.log(allBlueEyes);

//2. Does every character have mass more than 40?
const allMassMoreThan40 = characters.every(
    (character) => character.mass > 40
);
//console.log(allMassMoreThan40);

//3. is every character shorter than 200?
const allShorterThan200 = characters.every(
    (character) => character.height < 200
);
//console.log(allShorterThan200);


//4. is every character male?
const allMale = characters.every(
    (character) => character.gender === 'male'
);
//console.log(allMale);

//***MAP***//
//1. Get array of all names 
const names = characters.map(
    (character) => character.name
);
//console.log(names);

//2. Get array of all heights 
const heights = characters.map(
    (character) => character.height
);
//console.log(heights );

//3. Get array of object  with just name and height properties
const data = characters.map(
    (character) => ({
        name: character.name,
        height: character.height
    })
    
);
//console.log(data);
//4. Get array of all first names 
const firstname = characters.map((character) => character.name.split(' ')[0]);
console.log(firstname);




const port = process.env.PORT || 3000;

const server = app.listen(port, () => console.log(`connected with port ${port} ...`));
const io = require('./socket').init(server);

  

io.on('connection', socket => {
    console.log('a user connected');
  
    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
     
     /*
      socket.on('my message', (msg) => {
         console.log('message: ' + msg);
        io.emit('my broadcast', `server send: ${msg}`);
      });
      */
});