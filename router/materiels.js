const {Materiel,validate}=require('../models/materiel');
const mongoose=require('mongoose');
const _=require('lodash');
const express=require('express');
const router=express.Router();



router.get('/', async (req,res)=>{
    const materiel= await Materiel.find().sort('_id');
    res.send(materiel);
    });


router.post('/',  async (req,res)=>{
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
     let materiel=new Materiel(
         _.pick(req.body,['rubrique','sous_rubrique',
        'categorie','marque','reference_model','annee','puissance',
        'boite_vitesse','Roue_motrice','Annee_approximative','n_serie',
        'N_interne','Etat_general','nombre_heures','larger_travail',
        'puissanceagc','option','equipement','Pneus_avant','usure_pneus_avant',
        'usure_pneus_arriere','boite_vitesseagc','Pre_equipement_chargeur', 
        'Roue_motriceagc','concessionnaire']));
        await materiel.save();
        res.send(materiel);    
    });

    router.get('/:id',async (req,res)=>{
        const materiel= await Materiel.findById(req.params.id);
        if(!materiel) return res.status(404).send('materiel with the given id is not fond'); 
        res.send(materiel);
        });
        

 







    module.exports = router;