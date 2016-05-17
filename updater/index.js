/**
 * Created by Daniel on 5/11/2016.
 */

/* main runner for the indexing/updater process */
/* is separate from the main site for modularity, security and reliability */

// global resources
var mongoose   = require('mongoose');
var express    = require('express');
var bodyParser = require('body-parser');
var util       = require('util');
var aws        = require('aws-lib');
var moment     = require('moment');
var app        = express();

// local resources
var IndexedProduct = require('../server/models/IndexedProduct');
var local_codes    = require('../local_codes');

// global properties
var cycle_time = 20000; /* recheck list x milliseconds */
var min_wait_time = 2; /* in minutes */
var max_db_items = 100; /* low number for now */
var cycle_count = 0; /* keeping a running count of num cycles */

// pool of queries to run. Each task has a search query, next page to run (0-indexed)
var queries = [];

// connect to mongoose
mongoose.connect('mongodb://localhost/DealGiraffe');

// middleware - static files
app.use('/client', express.static(__dirname + '/../client/'));

// middleware - send json responses
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// open server for listening
var server = app.listen(local_codes.port_updater, local_codes.internal_ip, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});

/*
 * Helper function to return the sorted list of products
 * Sorted based on last time updated
 */
var get_index_products_priority = function(callback){
    IndexedProduct.find({})
        .sort('-last_time_updated')
        .exec(function(err, indexed_products) {
            callback(indexed_products);
        });
};

/*
 * Reusable function to add a product to the list of indexed products, based on it's asin
 * If force_add it set to true, no conditions will checked, added as long as it exists
 */
var add_to_products_index = function(item, search_query) {

    // check for valid item
    if (!item) {
        log("No valid item given in add_to_products_index");
        return;
    }

    var currentRank, currentPriceNew;

    // salesrank
    if (item.SalesRank && !isNaN(item.SalesRank))
        currentRank = Number(item.SalesRank);
    else
        currentRank = -1;

    // set the price, if it exists
    if (item.OfferSummary &&
        item.OfferSummary.LowestNewPrice &&
        item.OfferSummary.LowestNewPrice.Amount) {
        currentPriceNew = Number(item.OfferSummary.LowestNewPrice.Amount);
    } else {
        currentPriceNew = -1;
        log("Could not find a price for asin: " + item.ASIN);
    }

    var newProductParams = {
        asin: item.ASIN,
        category: 'PCHardware',
        hidden: false,
        force_frontpage: false,
        page_views: 0,
        raw_data: item,
        price_new: [{price: currentPriceNew, date: new Date()}],
        rank: [{rank: currentRank, date: new Date()}]
    };

    var newProduct = new IndexedProduct(newProductParams);

    newProduct.save(function(err, newProduct){

        if (err) {
            log("Error adding product to index. Error: " + err);
            return;
        }

        log("Added new item with ASIN: " + newProduct.asin);

        if (callback)
            callback(newProduct);
    });

};

/*
 * Simple helper function to log to the console
 */
var log = function(text) {
    console.log("%d: %s", cycle_count, text);
};

/*
 * given a specific asin, check if it is alredy in the index
 */
var check_asin_exists = function(asin, item_data, callback) {

    IndexedProduct.findOne({asin: asin})
        .exec(function(err, item) {

            if (err || !item) {
                callback(false, item_data);
                return;
            }

            callback(true, item_data);
        });

};

/*
 * Already found out that this item is in the index. Update the price and rank info
 */
var update_product_index = function(raw_item, callback) {

    IndexedProduct.findOne({asin: raw_item.ASIN})
        .exec(function(err, item) {

            // ensure correct respone
            if (err || !item) {
                log("Error finding item that should have existed. ASIN given: " + raw_item.ASIN);
                return;
            }

            // get the newest data
            var currentRank, currentPriceNew;

            // set the sales rank, if it exists
            if (raw_item.SalesRank) {
                currentRank = Number(raw_item.SalesRank);
            } else {
                currentRank = -1;
            }

            // set the price, if it exists
            if (raw_item.OfferSummary &&
                raw_item.OfferSummary.LowestNewPrice &&
                raw_item.OfferSummary.LowestNewPrice.Amount) {
                currentPriceNew = Number(raw_item.OfferSummary.LowestNewPrice.Amount);
            } else {
                currentPriceNew = -1;
                log("Could not find a price for asin: " + raw_item.ASIN);
            }

            // add to the array
            item.price_new.push({price: currentPriceNew, date: new Date()});
            item.rank.push({rank: currentRank, date: new Date()});

            // save the item
            item.save(function(err, updated_item) {

                if (err) {
                    log("Could not update item. Err: " + err);
                    return;
                }

                log("Updated item with ASIN " + updated_item.asin);
            });

        });

};

/*
 * Given a query, which has next_page_to_run, and search_query
 * Use that info to construct the next query
 */
var execute_query = function(query) {

    // compose the parameters for this request
    var params = {
        SearchIndex: 'PCHardware',
        ResponseGroup: 'Large',
        Keywords: query.search_query,
        ItemPage: query.next_page_to_run
    };

    // search for all the items
    var prodAdv = aws.createProdAdvClient(local_codes.a, local_codes.b, local_codes.c);
    prodAdv.call("ItemSearch", params, function(err, items_data) {

        if (err) {
            log("Error in processsing the ItemSearch. Error: " + err);
            return;
        }

        // keep track of the total pages to go over and change
        var total_pages = items_data.Items.TotalPages;
        query.next_page_to_run++;
        if (query.next_page_to_run > 10 || (total_pages && query.next_page_to_run > total_pages) ) {
            query.next_page_to_run = 1;
        }

        for (var i = 0; i < items_data.Items.Item.length; i++) {

            // check for valid data
            if (!items_data || !items_data.Items.Item || !items_data.Items.Item[i]) {
                break;
            }

            // get the raw_data
            var item = items_data.Items.Item[i];
            var item_asin = item.ASIN;

            // add new item to db, or update it
            check_asin_exists(item_asin, item, function(exists, correct_item){

                if (!exists) {
                    add_to_products_index(correct_item, query.search_query);
                    return;
                }

                update_product_index(correct_item);
            });

        }

    });

};

/*
 * The handler for the 'while' loop that will call the next query.
 * All the action happens here
 */
var next_cycle = function() {

    // the first item of the queries array is the highest-priority (set at the end of last cycle)
    var next_query = queries[0];

    // run the next query
    execute_query(next_query);

    // change the first item to be the last
    queries.push(queries.shift());

    cycle_count++;
};

/* routes */

/*
 * Return the html page for the admin controls for the updater
 */
app.get('/admin', function(req, res) {
    res.sendFile(__dirname + '/admin.html');
});

/*
 * Add the product item to the database
 */
app.post('/addProductItem', function(req, res) {

    var asin = req.body.asin;

    add_to_products_index(asin, false, function(new_item){
        res.json(new_item);
    });

});

// just for testing purposes
app.get('/sampleRequest/:asin', function(req, res){

    var prodAdv = aws.createProdAdvClient(local_codes.a, local_codes.b, local_codes.c);

    var params = {
        ResponseGroup: "Large",
        Keywords: 'Graphics Card',
        SearchIndex: 'PCHardware',
        ItemPage: 9
    };

    prodAdv.call("ItemSearch", params, function(err, item_response) {
        res.json(item_response);
    });

});

/* set the tasks for this process here */

var query0 = {
    next_page_to_run: 1,
    search_query: 'Graphics Card'
};

queries.push(query0);

// executing code
next_cycle();
setInterval(next_cycle, cycle_time);