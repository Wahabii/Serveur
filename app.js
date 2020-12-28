const express = require("express");
var cors = require('cors')

const app = express();
var bodyParser = require("body-parser");

require("dotenv").config();
//console.log(process.env);

/// Use body parser middleware to parse body of incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Setup CORS
  app.use(cors());
// Setup static files path
app.use("/uploads", express.static("uploads"));

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`connected with port ${port} ...`));
