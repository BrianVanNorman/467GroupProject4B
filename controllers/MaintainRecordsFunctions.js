const QuoteModel = require('../models/Quote');
const SalesAssociateModel = require('../models/SalesAssociate');
const connectDB = require('../db');
const mongoose = require('mongoose');

const adminSearchQuotes = async (req, res) => {
    try {
        // Ensure the database is connected
        await connectDB();

        // Variables for search parameters
        const customerid = req.query.search.customer_id;
        const start_date = req.query.search.startDate;
        const end_date = req.query.search.endDate;
        const searchStatus = req.query.search.status;

        // Only query if specified params are not empty
        let query = {};
        if (customerid) {
            query.customer_id = customerid;
        }
        if (start_date && end_date) {
            query.date = {$gte:start_date,$lt:end_date};
        }
        if (!start_date && end_date ) {
            query.date = {$lt:end_date};
        }
        if (start_date && !end_date ) {
            query.date = {$gte:start_date};
        }
        if (searchStatus) {
            query.status = searchStatus;
        }

        // Search quotes table for quotes
        const quotes = await QuoteModel.find(query);
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