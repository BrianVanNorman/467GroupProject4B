const mongoose = require('mongoose');
const ItemModel = require('./models/Item'); // Path to Item model

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/QuoteSystem', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process with failure
  }
};

// Sample data to insert into the Item collection
const itemsData = [
    { name: 'Item 1', description: 'Description for Item 1', amount: 100 },
    { name: 'Item 2', description: 'Description for Item 2', amount: 150 },
    { name: 'Item 3', description: 'Description for Item 3', amount: 200 },
    { name: 'Item 4', description: 'Description for Item 4', amount: 250 },
    { name: 'Item 5', description: 'Description for Item 5', amount: 300 }
];

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/QuoteSystem', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // Insert sample items into the database
        return ItemModel.insertMany(itemsData);
    })
    .then(() => {
        console.log('Items inserted successfully');
        // Close the connection after insertion
        return mongoose.connection.close();
    })
    .catch(err => {
        console.error('There was an error inserting items:', err);
    });

module.exports = connectDB;
