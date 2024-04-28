const express = require('express');
const router = express.Router();

const { searchCustomersByName, createNewQuote, fetchDraftQuotes, updateDraftQuote } = require('./EnterQuoteFunctions');
const { getFinalizedQuotes, updateFinalizedQuote, convertToPurchaseOrder } = require('./SanctionQuoteFunctions');
const { searchAssociates } = require('./LoginFunctions');

// Define routes here

//                    //
// EnterQuote routes: //
//                    //

router.put('/quotes/:id', updateDraftQuote);
router.get('/quotes/draft', fetchDraftQuotes);

// Search through Legacy DB
router.get('/customers/search', searchCustomersByName);

// Posting Quote data to Quote Collection in Mongo DB
router.post('/quotes', createNewQuote);

//                       //
// SanctionQuote routes: //
//                       //

// Get finalized quotes
router.get('/quotes/finalized', getFinalizedQuotes);

// Update a finalized quote
router.put('/quotes/:id', updateFinalizedQuote);

// Convert quote to purchase order
router.put('/quotes/:id/convert-to-purchase-order', convertToPurchaseOrder);

//               //
// Login routes: //
//               //

// Compare user input for username/password to all entries for sales associate account in DB
router.get('/associates/search', searchAssociates);

module.exports = router;