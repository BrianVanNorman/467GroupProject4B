const connectDB = require('../db');
const mongoose = require('mongoose');
const Quote = require('../models/Quote');

const getFinalizedQuotes = async (req, res) => {
  try {
    const finalizedQuotes = await Quote.find({ status: 'finalized' });
    res.json(finalizedQuotes);
  } catch (error) {
    console.error('Error fetching finalized quotes:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateFinalizedQuote = async (req, res) => {
    try {
      const quoteId = req.params.id;
      const updatedData = req.body;
  
      const quote = await Quote.findById(quoteId);
      if (!quote) {
        return res.status(404).json({ error: 'Quote not found' });
      }
  
      // Update the fields
      quote.line_items = updatedData.line_items;
      updatedData.total = calculateTotal(updatedQuoteData.line_items, updatedQuoteData.discount);
      updatedData.discount = updatedQuoteData.discount;
      quote.secret_notes = updatedData.secret_notes;
  
      await quote.save();
      res.json(quote);
    } catch (error) {
      console.error('Error updating finalized quote:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };

const sanctionQuote = async (req, res) => {
  try {
    const quoteId = req.params.id;
    const updatedQuote = req.body;

    const quote = await Quote.findByIdAndUpdate(quoteId, updatedQuote, { new: true });

    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    quote.status = 'ordered';
    await quote.save();

    res.json({ message: 'Quote converted to purchase order successfully' });
  } catch (error) {
    console.error('Error converting quote to purchase order:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
    getFinalizedQuotes,
    sanctionQuote,
    updateFinalizedQuote,
  };