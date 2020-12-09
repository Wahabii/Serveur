const Joi =require('joi');
const mongoose=require('mongoose');
const config=require('config');
const jwt=require('jsonwebtoken');
const UserSchema= new mongoose.Schema({

name:{   
type:String,
required:true,
minlength:5,
maxlength:10
},
email:{   
type:String,
required:true,
minlength:5,
maxlength:55,
unique :true
},
password:{   
type:String,
required:true,
minlength:5,
maxlength:1024,
},
isAdmin:Boolean
});
 
UserSchema.methods.generateAuthToken = function () {
const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin } , config.get('jwtPrivateKey'));
return token ; 
}
const User=new mongoose.model('User',UserSchema);

function validateUser(user){
const schema ={
 name:Joi.string().min(5).max(50).required(),
 email:Joi.string().email().required(),
 password:Joi.string().min(5).max(255).required(),
 isAdmin:Joi.boolean()
};
 return Joi.validate(user,schema);
}

exports.UserSchema=UserSchema;
exports.User=User;
exports.validate=validateUser;