
var aws = require('aws-lib');

var local_codes = require('../../local_codes');
var IndexedProduct = require('../models/IndexedProduct');

/*
 * back-end function to parse through a product and make the important info easily accessible
 */
var get_product_parameters = function(product) {

	product.title = product.raw_data.ItemAttributes.Title;
	product.price_new_formatted = product.raw_data.OfferSummary.LowestNewPrice.FormattedPrice;
	product.editorial_review = product.raw_data.EditorialReviews.EditorialReview.Content;
	product.features = product.raw_data.ItemAttributes.Feature;

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
