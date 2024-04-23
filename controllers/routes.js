const express = require('express');
const router = express.Router();
const customerController = require('./customerController');


// Define routes here

// Search through Legacy DB
router.get('/customers/search', customerController.searchCustomersByName);

// Posting Quote data to Quote Collection in Mongo DB
router.post('/quotes', async (req, res) => {
    const { customer_email, associate_id, items, status, secret_note } = req.body;
  
    try {
      // Assume you have a function to create a new quote in your controller
      const newQuote = await createNewQuote({ customer_email, associate_id, items, status, secret_note });
      res.status(201).json(newQuote);
    } catch (error) {
      console.error('Failed to create quote:', error);
      res.status(500).send('Failed to create quote');
    }
  });

module.exports = router;