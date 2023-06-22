const mongoose = require('mongoose');

const priceSchema = mongoose.Schema({

    Price : {type : Object}
    
})

module.exports = mongoose.model('Token_Price', priceSchema);
