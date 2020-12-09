
const Joi =require('joi');
const mongoose=require('mongoose');


const MaterielSchema= new mongoose.Schema({

         rubrique:{
             type:String,
             required:true,
             minlength:5,
             maxlength:50
         },

         
         sous_rubrique:{
            type:String,
             required:true,
             minlength:5,
             maxlength:50
         },

         categorie:{
            type:String,
            required:true,
            minlength:5,
            maxlength:50
         },
          
         marque:{
            type:String,
             required:true,
             minlength:5,
             maxlength:50
          },
          
          reference_model:{
             type:String,
             required:true,
             minlength:5,
             maxlength:50
          },
          
          annee:{
            type:Number,
            required:true,
          },
          puissance:{
              type:String,
              required:true,
          },
          boite_vitesse:{
            type:String,
            required:true,
         },
         Roue_motrice:{
            type:String,
            required:true,
         },
        

                Annee_approximative :{
                       type:Boolean,
                       required:true
                      },
                      
                      n_serie:{
                        type: String ,
                        required:true
                       },
                       N_interne:{
                        type: String ,
                        required:true
                       },
                       Etat_general:{
                        type: String ,
                        required:true
                       },
                       nombre_heures:{
                        type: Number,
                        required:true
                       },
                       larger_travail:{
                        type: String,
                        required:true
                       },
                       puissanceagc:{
                        type:String,
                        required:true,
                       },
                       
                       option:{
                       type: String,
                       required:true
                        },
                        
                      equipement:{
                       type: String,
                       required:true
                       },
                       
                       Pneus_avant:{
                        type: String,
                        required:true
                        },
                     
                       usure_pneus_avant:{
                         type: String,
                         required:true
                           
                        },
                       usure_pneus_arriere:{
                          type: String,
                          required:true
                        },
                        boite_vitesseagc:{
                           type: String,
                           required:true
                         },
                         
                         Pre_equipement_chargeur:{
                              type: String,
                              required:true
                            },

                            Roue_motriceagc :{
                              type:String,
                              required:true,
                             },
                              concessionnaire:{
                              type:mongoose.Schema.Types.ObjectId,
                              ref:'User'
                             }

         
      });

const Materiel=new mongoose.model('Materiel',MaterielSchema);

 function validateMateriel(materiel){
 const schema={

   rubrique:Joi.string().min(5).max(50).required(),
  
   
   sous_rubrique:Joi.string().min(5).max(50).required(),
    
   categorie:Joi.string().min(5).max(50).required(),
   
   marque:Joi.string().min(5).max(50).required(),
    
   reference_model:Joi.string().min(5).max(50).required(),
   
   annee:Joi.number().required(),
    puissance:Joi.string().required(),
    boite_vitesse:Joi.string().required(),
    Roue_motrice:Joi.string().required(),
    Annee_approximative:Joi.boolean().required(),
    n_serie:Joi.string().required(),
    N_interne:Joi.string().required(),
    Etat_general:Joi.string().required(),
    nombre_heures:Joi.number().required(),
    larger_travail:Joi.string().required(),
    puissanceagc:Joi.string().required(),
    option:Joi.string().required(),
    equipement:Joi.string().required(),
    Pneus_avant:Joi.string().required(),
    usure_pneus_avant:Joi.string().required(),
    usure_pneus_arriere:Joi.string().required(),
    boite_vitesseagc:Joi.string().required(),
    Pre_equipement_chargeur:Joi.string().required(),
    Roue_motriceagc:Joi.string().required(),
    concessionnaire:Joi.string()
};

return Joi.validate(materiel,schema);


 }


exports.Materiel=Materiel;
exports.validate=validateMateriel;












