
const Joi =require('joi');
const mongoose=require('mongoose');


const PoductSchema= new mongoose.Schema({
        
      
         
         Url:{
             type:[String]
        
         },
        
         price:{
            type:Number,
             required:true,
           
         },
         name:{
            type:String,
            required:true,
            minlength:5,
            maxlength:50
         },
         addedBy: 
         {
           type: mongoose.Schema.Types.ObjectId,
           ref:'User',
           required: true
         },
         
       

         
      });

const Product=new mongoose.model('Product', PoductSchema);

 function validateProduct(product){
 const schema={

  // id:Joi.string().required(),
  
   price:Joi.number().required(),
    
   name:Joi.string().min(5).max(50).required(),
   
   
};

return Joi.validate(product,schema);


 }


exports.Product=Product;
exports.validate=validateProduct;












