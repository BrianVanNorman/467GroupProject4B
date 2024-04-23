const connectLegacyDB = require('../legacyDB');
const QuoteModel = require('../models/Quote');


const searchCustomersByName = async (req, res) => {
  const searchTerm = req.query.name;
  try {
    const conn = await connectLegacyDB();
    const [rows] = await conn.execute(
      'SELECT name, city, street, contact FROM customers WHERE name LIKE ?',
      [`%${searchTerm}%`]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error searching customers:', error);
    res.status(500).send('Error searching for customers');
  }
};

// quoteController.js

// Function to create a new quote document
const createNewQuote = async (quoteData) => {
  // Create a new Quote model instance with the provided data
  const quote = new QuoteModel({
    customer_email: quoteData.customer_email,
    associate_id: quoteData.associate_id,
    items: quoteData.items, // This assumes that items is an array of item IDs
    status: 'finalized',
    secret_note: quoteData.secret_note,
  });

  // Save the new quote to the database
  const savedQuote = await quote.save();
  return savedQuote;
};

module.exports = { searchCustomersByName, createNewQuote };