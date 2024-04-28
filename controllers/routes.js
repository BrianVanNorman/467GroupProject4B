const express = require('express');
const router = express.Router();
const { searchCustomersByName, createNewQuote, fetchDraftQuotes } = require('./EnterQuoteFunctions');
const { searchAssociates } = require('./LoginFunctions');



// Define routes here

//                    //
// EnterQuote routes: //
//                    //

router.get('/quotes/draft', fetchDraftQuotes);

// Search through Legacy DB
router.get('/customers/search', searchCustomersByName);

// Posting Quote data to Quote Collection in Mongo DB
router.post('/quotes', createNewQuote);

//               //
// Login routes: //
//               //

// Compare user input for username/password to all entries for sales associate account in DB
router.get('/associates/search', searchAssociates);

module.exports = router;