const express = require('express');

const router = express.Router();
const SalesAssociate = require('../models/SalesAssociate'); 
const Quote = require('../models/Quote');

const customerController = require('./customerController');


// Define routes here

router.get('/customers/search', (req, res) => {
  console.log(req.query); // Output the query parameters to the console
  res.send('Query parameters received: ' + JSON.stringify(req.query)); // Send back the query parameters as a response
});

router.post('/sales-associates', async (req, res) => {
    try {
        const { id, name, email } = req.body;
        let associate = new SalesAssociate({ id, name, email });
        await associate.save();
        res.status(201).send(associate);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

router.get('/sales-associates', async (req, res) => {
    try {
        const associates = await SalesAssociate.find();
        res.status(200).send(associates);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});


router.post('/quotes', async (req, res) => {
    try {
      const { customer, lineItems, secretNotes } = req.body;

      // Create a new quote document
      const newQuote = new Quote({
        customer, 
        salesAssociate: req.user._id, // Might not be neccaesary
        lineItems,
        secretNotes 
        // ... other fields if needed
      });
  
      // Save the quote to the database
      await newQuote.save();
  
      res.status(201).json({ message: 'Quote created successfully', quote: newQuote });
    } catch (error) {
      console.error('Error creating quote:', error);
      res.status(500).json({ message: 'Failed to create quote' });
    }
  });
  
  router.get('/quotes', async (req, res) => {
    try {
      const quotes = await Quote.find({ salesAssociate: req.user._id })
        .populate('customer') 
        .populate('salesAssociate');
  
      res.status(200).json(quotes);
    } catch (error) {
      console.error('Error retrieving quotes:', error);
      res.status(500).json({ message: 'Failed to retrieve quotes' });
    }
  });

module.exports = router;

