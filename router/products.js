
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
router.post("/", upload.array('productImage',5) , auth , async (req, res , next) => {
  //req.file = {}
  console.log("file is empty >>>", req.files);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  if(!req.files) {
    const error = new Error('No image provided.');
    error.statusCode = 422 ;
    throw error;
  }


  const product = new Product( {...req.body, addedBy:req.user._id});
   
  if(req.files === undefined){
      req.files= ""
      product.set("Url", req.files);
  }
 
  else{
   
    

           const counter = req.files.length;

          
             console.log('array des images >>>:',  req.files.length);

            if(counter === 5){
               const urls = [ 'http://localhost:3000/' + req.files[0].path,
                              'http://localhost:3000/' + req.files[1].path,
                              'http://localhost:3000/' + req.files[2].path,
                              'http://localhost:3000/' + req.files[3].path,
                              'http://localhost:3000/' + req.files[4].path
                              
                           ]
               
                    await product.set('Url',urls);
                   
            }
            else if(counter === 4){
              const urls = [ 'http://localhost:3000/' + req.files[0].path,
                             'http://localhost:3000/' + req.files[1].path,
                             'http://localhost:3000/' + req.files[2].path,
                             'http://localhost:3000/' + req.files[3].path
           
                          ]
          
                   await product.set('Url',urls);


            }
            else if(counter === 3){
              const urls = [ 'http://localhost:3000/' + req.files[0].path,
                             'http://localhost:3000/' + req.files[1].path,
                             'http://localhost:3000/' + req.files[2].path
                            

                  ]

                  await product.set('Url',urls);
            }
            else if(counter === 2){
              const urls = [ 'http://localhost:3000/' + req.files[0].path,
                             'http://localhost:3000/' + req.files[1].path
                             
                           ]

                  await product.set('Url',urls);
            }
            else {
              const urls = [ 'http://localhost:3000/' + req.files[0].path
                             
                           ]
                await product.set('Url',urls);
            }
              
           }
               
               
         
   
  // product.set("owner", req.user._id);
   // get all the informations about owner 
  // await product.populate('owner').execPopulate();
   //console.log("owner information >>>", product)
   let addedBy;
  await product.save().then(result =>{
     return User.findById(req.user._id);
  })
  .then( async user =>{
     addedBy = user;
    await user.products.push(product);
     return user.save();
    
  }).then(result => {
    console.log("result >>>",result);
    res.status(201).json({
        message:"Created product successfully !" ,
        product: product,
        creator: {_id: addedBy._id, name: addedBy.name},
        createdProduct:{
            id: product.id,
            price: product.price,
            name: product.name,
            Url:  product.Url,
            addedBy: product.addedBy 
        }
    });
  })
    .catch(errors => {
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
  
    
    Product.findOne({
      _id:req.params.id, addedBy:req.user._id
    }).then( async product => {

    //const user = await User.findById(req.user._id).select("-password");
    //const _User = user.id ;
   
    if(req.file === undefined){
        req.file= ""
        product.set("Url", req.file);
    }else{
        product.set("Url", 'http://localhost:3000/'+ req.file.path);
    }
    product.set("price", req.body.price);
    product.set("name", req.body.name);
    product.set("User", req.user._id);
    
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


/*

router.get("/:id", auth, async (req, res) => {
   try{
      
    const product = await Product.findOne({_id:req.params.id, owner:req.user._id});
    // if we want get all informations about the owner
     //await product.populate('owner').execPopulate();
     //console.log("owner information >>>", product)

    if (!product)
      return res.status(404).send("product with the given id is not fond");
    res.status(200).send(product);
   }catch(e){
     res.status(400).send();
   }
   
  });
*/


/* get all the products */
router.get("/", async (req, res) => {
   try{
    const product = await Product.find();
    if(!product)
    return res.status(404).send();
      res.status(200).send(product);
   }catch(e){
      res.status(400).send(e.message)
   }
   
  });
  



/* delete products */
router.delete("/:id", auth, async (req, res) => {
    
    const product = await Product.findOne({_id:req.params.id, addedBy:req.user._id})
      .then((product) => {
          if(!product){
             const error = new Error('Could not find product.');
             error.statusCode = 404;
             throw error;
          }
          if(product.addedBy.toString() !== req.user._id){
             const error = new Error('Not authorized!');
             error.statusCode = 403;
             throw error;

          }
          return Product.findByIdAndRemove(req.params.id);})
           .then(result => {
            return  User.findById(req.user._id);
        })
        .then(user => {
            user.products.pull(req.params.id);
             return user.save();
        })
        .then(result => {
          res.status(200).json({
            message: "product have been deleted successfuly",
          });
        })
      .catch((errors) => {
        res.status(500).send(errors);
      });
  });




  router.get('/:userId', auth, async (req, res) => {
    let result = await Product.find( {addedBy: req.params.userId}).populate('addedBy');
    res.json({
      message: "Producted by added ",
      result: result,
      request:{
          type:"GET",
          url:'http://localhost:3000/product/',
      }
    })
  })








module.exports = router;
