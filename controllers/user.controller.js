
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const {ObjectID} = require('mongodb');




module.exports.getUsers = async (req, res, next) => {
  
    await User.find()
      .sort("_id")
      .then((users) => {
        res.send(users);
      })
      .catch((errors) => {
        res.status(404).send(errors);
        //res.status(404).send('the user with the given id is not fond');
      });
      
  }

module.exports.getUser = async (req, res) => {
  //const user= await User.findById(req.params.id);
  const user = await User.findById(req.user._id).select("-password -passwordConfirm")
  .then(user => {
     if(!user){
        return res.status(404).send("Id not found");
     }
     res.status(200).json([{
     message: "User informatins",
     result: user
    }])})
     .catch(err => {
      res.status(500).json({
           error: err
      })
  });

}



module.exports.getUserById = async (req, res) => {
  //const user= await User.findById(req.params.id);
   let id= req.params.id;
   if (!ObjectID.isValid(id)){
      return res.status(404).send("Id not valid");
   }

  await User.findById(id).select("-password -passwordConfirm")
  .then(user => {
     if(!user){
        return res.status(404).send(" user not found");
     }
     res.status(201).json([{
     message: "User informatins",
     result: user
    }])})
     .catch(err => {
      res.status(400).json({
           error: err
      })
  });

}


module.exports.addUser = async (req, res) => {
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
}


module.exports.deleteUser = async (req, res) => {
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
}


module.exports.updateUser = (req, res) => {
   const {error} = validate(req.body);
   if(error) return res.status(400).send(error.details[0].message);
  const id = req.params.id;
  User.findOne({
    _id: id,
  })
    .then(async (user) => {
      user.set("name", req.body.name);
      user.set("email", req.body.email);
      user.set("password", req.body.password);
      user.set("passwordConfirm", req.body.passwordConfirm);
      user.set("isAdmin", req.body.isAdmin);
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      user.passwordConfirm = await bcrypt.hash(user.passwordConfirm, salt);
      await user.save();
      res.send(user);
    })
    .catch((errors) => {
      res.status(404).send(errors);
    });
}

module.exports.getUserAdmin = (req,res) =>{
 
   User.find({
     "isAdmin":true
   }).then(resp =>{
      res.status(200).json([{
          message: "list of users admin",
          result: resp
      }]);
   }).catch(err =>{
      res.status(500).json([{
         error: err
      }])
   })
}


/* get number of collection users*/ 
module.exports.getCount = (req,res) => {
  User.find().countDocuments().then(count => {
    res.status(201).json([{
      message: "number of users ",
      result: count
  }]);
   }).catch(err => {
    res.status(500).send(err)
  
})

}