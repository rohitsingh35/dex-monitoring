const mongoose = require('mongoose');
const DemoSchema = mongoose.Schema({
    demoDescription: { type: String, required: true }
});
// inbox: { type: mongoose.Schema.Types.ObjectId, ref: 'Inbox', required: true },
module.exports = mongoose.model('Demo', DemoSchema);