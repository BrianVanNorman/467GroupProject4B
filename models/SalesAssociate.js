const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SalesAssociateSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    commission: {
        type: Double,
        default: 0,
    },
    address: {
        type: String,
        required: true,
    },
});

const SalesAssociateModel = mongoose.model('SalesAssociate', SalesAssociateSchema);

module.exports = SalesAssociateModel;