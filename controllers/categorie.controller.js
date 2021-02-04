const _ = require("lodash");
const { Categorie, validate } = require("../models/categorie");
const { User } = require("../models/user");

/* add categories by admin */
module.exports.addCategorie = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const categorie = new Categorie({
    id_Partners: req.body.id_Partners,
    label: req.body.label,
    addedBy: req.user._id,
  });

  let addedBy;
  await categorie
    .save()
    .then((result) => {
      return User.findById(req.user._id);
    })
    .then(async (user) => {
      addedBy = user;
      await user.categories.push(categorie);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Created categorie successfully !",
        Categorie: categorie,
        addedBy: {
          _id: addedBy._id,
          first_Name: addedBy.first_Name,
          isAdmin: addedBy.isAdmin,
          isActive: addedBy.isActive,
        },
      });
    })
    .catch((errors) => {
      console.log(errors);
      res.status(500).json({
        error: errors,
      });
    });
};

/* affected categorie by partner */
module.exports.affectCategorie = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  await Categorie.findOne({ _id: req.body.id_Categorie }).then(
    async (categorie) => {
      if (!categorie) {
        return res.status(404).send("categorie not found");
      }

      if (categorie.id_Partners.includes(req.user._id)) {
        return res
          .status(404)
          .send("categorie with the given id partner already exist !");
      }

      let id_Partner;

      await categorie.id_Partners.push(req.user._id);
      return categorie
        .save()
        .then((resp) => {
          return User.findById(req.user._id);
        })
        .then(async (user) => {
          id_Partner = user;
          await user.categories.push(categorie);
          return user.save();
        })
        .then((response) => {
          
          res.status(201).json({
            message: "Created categorie successfully !",
            Categorie: categorie,
            addedByPartner: {
              _id: id_Partner._id,
            
            },
          });
        })
        .catch((errors) => {
          console.log(errors);
          res.status(500).json({
            error: errors,
          });
        });
    }
  );
};

/* get all the categories */
module.exports.getCategories = async (req, res) => {
  await Categorie.find()
    .sort("_id")
    .then((categorie) => {
      res.send(categorie);
    })
    .catch((errors) => {
      res.status(404).send(errors);
      //res.status(404).send('the user with the given id is not fond');
    });
};
