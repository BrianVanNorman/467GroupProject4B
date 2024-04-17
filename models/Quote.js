const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const QuoteSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true
  },
  salesAssociate: {
    type: Schema.Types.ObjectId, 
    ref: 'SalesAssociate', 
    required: true
  },
  date: {
    type: Date,
    default: Date.now 
  },
  lineItems: [
    {
      description: { type: String, required: true },
      price: { type: Number, required: true }
    }
  ],
  secretNotes: {
    type: String
  },
  discount: {
    type: Number,
    default: 0
  },
  finalPrice: {
    type: Number
  },
  status: {
    type: String,
    enum: ['draft', 'finalized', 'sanctioned', 'ordered'], 
    default: 'draft'
  }
});


QuoteSchema.methods.calculateFinalPrice = function() {
  let totalPrice = this.lineItems.reduce((sum, item) => sum + item.price, 0);
  this.finalPrice = totalPrice - (totalPrice * (this.discount / 100));
};

QuoteSchema.pre('save', function(next) {
  this.calculateFinalPrice();
  next();
});

const Quote = mongoose.model('Quote', QuoteSchema);
module.exports = Quote;