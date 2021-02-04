
const { ServiceRequest, validate } = require("../models/serviceRequest");
const { Partner } = require("../models/partner");
const {User} = require("../models/user");
const {Categorie} = require("../models/categorie");
const io = require('../socket');


/* add serviceRequest  */
module.exports.addServiceRequest = async (req,res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const serviceRequest= new ServiceRequest( {...req.body, addedBy:req.user._id});
     
     let addedBy;
    await serviceRequest.save().then(result =>{
       return User.findById(req.user._id);
    })
    .then( async user =>{
       addedBy = user;
      await user.serviceRequests.push(serviceRequest);
       return user.save();
      
    }).then(result => {
      Categorie.findOne({_id: req.body.id_Categorie}).then( catego => {
         io.getIo().emit('new service Request',
          {
            notification: "Request new service",
            categorie: catego , 
            serviceRequest:serviceRequest
          })
      })
      res.status(201).json({
          message:"Created serviceRequest successfully !" ,
          serviceRequest: serviceRequest,
          addedBy: {_id: addedBy._id, first_Name: addedBy.first_Name, isActive: addedBy.isActive, address: addedBy.address},
         
      });
    })
      .catch(errors => {
        console.log(errors);
        res.status(500).json({
            error: errors
        })
        
    });
    
  
}


/* get the somme of all services rating */
module.exports.addRating = async (req,res) => {

 
  schedule.scheduleJob('m-job', '*/5 * * * * *', async ()=> {
      await Service.find({id_Partner: req.params.id}).populate("id_Partner")
      .then(async (services) => {
         console.log("services" , services)
         totalRate = services.reduce( (acc, cur) =>  acc + cur.rate, 0);
         const count = await services.length;
         console.log("count>>>",count)
         return total = totalRate / count ;
      
    
      }).then( async total => {
       console.log("res>>>",total)
       const id = req.params.id;
     
      const partner = await  Partner.findByIdAndUpdate(
        { _id: id },{ rate : total},{ new: true }
      );
      await partner.save()
      .then(resp =>{
          console.log("resp", resp)
          res.status(201).json({
         message: "Created rating successfully !",
          data: resp,
          
        });
       })
       .catch((errors) => {
        res.status(404).send(errors);
        
      });
      })
      .catch((errors) => {
        res.status(404).send(errors);
        
      });
      schedule.cancelJob('m-job');
   
    })
 
}