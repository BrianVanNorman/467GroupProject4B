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

// Calculations for converting to purchase order:
/*QuoteSchema.methods.calculateFinalPrice = function() {
  let totalPrice = this.lineItems.reduce((sum, item) => sum + item.price, 0);
  this.finalPrice = totalPrice - (totalPrice * (this.discount / 100));
};

QuoteSchema.pre('save', function(next) {
  this.calculateFinalPrice();
  next();
});*/


const QuoteModel = mongoose.model('Quote', QuoteSchema);

module.exports = QuoteModel;