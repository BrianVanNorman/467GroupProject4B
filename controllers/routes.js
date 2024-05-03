const express = require('express');
const router = express.Router();


const { searchCustomersByName, getCustomerById, createNewQuote, fetchDraftQuotes, updateDraftQuote, deleteDraftQuote } = require('./EnterQuoteFunctions');
const { getFinalizedQuotes, updateFinalizedQuote, sanctionQuote, sendQuoteEmailHandler } = require('./SanctionQuoteFunctions');
const { fetchSanctionedQuotes, updateSanctionedQuote, processOrder } = require('./ConvertQuoteFunctions');
const { searchAssociates } = require('./LoginFunctions');
const { adminSearchQuotes, listAssociates, addAssociate, updateAssociate, deleteAssociate } = require('./MaintainRecordsFunctions');

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

// Convert quote to sanctioned quote
router.put('/quotes/:id/sanction-quote', sanctionQuote);

router.post('/quotes/send-email', sendQuoteEmailHandler);


//                      //
// ConvertQuote routes: //
//                      //

// Get Sanctioned Quotes
router.get('/quotes/sanctioned', fetchSanctionedQuotes);

//Update Sanctioned Quotes total(another discount if applied)
router.put('/quotes/sanctioned/:id', updateSanctionedQuote);

// To process a sanctioned quote into an order
router.post('/quotes/:id/process-order', processOrder);


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
router.post('/associates', addAssociate);
router.put('/associates/:id', updateAssociate);
router.delete('/associates/:id', deleteAssociate);


module.exports = router;