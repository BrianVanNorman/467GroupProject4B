const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SalesAssociateSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    commission: {
        type: Number,
        default: 0.00
    }
});

const SalesAssociateModel = mongoose.model('SalesAssociate', SalesAssociateSchema);

module.exports = SalesAssociateModel;