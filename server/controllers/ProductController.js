
var aws = require('aws-lib');
var path = require('path');

var settings = require('./../../updater/settings');
var local_codes = require('../../local_codes');
var IndexedProduct = require('../models/IndexedProduct');
var getProductDbSize = require('./../lib/getProductDbSize');
var getProductDbInfo = require('./../lib/getProductDbInfo');

// back-end function to parse through a product and make the important info easily accessible
var get_product_parameters = function(product) {
	var large_data = product.large_data;
	product.title               = large_data.ItemAttributes.Title;
	product.price_new_formatted = large_data.OfferSummary.LowestNewPrice.FormattedPrice;
	product.editorial_review    = large_data.EditorialReviews.EditorialReview.Content;
	product.features            = large_data.ItemAttributes.Feature;
	product.string_data         = JSON.stringify(product);
	return product;
};

// increase the page_views field by one. done separetely to avoid risk
var incrementPageViews = function(dbItem) {
	dbItem.page_views++;
	dbItem.save(function(err, result) {
		if (err) {
			console.log('Error: ' + err);
		}
	});
};

// Use asin to find an indexed product and set hidden to true
module.exports.DeleteProduct = function(req, res) {
	var asin = req.params.id;
	IndexedProduct.findOne({asin:asin})
		.exec(function(err, result){
			if (err) {
				console.log("Error: " + err);
				res.send("Error: " + err);
				return;
			}

			result.remove(function(err, final_result){
				res.json(final_result);
			});
		});
};

// Use asin to find an indexed product and set hidden to true
module.exports.ToggleFrontPageProduct = function(req, res) {
	var id = req.body.id;
	IndexedProduct.findOne({_id:id})
		.exec(function(err, result){
			if (err) {
				console.log("Error: " + err);
				return res.send("Error: " + err);
			}

			result.force_frontpage = true;
			result.save(function(err, final_result){
				res.json(final_result);
			});
		});
};

// Use asin to retrieve an indexed product
module.exports.GetProduct = function(req, res) {
	var asin = req.params.id;
	IndexedProduct.findOne({asin:asin})
		.exec(function(err, result){
			if (err) {
				console.log("Error: " + err);
				return res.send("Error: " + err);
			}
			incrementPageViews(result);
			res.json(result);
		});
};

// Get products based on start page, end page, and sort by
module.exports.GetProducts = function(req, res) {
	var sortQuery= "";
	var sortBy = req.params.sortby;
	var startPage = req.params.startpage;
	var endPage = req.params.endpage;

	switch(sortBy) {
		case 'newest':
			sortQuery = '-date_created';
			break;
		case 'oldest':
			sortQuery = 'date_created';
			break;
		case 'pageViews':
			sortQuery = '-page_views';
			break;
		case 'alphabetical': /* not sure if this will work */
			sortQuery = 'large_data.ItemAttributes.Title';
			break;
		case 'recentlyUpdated':
			sortQuery = '-last_time_updated';
			break;
		case 'oldestUpdated':
			sortQuery ='last_time_updated';
			break;
	}

	IndexedProduct.find({})
		.skip(+startPage)
		.limit(+(endPage - startPage))
		.sort(sortQuery)
		.exec(function(err, result){

			if (err) {
				console.log("Error: " + err);
				res.send("Error: " + err);
				return;
			}

			res.json(result);
		});
};

// get the 24 most recently indexed items (for now, refine later)
module.exports.GetHomepageProducts = function(req, res) {
	IndexedProduct.find({})
		.sort('-date_created')
		.limit(24)
		.exec(function(err, result) {
			if (err) {
				console.log("Error: " + err);
				return res.status(500).send("Error: " + err);
			}
			res.json(result);
		});
};

// get 24 items specifically for the graphics cards page (for now, get the most recent)
module.exports.GetGraphicsPageProducts = function(req, res) {
	IndexedProduct.find({'query.category': 'Graphics Cards'})
		.sort('-date_created')
		.limit(24)
		.exec(function(err, result) {
			if (err) {
				console.log("Error: " + err);
				return res.status(500).send("Error: " + err);
			}
			res.json(result);
		});
};

// Return all of the indexed products
module.exports.GetAllProducts = function(req, res) {
	IndexedProduct.find({})
		.exec(function(err, result){
			if (err) {
				console.log("Error: " + err);
				return res.status(500).send("Error: " + err);
			}
			res.json(result);
	});
};

// Returns an object contains info and stats about the db
module.exports.GetAllProductInfo = function(req, res) {
	var result = {
		totalProducts: 0,
		dbSize: 0,
		lastTimeUpdated: null
	};

	getProductDbInfo(function(err, totalProducts, lastTimeUpdated){
		if (err) {
			console.log(err);
			return res.status(500).send(err);
		}

		getProductDbSize(function(err, dbSize) {
			if (err) {
				console.log(err);
				return res.status(500).send(err);
			}

			result.dbSize = dbSize;
			result.totalProducts = totalProducts;
			result.lastTimeUpdated = lastTimeUpdated;
			result.cycleCount = settings.cycleCount;
			result.cycleTime = settings.cycleTime;

			return res.json(result);
		});
	});
};

// Use asin to find an indexed product and set hidden to true
module.exports.HideProduct = function(req, res) {
	var asin = req.params.id;
	IndexedProduct.findOne({asin:asin})
		.exec(function(err, result){
			if (err) {
				console.log("Error: " + err);
				res.send("Error: " + err);
				return;
			}

			result.hidden = true;
			result.save(function(err, final_result){
				res.json(final_result);
			});
		});
};