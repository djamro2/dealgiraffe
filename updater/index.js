
// global resources
var mongoose   = require('mongoose');
var express    = require('express');
var bodyParser = require('body-parser');
var util       = require('util');
var aws        = require('aws-lib');
var moment     = require('moment');

// local resources
var IndexedProduct = require('../server/models/IndexedProduct');
var QueueTask      = require('../server/models/QueueTask');
var local_codes    = require('../local_codes');
var settings       = require('./settings');
var app            = express();

// global properties
var self = this;
self.cycleCount = 0;
var prodAdv     = aws.createProdAdvClient(local_codes.a, local_codes.b, local_codes.c);

// connect to mongoose
mongoose.connect('mongodb://localhost/DealGiraffe');

// middleware
app.use('/client', express.static(__dirname + '/../client/'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// open server for listening
var server = app.listen(local_codes.port_updater, local_codes.internal_ip, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});

// Simple helper function to log to the console
var log = function(text) {
    console.log("%d: %s", self.cycleCount, text);
};

// given a specific asin, check if it is already in the index
var checkAsinExists = function(item_data, callback) {
    var asin = item_data.ASIN;
    IndexedProduct.findOne({asin: asin})
        .exec(function(err, item) {
            if (err || !item) {
                callback(false, item_data);
                return;
            }
            callback(true, item_data);
        });
};

// Set the response group to Large and get the product data pertaining to that asin
var getLargeProductData = function(asin, callback) {
    var params = {
        ResponseGroup: "Large",
        ItemId: asin
    };

    prodAdv.call("ItemLookup", params, function(err, item_response) {

        if (err) {
            log("Error with an item lookup for getting large product data with asin: " + asin);
            return;
        }

        if (typeof(callback) == "function") {
            callback(item_response);
        }
    });
};

/*
 * Parse through the offers data and return the three sets of prices as an object
 */
var getPricingData = function(offers_item) {

    // object to be returned
    var result = {
        price_amazon_new: 0,
        price_third_new: 0,
        price_third_used: 0
    };

    // check valid
    if (!offers_item) {
        log("Offers item did not exist!");
        return;
    }

    // get price amazon new
    if (offers_item.Offers &&
        offers_item.Offers.Offer &&
        offers_item.Offers.Offer.OfferListing.Price.Amount) {
        result.price_amazon_new = offers_item.Offers.Offer.OfferListing.Price.Amount;
    } else {
        log("Could not get the price_amazon_new data for asin: " + offers_item.ASIN);
    }

    // get price third new
    if (offers_item.OfferSummary &&
        offers_item.OfferSummary.LowestNewPrice) {
        result.price_third_new = offers_item.OfferSummary.LowestNewPrice.Amount;
    } else {
        log("Could not get the price_third_new data for asin: " + offers_item.ASIN);
    }

    // get price third used
    if (offers_item.OfferSummary &&
        offers_item.OfferSummary.LowestUsedPrice) {
        result.price_third_used = offers_item.OfferSummary.LowestUsedPrice.Amount;
    } else {
        log("Could not get the price_third_used data for asin: " + offers_item.ASIN);
    }

    return result;
};

// Reusable function to add a product to the list of indexed products, based on it's asin
// If force_add it set to true, no conditions will checked, added as long as it exists
var addToProductsIndex = function(offers_item, callback) {
    // check for valid item
    if (!offers_item) {
        log("No valid item given in addToProductsIndex");
        return;
    }

    // initial fields for new item
    var newProductParams = {
        asin: offers_item.ASIN,
        hidden: false,
        force_frontpage: false,
        page_views: 0,
        price_amazon_new: [],
        price_third_new: [],
        price_third_used: [],
        offers_data: offers_item,
        query: offers_item.query,
        large_data: null /* still need to set */
    };

    // get the 'large' response group
    getLargeProductData(offers_item.ASIN, function(largeProductData) {
        newProductParams.large_data = largeProductData.Items.Item;

        var newProduct = new IndexedProduct(newProductParams);
        newProduct.save(function(err, newProduct){
            if (err) {
                log("Error adding product to index. Error: " + err);
                return;
            }

            log("Added new item with ASIN: " + newProduct.asin);

            if ( typeof(callback) == "function") {
                callback();
            }
        });
    });
};

// Already found out that this item is in the index. Update the price and rank info
var updateProductIndex = function(offers_item) {
    IndexedProduct.findOne({asin: offers_item.ASIN})
        .exec(function(err, item) {
            // ensure correct response
            if (err || !item) {
                log("Error finding item that should have existed. ASIN given: " + offers_item.ASIN);
                return;
            }

            // get the newest data
            var prices = getPricingData(offers_item);

            // add to the array
            item.price_amazon_new.push({price: prices.price_amazon_new, date: new Date()});
            item.price_third_new.push({price: prices.price_third_new, date: new Date()});
            item.price_third_used.push({price: prices.price_third_used, date: new Date()});

            // update last time updater
            item.last_time_updated = new Date();

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

// Find the next page to run for this particular query. Will increment it, or
// move it back to 1 under certain conditions
var incrementCurrentPage = function(query, total_pages) {
    if (query.temp) {
        query.remove(function(err){
            if (err) {
                console.log("Error removing query: " + err);
            }
        });
    } else {
        query.currentPage++;
        if (query.currentPage > 10 || (total_pages && query.currentPages > total_pages)) {
            query.currentPage = 1;
        }
        query.lastRunTime = new Date();
        query.save(function (err, response) {
            if (err) {
                console.log("Query page not incremented: " + err);
            }
        });
    }
};

// Given a query, which has next_page_to_run, and search_query
// Use that info to construct the next query
var executeQuery = function(query) {
    var params = {
        ResponseGroup: 'OfferFull',
        SearchIndex: query.searchIndex,
        Keywords: query.searchQuery,
        ItemPage: query.currentPage
    };

    prodAdv.call("ItemSearch", params, function(err, items_data) {
        if (err) {
            return log("Error in processing the ItemSearch. Error: " + err);
        }
        var productQuery = query; /* save copy in case it gets deleted */
        incrementCurrentPage(query, items_data.Items.TotalPages);

        var i = 0;
        var delayedLoop = setInterval(function(){
            if ( i >= items_data.Items.Item.length) {
                clearInterval(delayedLoop); return;
            }
            if (!items_data || !items_data.Items.Item || !items_data.Items.Item[i]) {
                clearInterval(delayedLoop); return;
            }

            checkAsinExists(items_data.Items.Item[i], function(exists, offers_item){
                if (!exists) { /* doesn't exist, add base item first */
                    offers_item.query = productQuery;
                    addToProductsIndex(offers_item, function(){
                        updateProductIndex(offers_item);
                    });
                } else {
                    updateProductIndex(offers_item);
                }
            });

            i++;
        }, settings.timeBetweenAddingToDB);
    });
};

// The handler for the 'while' loop that will call the next query.
// All the action happens here
var nextCycle = function() {
    QueueTask.find({})
        .sort('lastRunTime')
        .exec(function(err, queueTasks) {
            if (err) {
                return console.log("Error in finding tasks: " + err);
            }
            if (!queueTasks || !queueTasks[0]) {
                return console.log("Couldn't find any queue items");
            }
            executeQuery(queueTasks[0])
        });
    console.log('Cycle Count: ' + self.cycleCount);
    self.cycleCount++;
};

nextCycle();
setInterval(nextCycle, settings.cycleTime);