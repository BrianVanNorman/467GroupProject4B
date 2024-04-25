const express = require('express');
const router = express.Router();
const { searchCustomersByName, createNewQuote } = require('./EnterQuoteFunctions');
const { searchAssociates } = require('./LoginFunctions');

// Define routes here

//                    //
// EnterQuote routes: //
//                    //

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

//               //
// Login routes: //
//               //

// Compare user input for username/password to all entries for sales associate account in DB
router.get('/associates/search', searchAssociates);

module.exports = router;