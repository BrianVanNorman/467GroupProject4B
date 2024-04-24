const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

const NoteSchema = new Schema({
    note_id: {
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
    private: {
        type: Boolean,
        default: false,
        required: true,
    },
});

// Sets up auto-increment for item_id
QuoteSchema.plugin(autoIncrement.plugin, {
    model: 'Note',
    field: 'note_id',
    startAt: 1,
    incrementBy: 1
});

const ItemModel = mongoose.model('Note', NoteSchema);

module.exports = ItemModel;