
const { User} = require("../models/user");
const {Service,validate} = require("../models/service")





/* update and increment note  service */
module.exports.updateUser = async (req, res) => {
    
  
      try{
         let _id = req.params.id
         let result = await Service.findByIdAndUpdate(
                {_id},{
                $set: {
                    serviceName: 'vente'
                },
                 $inc: { note: 1 } 
                },
                { new: true }
                )

            return res.status(200).json(result)
         }
     
     catch(ex ){
       return res.status(404).json(ex);
     };
 }




 

/* add service by partner */
module.exports.addService = async (req,res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const service= new Service( {...req.body, addedBy:req.user._id});
     
     let addedBy;
    await service.save().then(result =>{
       return User.findById(req.user._id);
    })
    .then( async user =>{
       addedBy = user;
      await user.services.push(service);
       return user.save();
      
    }).then(result => {
      
      res.status(201).json({
          message:"Created service successfully !" ,
          service: service,
          addedBy: {_id: addedBy._id, name: addedBy.name, isAdmin: addedBy.isAdmin},
         
      });
    })
      .catch(errors => {
        console.log(errors);
        res.status(500).json({
            error: errors
        })
        
    });
    
  
}


