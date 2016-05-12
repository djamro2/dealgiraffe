/**
 * Created by Daniel on 5/11/2016.
 */

/* main runner for the indexing/updater process */
/* is separate from the main site for modularity, security and reliability */

// global resources
var mongoose = require('mongoose');
var express  = require('express');
var app      = express();

// local resources
var IndexedProduct = require('../server/models/IndexedProduct');
var local_codes    = require('../local_codes');

// connect to mongoose
mongoose.connect('mongodb://localhost/DealGiraffe');

// open server for listening
var server = app.listen(local_codes.port_updater, local_codes.internal_ip, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});

var next_cycle = function() {

    console.log('Reached next cycle');
    
};

/*
 * Reusable function to add a product to the list of indexed products, based on it's asin
 * If force_add it set to true, no conditions will checked, added as long as it exists
 */
var add_to_products_index = function(asin, force_add) {

    console.log('Addding product with asin: %s', asin);

};

/* routes */

/*
 * Return the html page for the admin controls for the updater
 */
app.get('/admin', function(req, res) {
    res.sendFile(__dirname + '/admin.html');
});

/*
 *
 */
app.post('/addItem/:asin', function(req, res) {
    var asin = req.params.asin;
    add_to_products_index(asin);
    res.send('Success');
});


setInterval(next_cycle, 5000);