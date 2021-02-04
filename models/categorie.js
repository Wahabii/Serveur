const Joi = require("joi");
const mongoose = require("mongoose");

const CategorieSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: false,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
     id_Partners: [
         {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
        }
    ],
    

  },
  { timestamps: true }
);

const Categorie = new mongoose.model("Categorie", CategorieSchema);

function validateCategorie(categorie) {
  const schema = {
    label: Joi.string().min(5).max(80),
    id_Partners: Joi.string(),
    id_Categorie: Joi.string()
   
  };

  return Joi.validate(categorie, schema);
}

exports.Categorie = Categorie;
exports.validate = validateCategorie;
