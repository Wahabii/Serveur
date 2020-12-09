
const express=require('express');
const app=express();
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();



const port=process.env.PORT || 3000;
app.listen(port,()=> console.log(`connected with port ${port} ...`));
