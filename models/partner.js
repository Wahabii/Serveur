const Joi = require("joi");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const getkeyPass = require('./../startup/config').getKeyPass();

const PartnerSchema = new mongoose.Schema({
 Mat:{
   type: String,
   required: true
 },
  first_Name: {
    type: String,
    required: true,
  },
  last_Name: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
  },
  password:{
      type: String,
      required: true
  },
  password_Confirm:{
    type:String,
    required:true
    },
  address:{
      type: String,
      required: true
  },
  localisation:{
      type: String,
      required: true
  },
  localisation:{
    type: String,
    required: true
  },
  isPartner: {
    type: Boolean,
    default: true,
  },
  phone_Number:{
      type: Number,
      required:true
  },
  logo:{
    type: String,
    default:"https://d1csarkz8obe9u.cloudfront.net/posterpreviews/lion-fire-logo-design-template-free-89daa14626ac403bd3cf6282036663ff_screen.jpg?ts=1572094154"
  },
  requestServices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
    },
  ],
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
  ],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categorie",
    },
  ],
},
{timestamps: true}
);



PartnerSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, Mat: this.Mat, first_Name: this.first_Name , last_Name: this.last_Name },
    getkeyPass,
    { expiresIn: "7 days" }
  );
  return token;
};




const Partner = new mongoose.model("Partner", PartnerSchema);

function validatePartner(partner) {
  const schema = {
    Mat:Joi.string().min(5).max(100).required(),
    first_Name:Joi.string().min(5).max(50).required(),
    last_Name:Joi.string().min(5).max(50).required(),
    email:Joi.string().email().required(),
    address: Joi.string().min(5).max(100).required(),
    phone_Number: Joi.number().required(),
    localisation: Joi.string().required(),
    password:Joi.string().min(5).max(1024).required(),
    password_Confirm:Joi.string().min(5).max(1024).required(),
  };

  return Joi.validate(partner, schema);
}




exports.PartnerSchema = PartnerSchema;
exports.Partner = Partner;
exports.validate = validatePartner;
