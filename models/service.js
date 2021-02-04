
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
        },
        id_Categorie: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Categorie"
            }
        ]

});


const Service= new mongoose.model('Service', ServiceSchema);


function ServiceValidate(service){
  const schema = {
     
      serviceName: Joi.string().min(3).max(20).required(),
      note: Joi.number().required(),
      id_Categorie: Joi.string()      
    }

    return Joi.validate(service,schema);
}



exports.Service=Service;
exports.validate=ServiceValidate;
