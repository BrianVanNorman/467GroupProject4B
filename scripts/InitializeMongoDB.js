const mongoose = require('mongoose');
const connectDB = require('../db');
const SalesAssociateModel = require('../models/SalesAssociate');
const ItemModel = require('../models/Item');
const QuoteModel = require('../models/Quote');
const Counter = require('../models/Counter');

async function initCounter() {
    const initialCounter = await Counter.findOne({_id: 'quote'});
    if (!initialCounter) {
        await new Counter({_id: 'quote', seq: 0}).save();
        console.log('Counter initialized for quotes.');
    } else {
        console.log('Counter already initialized.');
    }
}

async function insertInitialData() {
    const salesAssociateData = [
        { name: 'Elon Musk', password: '12345', address: 'SpaceX, Cape Canaveral, FL 32920', commission: 0.00},
        { name: 'John Doe', password: '54321', address: 'NIU, Dekalb, IL 60115', commission: 0.00},
        { name: 'Albert Einstein', password: 'Relativity1', address: '112 Mercer St, Princeton, NJ 08540', commission: 0.00},
        { name: 'Marie Curie', password: 'Radium2', address: '36 Rue Cuvier, Paris, 75005', commission: 0.00},
        { name: 'Isaac Newton', password: 'Gravity3', address: 'Woolsthorpe Manor, Grantham NG33 5PD, UK', commission: 0.00}
    ];

    const names = salesAssociateData.map(associate => associate.name);
    const existingAssociates = await SalesAssociateModel.find({ name: { $in: names } });

    if (existingAssociates.length === 0) {
        await SalesAssociateModel.insertMany(salesAssociateData);
        console.log('All new associates inserted successfully.');
    } else {
        console.log('One or more associates already exist. No new data inserted.');
    }
}

async function insertNewQuote() {
    const associate = await SalesAssociateModel.findOne();
    if (!associate) {
        console.log('No sales associates found. Please add some and try again.');
        return;
    }

    const newQuote = new QuoteModel({
        date: new Date(),
        associate_id: associate._id,
        customer_id: 123,
        customer_email: 'jkurbis@yahoo.com',
        amount: 1500,
        commission: 150,
        status: 'draft',
    });

    await newQuote.save();
    console.log('New quote inserted successfully.');
}

async function initializeMongoDB() {
    try {
        await connectDB(); // Establish the database connection
        console.log('MongoDB connected...');

        await initCounter();
        await insertInitialData();
        await insertNewQuote();

        console.log('Initialization complete. Disconnecting...');
        mongoose.disconnect();
    } catch (err) {
        console.error('Error during database initialization:', err);
        process.exit(1);
    }
}

initializeMongoDB();