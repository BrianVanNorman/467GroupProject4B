const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuoteSchema = new Schema({
  customer_email: {
    type: String,
    required: true,
  },
  associate_id: {
    type: Schema.Types.ObjectId,
    ref: 'SalesAssociate',
    required: true,
  },
  item: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
},
  status: {
    type: String,
    enum: ['draft', 'finalized', 'sanctioned', 'ordered'], 
    default: 'draft',
  },
  secret_note: {
    type: String,
    required: false,
  },
});

const QuoteModel = mongoose.model('Quote', QuoteSchema);

module.exports = QuoteModel;