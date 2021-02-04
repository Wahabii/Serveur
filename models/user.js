const Joi =require('joi');
const mongoose=require('mongoose');

const jwt=require('jsonwebtoken');

const getKeyPass = require('./../startup/config').getKeyPass();

const UserSchema= new mongoose.Schema({


name:{   
type:String,
required:true,
minlength:5,
maxlength:55
},
email:{   
type:String,
required:true,
minlength:5,
maxlength:55,
unique :true
},
address:{
type:String,
minlength:5,
maxlength:55
},
passwordConfirm:{
type:String,
required:true,
minlength:5,
maxlength:1024,
},
password:{   
type:String,
required:true,
minlength:5,
maxlength:1024,
},
products: 
  [{
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Product'
  }],
  services: 
  [{
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Service'
  }],

isAdmin:{ 
type: Boolean,
default: false 
 },
 serviceRequests: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceRequest",
  },
],

 categories: [
   {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Categorie",
   }
 ]
},
{timestamps: true}
);
 
/*
UserSchema.virtual('products',{
   ref:'Product',
   localField:'_id',
   foreignField:'owner'
})
*/


UserSchema.methods.generateAuthToken = function () {
const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin } ,getKeyPass,{expiresIn: '2 days'});
return token ; 
}
const User=new mongoose.model('User',UserSchema);

function validateUser(user){
const schema ={
 name:Joi.string().min(5).max(50).required(),
 email:Joi.string().email().required(),
 password:Joi.string().min(5).max(255).required(),
 isAdmin:Joi.boolean(),
 address: Joi.string().min(5).max(50),
 passwordConfirm: Joi.string().min(5).max(255).required(),

};
 return Joi.validate(user,schema);
}

exports.UserSchema=UserSchema;
exports.User=User;
exports.validate=validateUser;