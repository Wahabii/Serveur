const express=require('express');
const materiels=require('../router/materiels');
const users=require('../router/users');
const auth=require('../router/auth');
const products=require('../router/products');
const orders=require('../router/orders');
const carts=require('../router/carts');
module.exports=function(app){
    app.use(express.json());
    app.use('/api/materiels',materiels);
    app.use('/api/users',users);
    app.use('/api/auth',auth);
    app.use('/api/products',products);
    app.use('/api/orders',orders);
    app.use('/api/carts', carts);
  

}