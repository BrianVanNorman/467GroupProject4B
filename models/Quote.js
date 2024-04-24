const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

const QuoteSchema = new Schema({
  quote_id: {
    type: Number,
    required: true,
    unique: true
  },
  date: {
    type: date,
    required: true
  },
  associate_id: {
    type: Number,
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

// Sets up auto-increment for quote_id
QuoteSchema.plugin(autoIncrement.plugin, {
  model: 'Quote',
  field: 'quote_id',
  startAt: 1,
  incrementBy: 1
});

const QuoteModel = mongoose.model('Quote', QuoteSchema);

module.exports = QuoteModel;