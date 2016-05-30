
var aws = require('aws-lib');

var local_codes = require('../../local_codes');
var IndexedProduct = require('../models/IndexedProduct');
var getProductDbSize = require('./../lib/getProductDbSize');
var getProductDbInfo = require('./../lib/getProductDbInfo');

/*
 * back-end function to parse through a product and make the important info easily accessible
 */
var get_product_parameters = function(product) {
	var large_data = product.large_data;
	product.title               = large_data.ItemAttributes.Title;
	product.price_new_formatted = large_data.OfferSummary.LowestNewPrice.FormattedPrice;
	product.editorial_review    = large_data.EditorialReviews.EditorialReview.Content;
	product.features            = large_data.ItemAttributes.Feature;
	product.string_data         = JSON.stringify(product);
	return product;
};

/*
 * Use asin to find an indexed product and set hidden to true
 */
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

/*
 * Use asin to find an indexed product and set hidden to true
 */
module.exports.ForceFrontPageProduct = function(req, res) {

	var asin = req.params.id;

	IndexedProduct.findOne({asin:asin})
		.exec(function(err, result){

			if (err) {
				console.log("Error: " + err);
				res.send("Error: " + err);
				return;
			}

			result.force_frontpage = true;

			result.save(function(err, final_result){
				res.json(final_result);
			});

		});

};

/*
 * Use asin to retrieve an indexed product
 */
module.exports.GetProduct = function(req, res) {

	var asin = req.params.id;

	IndexedProduct.findOne({asin:asin})
		.exec(function(err, result){

			if (err) {
				console.log("Error: " + err);
				res.send("Error: " + err);
				return;
			}

			res.json(result);
		});

};

/*
 * Return all of the indexed products
 */
module.exports.GetAllProducts = function(req, res) {

	IndexedProduct.find({})
		.exec(function(err, result){
				
			if (err) {
				console.log("Error: " + err);
				res.send("Error: " + err);
				return;
			}
	
			res.json(result);
	});

};

/*
 * Returns an object contains info and stats about the db
 */
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

			return res.json(result);
		});
	});

};

/*
 * Use asin to find an indexed product and set hidden to true
 */
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

/*
 * Render the product page using express handlebars
 */
module.exports.ProductPage = function(req, res) {

	var id = req.params.id;
	
	IndexedProduct.findOne({asin: id})
		.exec(function(err, result){

			product = get_product_parameters(result);

			res.render('product_content', product);

		});

};
