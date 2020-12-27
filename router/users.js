const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const Joi = require("joi");
const mongoose = require("mongoose");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();
const {Order, validateOrder} = require('../models/order');



/* get the user by the id inside the token  */
router.get("/me", auth, async (req, res) => {
  //const user= await User.findById(req.params.id);
  const user = await User.findById(req.user._id).select("-password");
  

 await  Order.find()
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
                    user: user,
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

});

/* add user  */
router.post("/register",  async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);
  let user = await User.findOne({
    email: req.body.email,
  });
  if (user) return res.status(400).send("user aleardy registred . ");
  user = new User(_.pick(req.body, ["name", "email", "password", "isAdmin","address","passwordConfirm"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.passwordConfirm = await bcrypt.hash(user.passwordConfirm, salt);
  await user.save();
  const token = user.generateAuthToken();
  res.header("access_token", token).send(_.pick(user, ["id", "name", "email","address","isAdmin"]));
});

/* delete user by id */

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  User.findOne({
    _id: id,
  })
    .then(async (user) => {
      await user.delete();
      res.send({
        message: " user have been deleted successfuly ",
      });
    })
    .catch((errors) => {
      res.status(404).send(errors);
      //res.status(404).send('the user with the given id is not fond');
    });
});

/* update user by id*/
router.put("/:id", (req, res) => {
  // const {error} = validate(req.body);
  // if(error) return res.status(400).send(error.details[0].message);
  const id = req.params.id;
  User.findOne({
    _id: id,
  })
    .then(async (user) => {
      user.set("name", req.body.name);
      user.set("email", req.body.email);
      user.set("password", req.body.password);
      user.set("isAdmin", req.body.isAdmin);
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      res.send(user);
    })
    .catch((errors) => {
      res.status(404).send(errors);
    });
});

/* get all the users */
router.get("/", auth, async (req, res) => {
  /*
  try{
      const user = await User.findById(req.user._id);
      await user.populate('product').execPopulate();
      console.log("user reference >>>:", user)
      res.status(200).send(user);
  }catch(e){
    res.status(400).send(e);
  }
 */

  
  await User.find()
    .sort("_id")
    .then((users) => {
      res.send(users);
    })
    .catch((errors) => {
      res.status(404).send(errors);
      //res.status(404).send('the user with the given id is not fond');
    });
    
});

module.exports = router;


