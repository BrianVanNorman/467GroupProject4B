const express = require('express');
const router = express.Router();


const { searchCustomersByName, getCustomerById, createNewQuote, fetchDraftQuotes, updateDraftQuote, deleteDraftQuote } = require('./EnterQuoteFunctions');
const { getFinalizedQuotes, updateFinalizedQuote, sanctionQuote } = require('./SanctionQuoteFunctions');
const { searchAssociates } = require('./LoginFunctions');
const { adminSearchQuotes, listAssociates } = require('./MaintainRecordsFunctions');

// Define routes here

//                    //
// EnterQuote routes: //
//                    //

router.get('/customers/search', searchCustomersByName);
router.put('/quotes/:id', updateDraftQuote);
router.get('/quotes/draft', fetchDraftQuotes);
router.get('/customers/:id', getCustomerById);
router.delete('/quotes/:id', deleteDraftQuote);



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
router.put('/quotes/:id/convert-to-purchase-order', sanctionQuote);

//               //
// Login routes: //
//               //

// Compare user input for username/password to all entries for sales associate account in DB
router.get('/associates/search', searchAssociates);

//                         //
// MaintainRecords routes: //
//                         //

router.get('/admin/quotes/search', adminSearchQuotes);
router.get('/associates/list', listAssociates);


module.exports = router;