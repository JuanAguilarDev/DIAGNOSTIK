const mongoose = require('mongoose');

// Users database
mongoose.connect('mongodb+srv://CRUD:HolaMundo1290@cluster0.kehmc.mongodb.net/test')
    .then(db => console.log('Database is connected. '))
    .catch(err => console.log(err));