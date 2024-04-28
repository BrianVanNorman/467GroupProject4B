const QuoteModel = require('../models/Quote');
const SalesAssociateModel = require('../models/SalesAssociate');
const connectDB = require('../db');
const mongoose = require('mongoose');

const adminSearchQuotes = async (req, res) => {
    try {
        // Ensure the database is connected
        await connectDB();

        // Variables for search parameters
        const customer_id = req.query.search.customer_id;
        const start_date = req.query.search.startDate;
        const end_date = req.query.search.endDate;
        const status = req.query.search.status;

        // Search quotes table for quotes (INCOMPLETE)
        const quotes = await QuoteModel.find({ name: username, password: password });
        if (quotes.length >= 1) {
            // Sends quotes if results found is size of results is >= 1
            res.json(quotes); 
        } else {   
            // Respond if no quotes found
            res.json({});
        }
    } catch (error) {
        console.error('Error searching quotes:', error);
        res.status(500).send('Error in searching for quotes');
    }
};

module.exports = { adminSearchQuotes };