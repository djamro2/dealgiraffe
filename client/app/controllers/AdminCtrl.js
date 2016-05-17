
'use strict';

app.controller('AdminController', ['$scope', 'ProductService', function($scope, ProductService){

	self.init = function(){

		// get all of the deals in the database
		ProductService.getAllProducts(function(response){
			$scope.products = response;
		});

	};

	/*
	 * Input date and format, return formatted data
	 */
	$scope.formatDateTime  = function(datetime, format) {
		if (!datetime) return;
		return moment( new Date(datetime)).format(format);
	};

	/*
	 * Helper function to obtain the current price from a product item
	 * Returns as amount in cents
	 */
	$scope.getCurrentPrice = function(product) {

		var prices = product.price_new;

		if (!prices) {
			return -1;
		}

		// set other info as well
		product.total_pricepoints = prices.length;
		product.latest_update_time = prices[prices.length - 1].date;

		var price = prices[prices.length - 1].price;
		price /= 100;

		return price;
	};

	/*
	 * Used when I want to see the difference between the current time and the latest_update_time
	 */
	$scope.getDateTimeDifference = function(latest_update_time) {

		var now  = moment();
		var then = moment( new Date(latest_update_time));

		var duration = now.diff(then);
		var formatted = moment.duration(duration, "ms").format("HH:mm:ss");

		return formatted;
	};

	self.init();

}]);