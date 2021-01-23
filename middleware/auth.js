const jwt=require('jsonwebtoken');
//const config=require('config');

const getKeyPass = require('./../startup/config').getKeyPass();
module.exports=(req,res,next) =>{
const token = req.header('access_token');
if(!token) return  res.status(401).send('Access denied , no token provided');

try{
const decoded = jwt.verify(token , getKeyPass);
req.user= decoded;
next();
}catch(ex){

res.status(400).send('invalid token');

}


}

