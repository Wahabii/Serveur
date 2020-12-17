const express=require('express');
const materiels=require('../router/materiels');
const users=require('../router/users');
const auth=require('../router/auth');
const products=require('../router/products');
module.exports=function(app){
    app.use(express.json());
    app.use('/api/materiels',materiels);
    app.use('/api/users',users);
    app.use('/api/auth',auth);
    app.use('/api/products',products);
  

}