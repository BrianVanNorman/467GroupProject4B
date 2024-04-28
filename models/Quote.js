const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const Counter = require('./Counter');

const quoteSchema = new Schema({
    numeric_id: {
        type: Number,
        required: true,
        index: true
    },
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

// Adding an index to the numeric_id field for optimized queries
quoteSchema.index({ numeric_id: 1 });

/*
quoteSchema.pre('save', async function(next) {
    // Check database connection first
    if (mongoose.connection.readyState !== 1) {
        console.error("Database not connected.");
        return next(new Error('Database not connected'));
    }

    // Handle new documents only
    if (this.isNew) {
        console.log("Attempting to set numeric_id for new quote...");
        try {
            const counter = await Counter.getNextSequence('quote');
            if (!counter) {
                return next(new Error('Counter operation failed, document not found.'));
            }
            this.numeric_id = counter.seq;
            console.log("Numeric ID set to: ", this.numeric_id);
            next();
        } catch (error) {
            console.error("Error in pre-save middleware:", error);
            next(error);
        }
    } else {
        next();
    }
});
*/

const QuoteModel = mongoose.model('Quote', quoteSchema);
module.exports = QuoteModel;