const connectDB = require('../db');
const mongoose = require('mongoose');
const Quote = require('../models/Quote');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');

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
    const updatedQuoteData = req.body;
    updatedQuoteData.total = calculateTotal(updatedQuoteData.line_items, updatedQuoteData.discount);
    updatedQuoteData.discount = updatedQuoteData.discount; // Include the discount information

    const updatedQuote = await QuoteModel.findByIdAndUpdate(quoteId, updatedQuoteData, { new: true });
    if (!updatedQuote) {
      return res.status(404).send('Finalized quote not found');
    }
    res.json(updatedQuote);
  } catch (error) {
    console.error('Error updating finalized quote:', error);
    res.status(500).send('Error updating finalized quote');
  }
  };
  //  this function to calculate the total
const calculateTotal = (lineItems, discount) => {
  let subtotal = 0;
  for (const item of lineItems) {
    subtotal += item.price * item.quantity;
  }
  if (discount && discount.type) {
    const discountAmount = discount.type === 'percent' ? subtotal * (discount.value / 100) : discount.value;
    return subtotal - discountAmount;
  }
  return subtotal;
};

const sanctionQuote = async (req, res) => {
  try {
    // Attempt to establish a connection if not already connected
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    // Assigning the numeric_id to the quote
    const quoteData = req.body;

    
    const counter = await Counter.getNextSequence('quote');
    if (!counter) {
        return res.status(500).send('Failed to retrieve numeric ID');
    }
    
    quoteData.numeric_id = counter.seq;

    // Calculating total and saving quote
    quoteData.total = calculateTotal(quoteData.line_items, quoteData.discount);
    quoteData.discount = quoteData.discount; // Include the discount information
    const newQuote = new QuoteModel(quoteData);
    const savedQuote = await newQuote.save();

    res.status(201).json(savedQuote);
  } catch (error) {
    console.error('Failed to sanction quote:', error);
    res.status(500).send('Failed to sanction quote: ' + error.message);
  }
};

// Function to send email using SendGrid
const sendQuoteEmail = async (email, content) => {
  const msg = {
      to: email,
      from: 'quotesystemusa@gmail.com',
      subject: 'Your Quote Details',
      text: content,
      html: `<strong>${content}</strong>`,
  };

  try {
      await sgMail.send(msg);
      console.log('Email sent successfully!');
  } catch (error) {
      console.error('Failed to send email:', error);
  }
};

// Email sending function
const sendQuoteEmailHandler = async (req, res) => {
  try {
    const { email, content } = req.body; // Assume these are passed correctly
    await sendQuoteEmail(email, content);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Failed to send email:', error);
    res.status(500).send('Email sending failed');
  }
};

module.exports = {
    getFinalizedQuotes,
    sanctionQuote,
    updateFinalizedQuote,
    sendQuoteEmailHandler
  };