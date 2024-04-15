const mongoose = require('mongoose');

const SalesAssociateSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true // Ensures that no two documents can have the same id
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

const SalesAssociate = mongoose.model('SalesAssociate', SalesAssociateSchema, 'SalesAssociateManagement');

module.exports = SalesAssociate;