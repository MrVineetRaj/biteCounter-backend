require('dotenv').config();
const mongoose = require('mongoose');
const DATABASE = process.env.DATABASE

mongoose.connect(DATABASE)
.then(() => console.log('Database connected successfully'))
.catch(err => console.error('Database connection error:', err));


