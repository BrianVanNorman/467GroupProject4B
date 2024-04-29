const connectLegacyDB = require('../legacyDB');
const QuoteModel = require('../models/Quote');
const connectDB = require('../db');
const mongoose = require('mongoose');
const Counter = require('../models/Counter');

//Search function for searching through Legacy DB
const searchCustomersByName = async (req, res) => {
  const searchTerm = req.query.name;
  try {
    const conn = await connectLegacyDB();
    const [rows] = await conn.execute(
      'SELECT id, name, city, street, contact FROM customers WHERE name LIKE ?',
      [`%${searchTerm}%`]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error searching customers:', error);
    res.status(500).send('Error searching for customers');
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

//  this function to fetch draft quotes
const fetchDraftQuotes = async (req, res) => {
  try {
    const associateId = req.query.associateId;
    const draftQuotes = await QuoteModel.find({ status: 'draft', associate_id: associateId });
    res.json(draftQuotes);
  } catch (error) {
    console.error('Error fetching draft quotes:', error);
    res.status(500).send('Error fetching draft quotes');
  }
};


const updateDraftQuote = async (req, res) => {
  try {
    const quoteId = req.params.id;
    const updatedQuoteData = req.body;
    updatedQuoteData.total = calculateTotal(updatedQuoteData.line_items, updatedQuoteData.discount);
    updatedQuoteData.discount = updatedQuoteData.discount; // Include the discount information

    const updatedQuote = await QuoteModel.findByIdAndUpdate(quoteId, updatedQuoteData, { new: true });
    if (!updatedQuote) {
      return res.status(404).send('Draft quote not found');
    }
    res.json(updatedQuote);
  } catch (error) {
    console.error('Error updating draft quote:', error);
    res.status(500).send('Error updating draft quote');
  }
};

const createNewQuote = async (req, res) => {
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
    console.error('Failed to create quote:', error);
    res.status(500).send('Failed to create quote: ' + error.message);
  }
};


const deleteDraftQuote = async (req, res) => {
  try {
    const quoteId = req.params.id;
    const deletedQuote = await QuoteModel.findByIdAndDelete(quoteId);
    if (!deletedQuote) {
      return res.status(404).send('Draft quote not found');
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting draft quote:', error);
    res.status(500).send('Error deleting draft quote');
  }
};

const getCustomerById = async (req, res) => {
  const customerId = req.params.id;
  try {
    const conn = await connectLegacyDB();
    const [rows] = await conn.execute(
      'SELECT id, name, city, street, contact FROM customers WHERE id = ?',
      [customerId]
    );
    if (rows.length === 0) {
      res.status(404).send('Customer not found');
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).send('Error fetching customer');
  }
};

module.exports = {
  searchCustomersByName,
  createNewQuote,
  fetchDraftQuotes,
  updateDraftQuote,
  getCustomerById,
  deleteDraftQuote,
};