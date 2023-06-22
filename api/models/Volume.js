const mongoose = require('mongoose');

const volumeSchema = mongoose.Schema({

    Volume : {type : Object}
    
})

module.exports = mongoose.model('Token_Volume', volumeSchema);
