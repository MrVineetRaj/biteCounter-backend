const mongoose = require('mongoose');
const request = require('request');
const my_api_key = process.env.API;
const dinnerSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    saved: Boolean,
    name: String,
    calories: Number,
    serving_size_g: Number,
    fat_total_g: Number,
    fat_saturated_g: Number,
    protein_g: Number,
    sodium_mg: Number,
    potassium_mg: Number,
    cholesterol_mg: Number,
    carbohydrates_total_g: Number,
    fiber_g: Number,
    sugar_g: Number
})

dinnerSchema.statics.fetchNutritionData = (query) => {
    return new Promise((resolve, reject) => {
        request.get({
            url: 'https://api.calorieninjas.com/v1/nutrition?query=' + query,
            headers: {
                'X-Api-Key': my_api_key
            },
        }, (error, response, body) => {
            if (error) {
                reject('Request failed: ' + error);
            } else if (response.statusCode != 200) {
                reject('Error: ' + response.statusCode + ', ' + body.toString('utf8'));
            } else {
                resolve(body);
            }
        });
    });
}


const Dinner = mongoose.model('dinner', dinnerSchema);

module.exports = Dinner;