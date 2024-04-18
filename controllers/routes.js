const express = require('express');

const router = express.Router();
const SalesAssociate = require('../models/SalesAssociate'); 
const Quote = require('../models/Quote');

const customerController = require('./customerController');


// Define routes here
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

// Route for fetching customer data from the legacy database
router.get('/legacy-customers/:id', async (req, res) => {
  try {
    const customerId = req.params.id; // Get the customer ID from the URL parameter
    const customerData = await customerController.fetchCustomerData(customerId);
    res.json(customerData);
  } catch (error) {
    res.status(500).send('Failed to fetch customer data: ' + error.message);
  }
});

module.exports = router;

