const express = require("express")
const Dinner = require("../models/dinner-model")
const auth = require("../middleware/authentication")
const router = express();

router.post('/dinner/onetime', auth, async (req, res) => {
    const food = req.body.foodName.trim().toLowerCase();
    const quantity_g = Number(req.body.serving_size) / 100;

    if (await Dinner.countDocuments({ name: food, owner: req.user._id, saved: false }) > 0) {
        let comment = `${food} is already added in your breakfast , However you can update its quantity !`;
        res.status(400).send(comment);
        // throw new Error(`${food} is already added in your breakfast , However you can update its quantity !`);
    }
    else {
        await Dinner.fetchNutritionData(food)
            .then(async data => {
                const dinnerData = JSON.parse(data);
                const dinner = new Dinner({
                    name: dinnerData.items[0].name,
                    calories: dinnerData.items[0].calories * quantity_g,
                    serving_size_g: dinnerData.items[0].serving_size_g * quantity_g,
                    fat_total_g: dinnerData.items[0].fat_total_g * quantity_g,
                    fat_saturated_g: dinnerData.items[0].fat_saturated_g * quantity_g,
                    protein_g: dinnerData.items[0].protein_g * quantity_g,
                    sodium_mg: dinnerData.items[0].sodium_mg * quantity_g,
                    potassium_mg: dinnerData.items[0].potassium_mg * quantity_g,
                    cholesterol_mg: dinnerData.items[0].cholesterol_mg * quantity_g,
                    carbohydrates_total_g: dinnerData.items[0].carbohydrates_total_g * quantity_g,
                    fiber_g: dinnerData.items[0].fiber_g * quantity_g,
                    sugar_g: dinnerData.items[0].sugar_g * quantity_g,


                    owner: req.user._id,
                    saved: false
                });

                // Save the document to the database
                await dinner.save()
                    .then(() => {
                        res.send(dinner);
                    })
                    .catch(err => {
                        res.status(500).send('Error saving to database: ' + err);
                    });
            })
            .catch(err => {
                res.status(500).send(err);
            });

    }
});
router.post("/dinner/added", auth, async (req, res) => {
    await Dinner.deleteMany({ owner: req.user.id, saved: false })
    .then(()=>{
        res.status(200);
    })
    .catch(err => {
        res.status(500).send('Error Deleting From database: ' + err);
    });

    const { name, calories, serving_size_g, fat_total_g, fat_saturated_g, protein_g, sodium_mg, potassium_mg, cholesterol_mg, carbohydrates_total_g, fiber_g, sugar_g } = req.body;
    const dinner = new Dinner({
        name, calories, serving_size_g, fat_total_g, fat_saturated_g, protein_g, sodium_mg, potassium_mg, cholesterol_mg, carbohydrates_total_g, fiber_g, sugar_g,owner:req.user.id,saved:false
    });

    await dinner.save()
        .then(() => {
            res.send(dinner);
        })
        .catch(err => {
            res.status(500).send('Error saving to database: ' + err);
        });
});
router.post('/dinner/save', auth, async (req, res) => {
    const food = req.body.foodName.trim().toLowerCase();
    const quantity_g = Number(req.body.serving_size) / 100;

    if (await Dinner.countDocuments({ name: food, owner: req.user._id, saved: true }) > 0) {
        let comment = `${food} is already added in your breakfast , However you can update its quantity !`;
        res.status(400).send(comment);
        // throw new Error(`${food} is already added in your breakfast , However you can update its quantity !`);
    }
    else {
        await Dinner.fetchNutritionData(food)
            .then(async data => {
                const dinnnerData = JSON.parse(data);
                const dinner = new Dinner({
                    name: dinnnerData.items[0].name,
                    calories: dinnnerData.items[0].calories * quantity_g,
                    serving_size_g: dinnnerData.items[0].serving_size_g * quantity_g,
                    fat_total_g: dinnnerData.items[0].fat_total_g * quantity_g,
                    fat_saturated_g: dinnnerData.items[0].fat_saturated_g * quantity_g,
                    protein_g: dinnnerData.items[0].protein_g * quantity_g,
                    sodium_mg: dinnnerData.items[0].sodium_mg * quantity_g,
                    potassium_mg: dinnnerData.items[0].potassium_mg * quantity_g,
                    cholesterol_mg: dinnnerData.items[0].cholesterol_mg * quantity_g,
                    carbohydrates_total_g: dinnnerData.items[0].carbohydrates_total_g * quantity_g,
                    fiber_g: dinnnerData.items[0].fiber_g * quantity_g,
                    sugar_g: dinnnerData.items[0].sugar_g * quantity_g,

                    owner: req.user._id,
                    saved: true
                });

                // Save the document to the database
                await dinner.save()
                    .then(() => {
                        res.send(dinner);
                    })
                    .catch(err => {
                        res.status(500).send('Error saving to database: ' + err);
                    });
            })
            .catch(err => {
                res.status(500).send(err);
            });
    }
});


router.delete('/dinner/food/onetime/delete',auth,async (req,res)=>{
    
    const food = req.body.name.toLowerCase().trim();
    await Dinner.deleteOne({ owner:req.user.id,name: food, saved:false})
    .then(()=>{
        res.status(200).send();
    })
    .catch(err => {
        res.status(500).send('Error Deleting From database: ' + err);
    });
});

router.delete('/dinner/food/save/delete',auth,async (req,res)=>{
    const food = req.body.name.toLowerCase().trim();
    await Dinner.deleteOne({ owner:req.user.id,name: food, saved:true})
    .then(()=>{
        res.status(200).send();
    })
    .catch(err => {
        res.status(500).send('Error Deleting From database: ' + err);
    });
});


module.exports = router;