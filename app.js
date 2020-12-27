const express = require("express");

const app = express();
var bodyParser = require("body-parser");

require("dotenv").config();
//console.log(process.env);

/// Use body parser middleware to parse body of incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Setup CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
  });

// Setup static files path
app.use("/uploads", express.static("uploads"));

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`connected with port ${port} ...`));
