const connectLegacyDB = require('../legacyDB');
const QuoteModel = require('../models/Quote');


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

// Function to create a new quote document
const createNewQuote = async (req, res) => {
  try {
      const quoteData = req.body; // Assuming the data is sent in the body of a POST request
      const newQuote = new QuoteModel(quoteData);
      const savedQuote = await newQuote.save();
      res.status(201).json(savedQuote);
  } catch (error) {
      console.error('Failed to create quote:', error);
      res.status(500).send('Failed to create quote: ' + error.message);
  }
};

module.exports = { searchCustomersByName, createNewQuote };