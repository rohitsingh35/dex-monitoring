const { BigNumber } = require('ethers');
const mongoose = require('mongoose');
const bigDecimal = require("mongoose-big-decimal")(mongoose);

const TokenMarketStatsSchema = mongoose.Schema({
    token:{ type: mongoose.Schema.Types.ObjectId, ref: "TokenSpecs"  },
    totalSupply: {
        type: bigDecimal},
    // circulatingSupply: { type: String,  },
    price: { type: String },
    volume: { type: Array  },
    timestamp:{ type:Number }
});
module.exports = mongoose.model('TokenMarketStats', TokenMarketStatsSchema);

