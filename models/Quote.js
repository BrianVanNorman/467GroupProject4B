const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('./Counter');

const quoteSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    associate_id: {
        type: Schema.Types.ObjectId,
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
    line_items: [{
      name: String,
      description: String,
      price: Number,
      quantity: Number
    }],
    total: {
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
    },
    secret_notes: [String]
});


quoteSchema.pre('save', async function(next) {
    console.log("Pre-save hook triggered.");
    if (mongoose.connection.readyState !== 1) {
        console.error("Database not connected.");
        return next(new Error('Database not connected'));
    }

    if (this.isNew) {
        console.log("Attempting to set _id for new quote...");
        try {
            const counter = await Counter.findOneAndUpdate(
                { _id: 'quote' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            console.log("Counter updated: ", counter);
            if (!counter) {
                throw new Error('Counter operation failed, document not found.');
            }
            this._id = counter.seq;
            console.log("New _id set to: ", this._id);
            next();
        } catch (error) {
            console.error("Error in pre-save middleware:", error);
            next(error);
        }
    } else {
        next();
    }
});


const QuoteModel = mongoose.model('Quote', quoteSchema);
module.exports = QuoteModel;