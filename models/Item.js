const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    amount: {
        type: Number,
        required: true,
    },
});

const ItemModel = mongoose.model('Item', ItemSchema);

module.exports = ItemModel;