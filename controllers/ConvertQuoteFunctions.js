const axios = require('axios');
const connectDB = require('../db');
const mongoose = require('mongoose');
const QuoteModel = require('../models/Quote');

const fetchSanctionedQuotes = async (req, res) => {
  try {
    const sanctionedQuotes = await QuoteModel.find({ status: 'sanctioned' });
    res.json(sanctionedQuotes);
  } catch (error) {
    console.error('Error fetching sanctioned quotes:', error);
    res.status(500).send('Error fetching sanctioned quotes');
  }
};

const updateSanctionedQuote = async (req, res) => {
  const { total, discount } = req.body;
  try {
    const quote = await QuoteModel.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    quote.total = total;
    quote.discount = discount;

    await quote.save();

    res.json({
      message: 'Quote updated successfully',
      quote: quote
    });
  } catch (error) {
    console.error('Error updating sanctioned quote:', error);
    res.status(500).send('Error updating sanctioned quote');
  }
};

const processOrder = async (req, res) => {
  try {
    const quote = await QuoteModel.findById(req.params.id).populate('associate_id');

    if (!quote || !quote.associate_id) {
      return res.status(404).json({ error: 'Quote or Associate not found' });
    }

    const postData = {
      order: quote._id.toString(),
      associate: quote.associate_id._id.toString(),
      custid: quote.customer_id.toString(),
      amount: quote.total.toFixed(2),
    };

    const url = 'http://blitz.cs.niu.edu/PurchaseOrder/';
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    const response = await axios.post(url, postData, options);

    if (response.data && response.data.errors) {
      return res.status(400).json({ errors: response.data.errors });
    }

    const processingDate = response.data.processDay;
    const commissionPercentage = parseFloat(response.data.commission.replace('%', '')) / 100;

    const commissionAmount = quote.total * commissionPercentage;

    await QuoteModel.findByIdAndUpdate(req.params.id, {
      processingDate: new Date(processingDate),
      commission: commissionAmount,
      status: 'ordered'
    }, { new: true });

    quote.associate_id.commission += commissionAmount;
    await quote.associate_id.save();

    res.json({
      message: 'Order processed successfully!',
      processingDate: processingDate,
      commissionRate: commissionPercentage,
      commissionAmount: commissionAmount,
      quote: {
        ...quote.toObject(),
        processingDate,
        commission: commissionAmount,
        discount: quote.discount
      }
    });
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ error: 'Error processing order' });
  }
};

module.exports = {
  fetchSanctionedQuotes,
  updateSanctionedQuote,
  processOrder
};