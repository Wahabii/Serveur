
const multer = require('multer');
//const fileType = require('file-type')
//const fs = require('fs')


const { User } = require("../models/user");

const { Product, validate } = require("../models/product");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const _ = require("lodash");
const express = require("express");
const router = express.Router();


const storage = multer.diskStorage({
     destination: function(req, file, cb){
         cb(null, './uploads/');
     },
     filename: function(req, file, cb){
         cb(null,  file.originalname);
     }
});

/* filter by the type of the format to image */
const _fileFilter = (req , file, cb) => {
    // reject a file 
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true);
    }else{
        cb(null, false)
    }
};

const upload = multer({
    storage: storage,
    limits:{ fileSize: 1024 * 1024 * 5 },
    fileFilter: _fileFilter
 });




/* add product */
router.post("/", upload.single('productImage') , auth , async (req, res , next) => {
  //req.file = {}
  console.log("file is empty >>>", req.file);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id).select("-password");
  const _User = user.id ;

  let product = new Product( _.pick(req.body, ["name","price"]));
  if(req.file === undefined){
      req.file= ""
      product.set("Url", req.file);
  }else{
      product.set("Url", 'http://localhost:3000/' + req.file.path);
  }
   
   product.set("User", _User)
  await product.save().then(result =>{
      console.log(result);
      res.status(201).json({
          message:"Created product successfully !" ,
          createdProduct:{
              id: result.id,
              price: result.price,
              name: result.name,
              Url:  result.Url,
              User: result.User
          }
      })
  }).catch(errors => {
      console.log(errors);
      res.status(500).json({
          error: errors
      })
      
  });
  
});




/* update product */
router.put("/update/:id", upload.single('productImage') , auth , async (req, res , next) => {
    //req.file = {}
    console.log("file is empty >>>", req.file);
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    const id = req.params.id;
    Product.findOne({
      _id: id,
    }).then( async product => {

    const user = await User.findById(req.user._id).select("-password");
    const _User = user.id ;
   
    if(req.file === undefined){
        req.file= ""
        product.set("Url", req.file);
    }else{
        product.set("Url", 'http://localhost:3000/'+ req.file.path);
    }
    product.set("price", req.body.price);
    product.set("name", req.body.name);
    product.set("User", _User)
    
    await product.save().then(result =>{
        console.log(result);
        res.status(201).json({
            message:"Update product successfully !" ,
            updateProduct:{
                id: result.id,
                price: result.price,
                name: result.name,
                Url:  result.Url,
                User: result.User
            }
        })

    }).catch(errors => {
        console.log(errors);
        res.status(500).json({error: errors })
    });
        
    }).catch(errors => {

        console.log(errors);
        res.status(500).json({error: errors })
    });
    
  });



/* get product by id*/
router.get("/:id", auth, async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).send("product with the given id is not fond");
    res.send(product);
  });



/* get all the products */
router.get("/",  async (req, res) => {
    const product = await Product.find().sort("_id");
    res.send(product);
  });
  



/* delete products */
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    Product.findOne({
      _id: id,
    })
      .then((product) => {
        product.delete();
        res.send({
          message: "product have been deleted successfuly",
        });
      })
      .catch((errors) => {
        res.status(404).send(errors);
      });
  });












module.exports = router;
