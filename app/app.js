
//To start xampp do, /opt/lampp/lampp start (to stop replace start with stop)

var app = angular.module('Dealgiraffe', ['ngResource']);

app.controller('DealgiraffeController', ['$scope', '$http', '$resource',
 function($scope, $http, $resource){

	//vm is the exports variable for this controller
	var vm = this;

	vm.init = function(){

		$http.get('master_deals.json').success(function(data) {
    		console.log('Success loading master_deals.json');
    		console.log(data.deals);
    		vm.dealArray = data.deals;
    		for(var i = 0; i < data.deals.length; i++){
    			if(data.deals[i].Items.Item){
    				vm.dealArray[i].Title = data.deals[i].Items.Item.ItemAttributes.Title;
    				vm.dealArray[i].RealPrice = data.deals[i].Items.Item.Offers.Offer.OfferListing.Price.FormattedPrice;
    				vm.dealArray[i].ThumbnailImage = data.deals[i].Items.Item.MediumImage.URL;
    			} else {
    				vm.dealArray[i].invalidItem = true;
    			}
    		}
		});

		//TEMPDATA
		vm.pages = [1,2,3,4,5];
		vm.pagesToClick = vm.pages.reverse();

	};

	vm.init();

}]);