const express = require("express");

const app = express();
var bodyParser = require("body-parser");

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Access for all cross origin */
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
  });

/* middlawere make theuploads public */
app.use("/uploads", express.static("uploads"));

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`connected with port ${port} ...`));
