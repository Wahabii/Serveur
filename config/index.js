

if(process.env.NODE_ENV === 'production') {
    //Offre production stage environment variables
    module.exports = {
        host: process.env.host || "",
        dbURI: process.env.dbURI
    }
}else{
     //Offre dev stage settings and data
    // module.exports = require('./development.json');
     module.exports = require('./development.json');
}


/*

    "host": "http://localhost:3000",
    "db":"mongodb://localhost/concessionnaire_db"
    ////////////////////////////////////////////
    
    "host": "http://localhost:3000",
    "db":"mongodb+srv://user100:52888101jjj@cluster0.evrkm.mongodb.net/EcommerceApp?retryWrites=true&w=majority"


*/