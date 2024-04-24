const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

const SalesAssociateSchema = new Schema({
    associate_id: {
        type: Number,
        required: true,
        unique: true
    },
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

// Sets up auto-increment for associate_id
QuoteSchema.plugin(autoIncrement.plugin, {
    model: 'SalesAssociate',
    field: 'associate_id',
    startAt: 1,
    incrementBy: 1
});

const SalesAssociateModel = mongoose.model('SalesAssociate', SalesAssociateSchema);

module.exports = SalesAssociateModel;