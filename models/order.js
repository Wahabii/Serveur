
const Joi =require('joi');
const mongoose=require('mongoose');


const orderSchema= new mongoose.Schema({
        
         _id: mongoose.Schema.Types.ObjectId,
         
        quantity:
            {  // we can make  default:1 raither than required  to say it's ok if you don't make a quantity by default we make 1
                type:Number,
                default: 1
            },
        address: 
            {
                type:String,
                required:true

            },
         
        product: 
            {
              type: mongoose.Schema.Types.ObjectId,
              required: true,
              ref:'Product'
            }
         ,
         addedBy: 
         {
           type: mongoose.Schema.Types.ObjectId,
           ref:'User'
         },

         
      });

const Order=new mongoose.model('Order', orderSchema);

 function validateOrder(order){
 const schema={

  // id:Joi.string().required(),
  
   quantity:Joi.number().required(),
   //address:Joi.string().min(5).max(50)
    
   //name:Joi.string().min(5).max(50).required(),
   
   
};

return Joi.validate(order,schema);


 }


exports.Order=Order;
exports.validateOrder=validateOrder;












