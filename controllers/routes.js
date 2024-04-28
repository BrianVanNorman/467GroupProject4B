const express = require('express');
const router = express.Router();

const { searchCustomersByName, getCustomerById, createNewQuote, fetchDraftQuotes, updateDraftQuote, deleteDraftQuote } = require('./EnterQuoteFunctions');
const { getFinalizedQuotes, convertToPurchaseOrder } = require('./SanctionQuoteFunctions');
const { searchAssociates } = require('./LoginFunctions');
const { adminSearchQuotes } = require('./MaintainRecordsFunctions');

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

// Convert quote to purchase order
router.put('/quotes/:id/convert-to-purchase-order', convertToPurchaseOrder);

//               //
// Login routes: //
//               //

// Compare user input for username/password to all entries for sales associate account in DB
router.get('/associates/search', searchAssociates);

//                         //
// MaintainRecords routes: //
//                         //

router.get('/admin/quotes/search', adminSearchQuotes);


module.exports = router;