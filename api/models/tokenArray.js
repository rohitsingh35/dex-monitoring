const mongoose = require('mongoose');

const tokennsArraySchema = mongoose.Schema({
    demos: { type: Object}
});

module.exports = mongoose.model('TokennsArray', tokennsArraySchema);
