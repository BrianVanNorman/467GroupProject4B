const axios = require('axios');
const connectDB = require('../db');
const mongoose = require('mongoose');
const QuoteModel = require('../models/Quote');


// This function fetches sanctioned quotes from the MongoDB
const fetchSanctionedQuotes = async (req, res) => {
    try {
      const sanctionedQuotes = await QuoteModel.find({ status: 'sanctioned' });
      res.json(sanctionedQuotes);
    } catch (error) {
      console.error('Error fetching sanctioned quotes:', error);
      res.status(500).send('Error fetching sanctioned quotes');
    }
  };

  // Saving the sanctioned quotes new discounted total
  const updateSanctionedQuote = async (req, res) => {
    const { total } = req.body;  // Destructure the new total from the request body
    try {
        const quote = await QuoteModel.findById(req.params.id);  // Find the quote by ID
        if (!quote) {
            return res.status(404).json({ error: 'Quote not found' });
        }

        quote.total = total;  // Update the total
        await quote.save();  // Save the updated quote

        res.json({
            message: 'Quote updated successfully',
            quote: quote
        });
    } catch (error) {
        console.error('Error updating sanctioned quote:', error);
        res.status(500).send('Error updating sanctioned quote');
    }
};

  // Assuming this function is triggered after clicking the 'Process Order' button
const processOrder = async (req, res) => {
    try {
      // Fetch the quote using the id provided in the request
      const quote = await QuoteModel.findById(req.params.id).populate('associate_id');
  
      // Ensure quote and associated sales associate exist
      if (!quote || !quote.associate_id) {
        return res.status(404).json({ error: 'Quote or Associate not found' });
      }
  
      // Prepare the data to be sent to the external service
      const postData = {
        order: quote._id.toString(), // Convert ObjectId to string
        associate: quote.associate_id._id.toString(), // Convert ObjectId to string
        custid: quote.customer_id.toString(),
        amount: quote.total.toFixed(2), // Ensure the amount is formatted to two decimal places
      };
  
      // Set up the HTTP POST request options
      const url = 'http://blitz.cs.niu.edu/PurchaseOrder/';
      const options = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      };
  
      // Send the POST request to the external service
      const response = await axios.post(url, postData, options);

      // Check if the external service sent an error
if (response.data && response.data.errors) {
    return res.status(400).json({ errors: response.data.errors });
  }
  
  // Extract the required response data
  const processingDate = response.data.processDay;
  const commissionPercentage = parseFloat(response.data.commission.replace('%', '')) / 100;
  
  // Calculate the commission based on the total amount of the quote and the commission percentage
  const commissionAmount = quote.total * commissionPercentage;
  
  // Update the quote with the processing date and the calculated commission
  await QuoteModel.findByIdAndUpdate(req.params.id, {
    processingDate: new Date(processingDate),
    commission: commissionAmount,
    status: 'ordered' // Update the status to indicate the quote has now been processed
  }, { new: true });

  quote.associate_id.commission += commissionAmount;  // Update the commission
        await quote.associate_id.save();  // Save the updated sales associate document
  
  // Respond with success message and updated quote details
  res.json({
    message: 'Order processed successfully!',
    processingDate: processingDate,
    commissionRate: commissionPercentage,
    commissionAmount: commissionAmount,
    quote: {
      ...quote.toObject(),
      processingDate,
      commission: commissionAmount
    }//,
    //associateCommission: quote.associate_id.commission  // Optionally return the updated commission
  });
} catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ error: 'Error processing order' });
    }
    };
  
  module.exports = {
    fetchSanctionedQuotes,
    updateSanctionedQuote,
    processOrder
  };