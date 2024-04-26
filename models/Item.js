const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    quote_id: {
        type: Schema.Types.ObjectID,
        ref: 'Quote',
        required: true
    },
    text: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
});

const ItemModel = mongoose.model('Item', ItemSchema);

module.exports = ItemModel;