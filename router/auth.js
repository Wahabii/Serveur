const config =require('config');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const _=require('lodash');
const Joi =require('joi');
const mongoose=require('mongoose');
const {User}=require('../models/user');
const express=require('express');
const router=express.Router();


router.post('/login', async (req,res)=>{
//console.log(req.body);
const {error} = validate(req.body);
if (error) return res.status(404).send(error.details[0].message);
let user = await User.findOne({ email: req.body.email});
if(!user) return res.status(400).send('invalid email.');
const validPassword= await bcrypt.compare(req.body.password, user.password); 
if(!validPassword)return res.status(400).send('invalid password');
const token=user.generateAuthToken();
res.send({'username': user.name, 'id':user._id,'isAdmin': user.isAdmin, 'email': user.email, token: token},)
});






function validate(req){
const schema ={
email:Joi.string().min(5).max(255).required(),
password:Joi.string().min(5).max(255).required()
};
return Joi.validate(req,schema);
}
module.exports=router;