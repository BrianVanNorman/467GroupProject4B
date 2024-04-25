const mongoose = require('mongoose');   // To connect to MongoDB
const SalesAssociateModel = require('../models/SalesAssociate');

// Function to search through SalesAssociate table in DB
const searchAssociates = async (req, res) => {
    try {
        // Connect to database
        await mongoose.connect('mongodb://localhost:27017/QuoteSystem', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });

        // Variables for inputted name/password
        const username = req.query.name;
        const passw = req.query.pass;

        try {
            // Check if username/password matches
            const data = await SalesAssociateModel.find({name: username, password: passw});
            if (data.length === 1) {
                // Username/password in table
                res.send(true);
            }
            else {   
                // Username/password not in table
                res.send(false);
            }
        }
        catch (error) {
            console.error('Error searching associates:', error);
            res.send(false);
        }

        // Disconnect from database
        mongoose.connection.close();
    }
    catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1); // Exit process with failure
      }
};

module.exports = { searchAssociates };