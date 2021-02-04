
const { User} = require("../models/user");
const {Service,validate} = require("../models/service")
const {Categorie} = require("../models/categorie")

const io = require('../socket');
const accountSid = process.env.TWILO_ACCOUNT_SID;
//console.log("account>>>",accountSid);
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


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
        Categorie.findOne({_id: req.body.id_Categorie}).then(catego => {
            console.log("categorie >>>",catego);
            let nameSpace = catego.id_Partners[0];
            console.log("id 0>>>",nameSpace);
            
            io.getIo().emit('my broadcast', {notification:"Request new service",
            categorie: catego ,service: service});
        })
      // io.getIo().emit('my broadcast', {notification:"Request new service",service: service});
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

module.exports.sendSMS = async (req,res)=>{
  
client.messages.create({
  body: 'lezem tetfarej fi lmatch 4odwa si non netachech 3lik',
  from:'+12014307518',
  to:'+21655530869'
}).then((message)=> {
   res.status(201).json({
     message:message
});
})
.catch(errors => {
  console.log(errors);
  res.status(500).json({
      error: errors
  })
  
});

}








/* add serviceRequest  
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
        console.log("categorie >>>", catego)
        console.log("servicereq >>>", serviceRequest)
         io.getIo().emit('new service Request',
          {
            notification: "Request new service",
            categorie: catego , 
            serviceRequest:serviceRequest
          })
      
      res.status(201).json({
          message:"Created serviceRequest successfully !" ,
          serviceRequest: serviceRequest,
          addedBy: {_id: addedBy._id, first_Name: addedBy.first_Name, isActive: addedBy.isActive, address: addedBy.address},
         
      });
    })
  })
      .catch(errors => {
        console.log(errors);
        res.status(500).json({
            error: errors
        })
        
    });
    
  
}

*/











/* add categories by admin
module.exports.affectCategorie = async (req,res) => {

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  

   await  Categorie.findOne({_id:req.body.id_Categorie}).then( categorie =>{
     if(!categorie){
      return res.status(404).send("categorie not found");
    }
  }).catch(error => {
        res.status(500).send(error)
  })
  
  
  try {
    await  Categorie.findOne({id_Partners : req.user._id}).then(categorie =>{
          if(categorie){
            res.write("categorie with the given id partner already exist !")
              res.end()
            return res.status(200).send("....");
            
          }
        }).catch(error =>{
          res.status(500).send(error);
        })
  }catch(ex){
    res.status(500).send(ex)
    console.log("exp",ex)

  }
  


      await  Categorie.findOne({_id : req.body.id_Categorie}).then( async categorie => {
     
         
        console.log("data from categorie >>>" , categorie)
        const _categorie= new Categorie( 
               {
               id_Partners: req.user._id,
               label: categorie.label,
               addedBy: categorie.addedBy
              
               });
            
               let id_Partner;
               await _categorie.save().then(resp => {
                  return Partner.findById(req.user._id);
               }).then( async partner => {
                    id_Partner = partner;
                    await partner.categories.push(_categorie);
                    return partner.save();
               }).then( response =>{
                 res.status(201).json({
                   message:"Created categorie successfully !" ,
                   Categorie: _categorie,
                   addedByPartner: {_id: id_Partner._id, first_Name: id_Partner.first_Name, isPartner: id_Partner.isPartner, isActive: id_Partner.isActive},
                  
               });
               }) .catch(errors => {
                 console.log(errors);
                 res.status(500).json({
                     error: errors
                 })
                 
             });
     
            }).catch(error => {
               res.status().send(error)
            })
        
     
  

}
*/