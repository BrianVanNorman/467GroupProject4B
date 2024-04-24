const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuoteSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  associate_id: {
    type: Schema.Types.ObjectID,
    ref: 'SalesAssociate',
    required: true
  },
  customer_id: {
    type: Number,
    required: true
  },
  customer_email: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    default: 0.00,
  },
  commission: {
    type: Number,
    default: 0.00,
  },
  status: {
    type: String,
    enum: ['draft', 'finalized', 'sanctioned', 'ordered'], 
    default: 'draft'
  }
});

const QuoteModel = mongoose.model('Quote', QuoteSchema);

module.exports = QuoteModel;