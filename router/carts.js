const express = require('express');
const router = express.Router();
const mongoose=require('mongoose');

const {Cart, validate}=require('../models/cart');
const auth = require('../middleware/auth');


router.post("/", auth, async (req,res,next) =>{

    const { error } = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

     const cart = new Cart({
         price: req.body.price,
         amount: req.body.amount,
         name:req.body.name,
         addedBy:req.user._id
     });

     await cart.save().then((result)=>{
         res.status(200).json([{
             message:"cart added successfully!",
             result: result,
             request:{
                type: 'POST',
                url:'http://localhost:3000/carts/'
             }
         }])
     }).catch(err=>{
         res.status(500).json({
             error: err
         })
     }
          
     )
});



router.get('/:userId', auth, async (req, res) => {
    let result = await Cart.find( {addedBy: req.params.userId}).populate('addedBy');
    res.json([{
      message: "Cart by added ",
      result: result,
      request:{
          type:"GET",
          url:'http://localhost:3000/carts/',
      }
    }])
  });


  
/* delete products */
router.delete("/:id", auth, async (req, res, next) => {
    
    const cart = await Cart.findOne({_id:req.params.id, addedBy:req.user._id})
      .then((cart) => {
        cart.delete();
        res.send({
          message: "product have been deleted successfuly",
        });
      })
      .catch((errors) => {
        res.status(404).send(errors);
      });
  });

router.put("/:id", auth, async (req,res, next) =>{
   
     await Cart.findOne({_id:req.params.id, addedBy:req.user._id})
     .then((cart)=>{
         cart.set("amount",req.body.amount);
         cart.save().then(result=>{
             res.status(200).json({
                 message: "cart updated successfully !",
                 data: result
             })
            })
        .catch(err => {
        res.status(400).json({
            message: " bad request!",
            error: err
        })
     })
    
}).catch(err=>{
  res.status(500).json({
    message: " cart with the given id not found !",
    error: err
})
})
});







module.exports=router;