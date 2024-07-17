const express = require("express")
const Breakfast = require("../models/breakfast-model")
const auth = require("../middleware/authentication")
const router = express();

router.post('/breakfast/onetime', auth, async (req, res) => {
    const food = req.body.foodName.trim().toLowerCase();
    const quantity_g = Number(req.body.serving_size) / 100;

    if (await Breakfast.countDocuments({ name: food, owner: req.user._id, saved: false }) > 0) {
        let comment = `${food} is already added in your breakfast , However you can update its quantity !`;
        res.status(400).send(comment);
        // throw new Error(`${food} is already added in your breakfast , However you can update its quantity !`);
    }
    else {
        await Breakfast.fetchNutritionData(food)
            .then(async data => {
                const breakfastData = JSON.parse(data);
                const breakfast = new Breakfast({
                    name: breakfastData.items[0].name,
                    calories: breakfastData.items[0].calories * quantity_g,
                    serving_size_g: breakfastData.items[0].serving_size_g * quantity_g,
                    fat_total_g: breakfastData.items[0].fat_total_g * quantity_g,
                    fat_saturated_g: breakfastData.items[0].fat_saturated_g * quantity_g,
                    protein_g: breakfastData.items[0].protein_g * quantity_g,
                    sodium_mg: breakfastData.items[0].sodium_mg * quantity_g,
                    potassium_mg: breakfastData.items[0].potassium_mg * quantity_g,
                    cholesterol_mg: breakfastData.items[0].cholesterol_mg * quantity_g,
                    carbohydrates_total_g: breakfastData.items[0].carbohydrates_total_g * quantity_g,
                    fiber_g: breakfastData.items[0].fiber_g * quantity_g,
                    sugar_g: breakfastData.items[0].sugar_g * quantity_g,


                    owner: req.user._id,
                    saved:false
                });

                // Save the document to the database
                await breakfast.save()
                    .then(() => {
                        res.send(breakfast);
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
router.post("/breakfast/added", auth, async (req, res) => {
    await Breakfast.deleteMany({ owner: req.user.id, saved: false })
    .then(()=>{
        res.status(200);
    })
    .catch(err => {
        res.status(500).send('Error Deleting From database: ' + err);
    });


    const { name, calories, serving_size_g, fat_total_g, fat_saturated_g, protein_g, sodium_mg, potassium_mg, cholesterol_mg, carbohydrates_total_g, fiber_g, sugar_g } = req.body;
    const breakfast = new Breakfast({
        name, calories, serving_size_g, fat_total_g, fat_saturated_g, protein_g, sodium_mg, potassium_mg, cholesterol_mg, carbohydrates_total_g, fiber_g, sugar_g,owner:req.user.id,saved:false
    });

    await breakfast.save()
        .then(() => {
            res.send(breakfast);
        })
        .catch(err => {
            res.status(500).send('Error saving to database: ' + err);
        });
});
router.post('/breakfast/save', auth, async (req, res) => {
    const food = req.body.foodName.trim().toLowerCase();
    const quantity_g = Number(req.body.serving_size) / 100;

    if (await Breakfast.countDocuments({ name: food, owner: req.user._id, saved: true }) > 0) {
        let comment = `${food} is already added in your breakfast , However you can update its quantity !`;
        res.status(400).send(comment);
        // throw new Error(`${food} is already added in your breakfast , However you can update its quantity !`);
    }
    else {
        await Breakfast.fetchNutritionData(food)
            .then(async data => {
                const breakfastData = JSON.parse(data);
                const breakfast = new Breakfast({
                    name: breakfastData.items[0].name,
                    calories: breakfastData.items[0].calories * quantity_g,
                    serving_size_g: breakfastData.items[0].serving_size_g * quantity_g,
                    fat_total_g: breakfastData.items[0].fat_total_g * quantity_g,
                    fat_saturated_g: breakfastData.items[0].fat_saturated_g * quantity_g,
                    protein_g: breakfastData.items[0].protein_g * quantity_g,
                    sodium_mg: breakfastData.items[0].sodium_mg * quantity_g,
                    potassium_mg: breakfastData.items[0].potassium_mg * quantity_g,
                    cholesterol_mg: breakfastData.items[0].cholesterol_mg * quantity_g,
                    carbohydrates_total_g: breakfastData.items[0].carbohydrates_total_g * quantity_g,
                    fiber_g: breakfastData.items[0].fiber_g * quantity_g,
                    sugar_g: breakfastData.items[0].sugar_g * quantity_g,

                    owner: req.user._id,
                    saved: true
                });

                // Save the document to the database
                await breakfast.save()
                    .then(() => {
                        res.send(breakfast);
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


router.delete('/breakfast/food/onetime/delete',auth,async (req,res)=>{
    
    const food = req.body.name.toLowerCase().trim();
    await Breakfast.deleteOne({ owner:req.user.id,name: food, saved:false})
    .then(()=>{
        res.status(200).send();
    })
    .catch(err => {
        res.status(500).send('Error Deleting From database: ' + err);
    });
});

router.delete('/breakfast/food/save/delete',auth,async (req,res)=>{
    const food = req.body.name.toLowerCase().trim();
    await Breakfast.deleteOne({ owner:req.user.id,name: food, saved:true})
    .then(()=>{
        res.status(200).send();
    })
    .catch(err => {
        res.status(500).send('Error Deleting From database: ' + err);
    });
});

module.exports = router;