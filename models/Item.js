const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

const ItemSchema = new Schema({
    item_id: {
        type: Number,
        required: true,
        unique: true
    },
    quote_id: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: false,
    },
    amount: {
        type: Number,
        required: true,
    },
});

// Sets up auto-increment for item_id
QuoteSchema.plugin(autoIncrement.plugin, {
    model: 'Item',
    field: 'item_id',
    startAt: 1,
    incrementBy: 1
});

const ItemModel = mongoose.model('Item', ItemSchema);

module.exports = ItemModel;