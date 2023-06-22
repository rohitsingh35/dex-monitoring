const mongoose = require('mongoose');
const TokenSpecsSchema = mongoose.Schema({
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    decimals: { type: Number, required: true},
    address: { type: String, required: true },
    logoURI: { type: String },
    platform: { type: String }
});
module.exports = mongoose.model('TokenSpecs', TokenSpecsSchema);