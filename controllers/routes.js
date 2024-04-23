const express = require('express');
const router = express.Router();
const { searchCustomersByName, createNewQuote } = require('./EnterQuoteFunctions');

// Define routes here

// Search through Legacy DB
router.get('/customers/search', searchCustomersByName);

// Posting Quote data to Quote Collection in Mongo DB
router.post('/quotes', async (req, res) => {
    const { customer_email, associate_id, line_items, status, secret_note } = req.body;
  
    try {
      // Create a new quote using the createNewQuote function
      const newQuote = await createNewQuote({ customer_email, associate_id, line_items, status, secret_note });
      res.status(201).json(newQuote);
    } catch (error) {
      console.error('Failed to create quote:', error);
      res.status(500).send('Failed to create quote');
    }
});

module.exports = router;