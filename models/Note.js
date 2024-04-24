const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    quote_id: {
        type: Schema.Types.ObjectID,
        ref: 'Quote',
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

const ItemModel = mongoose.model('Note', NoteSchema);

module.exports = ItemModel;