const mongoose = require('mongoose');
const SalesAssociateModel = require('./models/SalesAssociate'); // Path to Sales Associate model

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/QuoteSystem', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
    
    const salesAssociateData = [
      { name: 'Elon Musk', password: '12345', address: 'SpaceX, Cape Canaveral, FL 32920', commision: 0.00},
      { name: 'John Doe', password: '54321', address: 'NIU, Dekalb, IL 60115', commision: 0.00},
      { name: 'Albert Einstein', password: 'Relativity1', address: '112 Mercer St, Princeton, NJ 08540', commision: 0.00},
      { name: 'Marie Curie', password: 'Radium2', address: '36 Rue Cuvier, Paris, 75005', commision: 0.00},
      { name: 'Isaac Newton', password: 'Gravity3', address: 'Woolsthorpe Manor, Grantham NG33 5PD, UK', commision: 0.00}
    ];

    for (const associate of salesAssociateData) {
      const exists = await SalesAssociateModel.findOne({ name: associate.name });
      if (!exists) {
        await SalesAssociateModel.create(associate);
        console.log(`Inserted ${associate.name} into the database.`);
      } else {
        console.log(`${associate.name} already exists.`);
      }
    }

    console.log('Data insertion process completed.');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit process with failure
  }
};

connectDB();

module.exports = connectDB;