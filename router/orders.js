const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Order, validateOrder} = require('../models/order');

const {Product,validate}= require('../models/product');

const auth = require("../middleware/auth");



router.post("/", async (req,res, next) => {

     const product = await  Product.findOne({_id : req.body.productId});

             if(!product){
                  return res.status(404).json({
                      message: "Product not found"
                  });
             }

            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId,
                addedBy: req.body.user,
                address: req.body.address
           });
     
             await  order.save()
              .then(result => {
            console.log("the result>>>", result);
            res.status(200).json({
                message: 'Order stored',
                createdOrder: {
                   _id: result._id,
                   product: result.product,
                   quantity: result.quantity,
                   address: req.body.address,
                   addedBy: req.body.user
                },
                request:{
                    type: 'POST',
                    url:'http://localhost:3000/orders/'+ result._id
                }
            });
       }).catch(err => {
           console.log("the error >>>", err);
           res.status(500).json({
               error: err
           })
       })

         
      
});

/*
router.get("/",(req,res,next) => {
    Order.find()
    .select(' product quantity _id address')
    .populate('product')
    .exec()
    .then(docs => {
         res.status(200).json({
              count: docs.length,
               orders: docs.map(doc => {
                  return {
                      _id: doc._id,
                      product: doc.product,
                      quantity: doc.quantity,
                      address: doc.address,
                      request:{
                           type: 'GET',
                           url:'http://localhost:3000/orders/'+ doc._id
                      }
                  }
              })
         });
    }).catch(err => {
        res.status(500).json({
             error: err
        })
    });
})
*/
/*

router.get("/:orderId",(req, res, next) => {
     Order.findById(req.params.orderId)
     .exec()
     .then(order => {
         if(!order){
             return res.status(404).json({
                 message: "Order not found"
             })
         }
         res.status(200).json({
             order: order,
             request : {
                 type: 'GEST',
                 url:'http://localhost:3000/orders/'+ order._id

             }
         })
     }).catch(err => {
         res.status(500).json({
              error: err
         });
     })
} );
*/

router.delete("/:orderId", (req, res,next) => {
    Order.remove({
        _id: req.params.orderId
    }).exec().then(
        result => {
            res.status(200).json({
                message: "Order deleted",
                request:{
                    type:"DELETE",
                    url:'http://localhost:3000/orders/'+ result._id,
                    body: {productId: "ID", quantity: "Number"}
                }
            })
        }
    ).catch(err => {
        res.status(500).json({
             error: err
        });
    })
})


router.get('/:userId', auth, async (req, res) => {
  let result = await Order.find( {addedBy: req.params.userId}).populate('addedBy');
  console.log("idproduct>>>", result);
  res.json({
    message: result,
  })
})


module.exports = router;