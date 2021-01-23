
const Joi = require('joi');
const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
     serviceName:{
         type: String,
         required:true
     },
     note:{
          type:Number,
          required: true
     },
     addedBy:{
         type: mongoose.Schema.Types.ObjectId,
         ref:'User'
        }

});


const Service= new mongoose.model('Service', ServiceSchema);


function ServiceValidate(service){
  const schema = {
     
      serviceName: Joi.string().min(3).max(20).required(),
      note: Joi.number().required()      
    }

    return Joi.validate(service,schema);
}



exports.Service=Service;
exports.validate=ServiceValidate;
