const { Materiel, validate } = require("../models/materiel");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

/* get all the  materiels */
router.get("/", auth, async (req, res) => {
  const materiel = await Materiel.find().sort("_id");
  res.send(materiel);
});

/* add materiel  */
router.post("/posts", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let materiel = new Materiel(
    _.pick(req.body, [
      "rubrique",
      "sous_rubrique",
      "categorie",
      "marque",
      "reference_model",
      "annee",
      "puissance",
      "boite_vitesse",
      "Roue_motrice",
      "Annee_approximative",
      "n_serie",
      "N_interne",
      "Etat_general",
      "nombre_heures",
      "larger_travail",
      "puissanceagc",
      "option",
      "equipement",
      "Pneus_avant",
      "usure_pneus_avant",
      "usure_pneus_arriere",
      "boite_vitesseagc",
      "Pre_equipement_chargeur",
      "Roue_motriceagc",
      "concessionnaire",
    ])
  );
  await materiel.save();
  res.send(materiel);
});

/* get materiel by id*/
router.get("/:id", auth, async (req, res) => {
  const materiel = await Materiel.findById(req.params.id);
  if (!materiel)
    return res.status(404).send("materiel with the given id is not fond");
  res.send(materiel);
});

/* delete materiel */
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  Materiel.findOne({
    _id: id,
  })
    .then((materiel) => {
      materiel.delete();
      res.send({
        message: "course have been deleted successfuly",
      });
    })
    .catch((errors) => {
      res.status(404).send("materiel with the given id is not fond");
    });
});

/* update materiel */
router.put("/:id", (req, res) => {
  // const {error} = validate(req.body);
  // if(error) return res.status(400).send(error.details[0].message);
  const id = req.params.id;
  Materiel.findOne({
    _id: id,
  })
    .then((materiel) => {
      materiel.set("rubrique", req.body.rubrique);
      materiel.set("sous_rubrique", req.body.sous_rubrique);
      materiel.set("categorie", req.body.categorie);
      materiel.save();
      res.send(materiel);
    })
    .catch((errors) => {
      res.status(404).send("materiel with the given id is not fond");
    });
});

module.exports = router;
