const express = require('express');

const router = express.Router();
//const SalesAssociate = require('../models/SalesAssociate'); 
//const Quote = require('../models/Quote');

const customerController = require('./customerController');


// Define routes here

router.get('/customers/search', customerController.searchCustomersByName);

module.exports = router;

