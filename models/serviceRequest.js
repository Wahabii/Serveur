const Joi = require("joi");
const mongoose = require("mongoose");

const ServiceRequestSchema = new mongoose.Schema(
  {
    Note: {
      type: String,
      required: true,
    },
    Rating:{
      type: Number,
      required: true
    },
    Type: {
      type: String,
      required: true,
    },
    isAccept:{
       type: Boolean,
       default: true
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      required: true,
    },
    id_Service: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    
    }],
    id_Categorie: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categorie",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const ServiceRequest = new mongoose.model(
  "ServiceRequest",
  ServiceRequestSchema
);

function validateServiceRequest(serviceRequest) {
  const schema = {
    Note: Joi.string().min(5).max(50).required(),
    Type: Joi.string().min(5).max(50).required(),
    Rating: Joi.number(),
    is_Accept: Joi.boolean(),
    id_Categorie: Joi.string()
  };

  return Joi.validate(serviceRequest, schema);
}

exports.ServiceRequest = ServiceRequest;
exports.validate = validateServiceRequest;
