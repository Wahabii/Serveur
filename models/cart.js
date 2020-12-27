
const Joi = require('joi');
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
     amount:{
         type: Number,
         required:true
     },
     price:{
          type:Number,
          required: true
     },
     name:{
         type: String,
         required:true
     },
     addedBy:{
         type: mongoose.Schema.Types.ObjectId,
         ref:'User'
        }

});


const Cart= new mongoose.model('cart', cartSchema);


function cartValidate(cart){
  const schema = {
      price : Joi.number().required(),
      name: Joi.string().min(3).max(20).required(),
      amount: Joi.number().required()      
    }

    return Joi.validate(cart,schema);
}



exports.Cart=Cart;
exports.validate=cartValidate;
