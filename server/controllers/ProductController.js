
var aws = require('aws-lib');
var path = require('path');

var settings = require('./../../updater/settings');
var IndexedProduct = require('../models/IndexedProduct');
var getProductDbSize = require('./../lib/getProductDbSize');
var getProductDbInfo = require('./../lib/getProductDbInfo');
var getPricingData   = require('./../lib/getPricingData');
var localCodes = require('./../../local_codes.js');

var prodAdv = aws.createProdAdvClient(
	localCodes.accessKey,
	localCodes.secretKey,
	'dealgira-20'
);

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

// given a searchQuery, return a qArr
var formatQuery = function(query) {
	var q = query.toLowerCase();
	var qData = q.split(' ');
	var qArr = [];
	for (var i = 0; i < qData.length; i++ ) {
		var sQ = qData[i];
		var rQ = new RegExp(sQ, "i" );
		qArr.push(rQ);
	}
	if ( qData.length > 1 ) {
		qArr.push(new RegExp(q, "i"));
	}
	return qArr;
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

// add product normally by ASIN
module.exports.AddProductItem = function(req, res) {
	var asin = req.body.asin;
	var params = {
		ResponseGroup: "Large",
		ItemId: asin
	};

	prodAdv.call("ItemLookup", params, function(error, item_response) {
		if (error) {
			console.log("Error with asin: " + asin + ". " + error);
			return res.json({error: 'Error getting Large response group'});
		}

		// initial fields for new item
		var newProductParams = {
			asin: asin,
			large_data: item_response.Items.Item,
			hidden: false,
			force_frontpage: false,
			page_views: 0,
			price_amazon_new: [],
			price_third_new: [],
			price_third_used: [],
			offers_data: false, /* still need to get */
			query: false
		};

		// get all the offer data
		params.ResponseGroup = "OfferFull";
		prodAdv.call("ItemLookup", params, function(error, offers_data) {
			if (error) {
				console.log("Error with asin: " + asin + ". Error: " + error);
				return res.json({error: 'Error getting OfferFull response group'});
			}

			// handle updating the pricing for this object
			var prices = getPricingData(offers_data.Items.Item);
			newProductParams.price_amazon_new.push({price: prices.price_amazon_new, date: new Date()});
			newProductParams.price_third_new.push({price: prices.price_third_new, date: new Date()});
			newProductParams.price_third_used.push({price: prices.price_third_used, date: new Date()});
			newProductParams.offers_data = offers_data;

			var newProduct = new IndexedProduct(newProductParams);
			newProduct.save(function(error, newProduct){
				if (error) {
					console.log("Error with asin: " + asin + ". Error: " + error);
					return res.json({error: 'Error saving new item'});
				}
				res.json(newProduct);
			});
		});
	});
};

// given a variable 'youtubeVideo' and 'asin', add the link to the item
module.exports.AddProductVideo = function(req, res) {
	var asin = req.body.asin;
	var youtubeVideo  = req.body.youtubeVideo;
	IndexedProduct.findOne({asin: asin})
		.exec(function(err, product) {
			product.YoutubeVideo = youtubeVideo;
			product.save(function(err, result) {
				if (err) {
					res.status(500).send(err);
				}

				res.json(result);
			});
		});
}

// given an asin and array of links, set the UsefulLinks attribute
module.exports.AddProductLinks = function(req, res) {
	var asin = req.body.asin;
	var usefulLinks = req.body.usefulLinks;
	IndexedProduct.findOne({asin: asin})
		.exec(function(err, product) {
			product.UsefulLinks = usefulLinks;
			product.markModified('UsefulLinks')
			product.save(function(err, result) {
				if (err) {
					res.status(500).send(err);
				}

				res.json(result);
			});
		});
}

// given an asin and array of other prices, set the OtherPrices attribute
module.exports.AddProductOtherPrices = function(req, res) {
	var asin = req.body.asin;
	var otherPrices = req.body.otherPrices;
	IndexedProduct.findOne({asin: asin})
		.exec(function(err, product) {
			product.OtherPrices = otherPrices;
			product.markModified('OtherPrices')
			product.save(function(err, result) {
				if (err) {
					res.status(500).send(err);
				}

				res.json(result);
			});
		});
}

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
		case 'alphabetical':
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

// given a searchQuery, orderByValue, currentPage, and amountPerPage, find a set of items
// that matches the query
module.exports.GetSearchItems = function(req, res) {
	var searchQuery = req.query.searchQuery;
	var orderBy = req.query.orderByValue;

	// inclusive value
	var firstItem = (Number(req.query.currentPage) - 1) * Number(req.query.amountPerPage);

	switch(orderBy) {
		case 'relevance':
			// don't change
			break;
		case 'alphabetical':
			orderBy = 'large_data.ItemAttributes.Title';
			break;
		case 'price':
			// to do
			break;
		case 'popular':
			orderBy = '-page_views';
			break;
		case 'recent':
			orderBy = '-date_created';
			break;
	}

	var qArr = formatQuery(searchQuery);
	var conditions = { 'large_data.ItemAttributes.Title': {$in: qArr } };
	if (orderBy === 'relevance') { /* separate because no sorting */
		IndexedProduct.find(conditions)
			.limit(Number(req.query.amountPerPage) || 30)
			.skip(firstItem || 0)
			.exec(QueryResult);
	} else {
		IndexedProduct.find(conditions)
			.limit(Number(req.query.amountPerPage) || 30)
			.skip(firstItem || 0)
			.sort(orderBy)
			.exec(QueryResult);
	}

	function QueryResult(err, foundProducts) {
		if (err) {
			console.log("Error: " + err);
			return res.status(500).send("Error: " + err);
		}

		// get the total number of found products
		IndexedProduct.count(conditions, function(err, count) {
			if (err) {
				console.log("Error: " + err);
				return res.status(500).send("Error: " + err);
			}
			res.json({products: foundProducts, count: count});
		});
	}
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
