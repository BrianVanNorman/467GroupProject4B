const connectDB = require('../db'); 
const mongoose = require('mongoose');   // To connect to MongoDB
const SalesAssociateModel = require('../models/SalesAssociate');

// Function to search through SalesAssociate table in DB
const searchAssociates = async (req, res) => {
    try {
        // Ensure the database is connected
        await connectDB();

        // Variables for inputted name/password
        const username = req.query.name;
        const password = req.query.pass;

        // Check if username/password matches
        const associate = await SalesAssociateModel.findOne({ name: username, password: password });
        if (associate) {
            // Send back the associate's _id if found
            res.json({ success: true, associateId: associate._id.toString() });  // Convert _id to string
        } else {   
            // Respond not found if no associate matches
            res.json({ success: false });
        }
    } catch (error) {
        console.error('Error searching associates:', error);
        res.status(500).send('Error in searching for associates');
    }
};

module.exports = { searchAssociates };