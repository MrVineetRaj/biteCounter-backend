const express = require("express")
const auth = require("../middleware/authentication")

const Breakfast = require("../models/breakfast-model")
const Lunch = require("../models/lunch-model")
const Dinner = require("../models/dinner-model")

const router = express();

router.use(express.json());

router.get("/user/diet", auth, async (req, res) => {
    try {
        const breakfast = await Breakfast.find({ owner: req.user._id,saved:false });
        const lunch = await Lunch.find({ owner: req.user._id,saved:false  });
        const dinner = await Dinner.find({ owner: req.user._id,saved:false  });

        const diet = {
            Breakfast: breakfast,
            Lunch: lunch,
            Dinner: dinner
        };
        res.send(diet)
    } catch (err) {
        res.status(404).send(err.message)
    }
})

router.get("/user/diet/save", auth, async (req, res) => {
    try {
        const breakfast = await Breakfast.find({ owner: req.user._id,saved:true });
        const lunch = await Lunch.find({ owner: req.user._id,saved:true });
        const dinner = await Dinner.find({ owner: req.user._id,saved:true });

        breakfast.forEach(food => {
            food.saved = false
        });

        lunch.forEach(food => {
            food.saved = false
        });

        dinner.forEach(food => {
            food.saved = false
        });
        const diet = {
            Breakfast: breakfast,
            Lunch: lunch,
            Dinner: dinner
        };

        res.send(diet)
    } catch (err) {
        res.status(404).send(err.message)
    }
})

module.exports = router;