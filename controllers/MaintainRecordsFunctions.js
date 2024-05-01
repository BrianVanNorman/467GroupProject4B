const connectLegacyDB = require('../legacyDB');
const QuoteModel = require('../models/Quote');
const SalesAssociateModel = require('../models/SalesAssociate');
const connectDB = require('../db');
const mongoose = require('mongoose');

const adminSearchQuotes = async (req, res) => {
    try {
        // Ensure the database is connected
        await connectDB();

        // Variables for search parameters
        var customer = req.query.search.customer;
        const start_date = req.query.search.startDate;
        const end_date = req.query.search.endDate;
        const searchStatus = req.query.search.status;
        const associate_id = req.query.search.associate;

        // Find customer id for given customer name (only if it was actually supplied)
        if (customer) {
            const searchTerm = req.query.search.customer;
            try {
                const conn = await connectLegacyDB();
                const [rows] = await conn.execute(
                'SELECT id, name, city, street, contact FROM customers WHERE name LIKE ?',
                [`%${searchTerm}%`]
                );
                if(rows.length === 1) {
                    // Corresponding ID for customer name found
                    customer = rows[0].id;
                }
                else {
                    // Change customer id to -1 to indicate no corresponding customer in legacy DB
                    customer = -1;
                }
            } catch (error) {
                console.error('Error searching customers:', error);
                customer = '';
            }
        }

        // Only query if specified params are not empty
        let query = {};
        if (customer) {
            query.customer_id = customer;
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
        if (associate_id) {
            query.associate_id = associate_id;
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

const listAssociates = async (req, res) => {
    try {
        // Ensure the database is connected
        await connectDB();

        const associates = await SalesAssociateModel.find();
        res.json(associates);
    } catch (error) {
        console.error('Error listing associates:', error);
        res.status(500).send('Error in listing associates');
    }
};

module.exports = { adminSearchQuotes,  listAssociates };