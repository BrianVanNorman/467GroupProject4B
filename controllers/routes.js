const express = require('express');

const router = express.Router();
const SalesAssociate = require('../models/SalesAssociate'); 
const Quote = require('../models/Quote');

const customerController = require('./customerController');


// Define routes here

// Route for fetching customer data from the legacy database and creating a new Quote
router.post('/legacy-customers/:id/create-quote', async (req, res) => {
  try {
    const customerId = req.params.id; // Get the customer ID from the URL parameter
    const customerData = await customerController.fetchCustomerData(customerId);

    // Create a new Quote instance with the fetched customer data
    const newQuote = new Quote({
      customer_name: customerData[0].customer_name,
      customer_email: customerData[0].customer_email,
      // You may need to set other fields here depending on your requirements
    });

    // Save the new Quote instance to the MongoDB database
    const savedQuote = await newQuote.save();

    res.json(savedQuote); // Send the saved Quote as a response
  } catch (error) {
    res.status(500).send('Failed to create quote: ' + error.message);
  }
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

