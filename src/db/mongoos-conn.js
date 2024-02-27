const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/bite-counter-api')
.then(() => console.log('Database connected successfully'))
.catch(err => console.error('Database connection error:', err));


