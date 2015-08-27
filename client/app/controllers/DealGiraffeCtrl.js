
'use strict';

var controllers = controllers || angular.module('Dealgiraffe.controllers', []);

controllers.controller('DealgiraffeController', ['$scope', '$http', '$resource', '$location', '$document', '$anchorScroll',
 function($scope, $http, $resource, $location, $document, $anchorScroll){

	
	var self = this; //export variable (optional of course)
	var origDataArray;
	$scope.dealArray = [];
	$scope.messageSent = false;
	$scope.showExtra = false;
	
	var messagesSent = 0;

	var Message = $resource('/api/sendmessage');

	self.init = function(){

		$http.get('/client/master_deals.json').success(function(data) {
   			
			origDataArray = data.deals;
			   
    		$scope.dealArray = data.deals;
    		for(var i = 0; i < data.deals.length; i++){
				$scope.dealArray[i].hasSalePrice = false;
    			if(data.deals[i].Items.Item && !data.deals[i].isExpired){
					$scope.dealArray[i].isOpened = false;
    				$scope.dealArray[i].Title = data.deals[i].Items.Item.ItemAttributes.Title;
					if(data.deals[i].hrefPath)
						$scope.dealArray[i].HrefPath = data.deals[i].hrefPath;
					else 
						$scope.dealArray[i].HrefPath = data.deals[i].Id;
					if(data.deals[i].isExpired)
						$scope.dealArray[i].isExpired = data.deals[i].isExpired;
					else
						$scope.dealArray[i].isExpired = false;
    				if ($scope.dealArray[i].Title)
						$scope.dealArray[i].Title = self.shortenTitle($scope.dealArray[i].Title);
					if (data.deals[i].Items.Item && data.deals[i].Items.Item.Offers && data.deals[i].Items.Item.Offers.Offer){
						$scope.dealArray[i].RealPrice = data.deals[i].Items.Item.Offers.Offer.OfferListing.Price.FormattedPrice;
						$scope.dealArray[i].OriginalPrice = (Number(data.deals[i].Items.Item.Offers.Offer.OfferListing.AmountSaved.Amount) + Number(data.deals[i].Items.Item.Offers.Offer.OfferListing.Price.Amount)) / 100;
						$scope.dealArray[i].PercentSaved = data.deals[i].Items.Item.Offers.Offer.OfferListing.PercentageSaved;
						if (data.deals[i].Items.Item.Offers.Offer.OfferListing && data.deals[i].Items.Item.Offers.Offer.OfferListing.SalePrice){
							$scope.dealArray[i].hasSalePrice = true;
							$scope.dealArray[i].SalePrice = data.deals[i].Items.Item.Offers.Offer.OfferListing.SalePrice.Amount;
							$scope.dealArray[i].SalePrice = $scope.dealArray[i].SalePrice / 100;
						}
					}
					$scope.dealArray[i].ThumbnailImage = data.deals[i].Items.Item.MediumImage.URL;
    				$scope.dealArray[i].ProductDescription = data.deals[i].Items.Item.EditorialReviews.EditorialReview.Content;
					$scope.dealArray[i].Features = [];
					if(data.deals[i].Items.Item.ItemAttributes.Feature){
						$scope.dealArray[i].Features = data.deals[i].Items.Item.ItemAttributes.Feature;
						self.spliceFeatures($scope.dealArray[i].Features, i);
					}
					$scope.dealArray[i].URL = data.deals[i].Items.Item.DetailPageURL;
					$scope.dealArray[i].SalesRank = data.deals[i].Items.Item.SalesRank;
					if (data.deals[i].Items.Item && data.deals[i].Items.Item.SimilarProducts){
						$scope.dealArray[i].SimilarProducts = data.deals[i].Items.Item.SimilarProducts.SimilarProduct;
						for(var j = 0; j < $scope.dealArray[i].SimilarProducts.length; j++){
							var str_length = $scope.dealArray[i].SimilarProducts[j].Title.length;
							$scope.dealArray[i].SimilarProducts[j].Title = $scope.dealArray[i].SimilarProducts[j].Title.substring(0, 140);
							if (str_length > 140){
								$scope.dealArray[i].SimilarProducts[j].Title = $scope.dealArray[i].SimilarProducts[j].Title + "...";
							}
						}
					}
					//$scope.dealArray[i].EditorialReview = data.deals[i].Items.Item.EditorialReviews.EditorialReview.Content;
				} else {
    				$scope.dealArray[i].invalidItem = true;
    			}
    		}
			
			//have the dealArray sorted by Newest
			$scope.dealArray = self.bubbleSortNewest($scope.dealArray);	
			
			//make the info box larger if needed
			self.checkPathInfoBox($location.path());
			
		});

		//TEMPDATA
		$scope.pages = [1]; 
		$scope.pagesToClick = [5,4,3,2,1];

	};
	
	self.bubbleSortAlpha = function(_array){
	    var swapped;
		var array = _array;
	    do {
	        swapped = false;
	        for (var i=0; i < array.length-1; i++) {
				if(!array[i].Title)
					array[i].Title = "zzzzzzz";
				if (!array[i + 1].Title)
					array[i+1].Title = "zzzzzzz";
				var name_a = array[i].Title;
				var name_b = array[i+1].Title;
	            if (name_a > name_b) {
	                var temp = array[i];
	                array[i] = array[i+1];
	                array[i+1] = temp;
	                swapped = true;
	            }
	        }
	    } while (swapped);
		return array;
	};
	
	self.bubbleSortPrice = function(_array){
	    var swapped;
		var array = _array;
	    do {
	        swapped = false;
	        for (var i=0; i < array.length-1; i++) {
				if(!array[i].RealPrice)
					array[i].RealPrice = "9999";
				if (!array[i + 1].RealPrice)
					array[i+1].RealPrice = "9999";
				var price_a = Number(array[i].RealPrice.replace(/[^0-9\.]+/g,""));
				var price_b = Number(array[i+1].RealPrice.replace(/[^0-9\.]+/g,""));
	            if (price_a > price_b) {
	                var temp = array[i];
	                array[i] = array[i+1];
	                array[i+1] = temp;
	                swapped = true;
	            }
	        }
	    } while (swapped);
		return array;
	};
	
	// I don't need the time in this case, I can sort by Id
	// with the highest Id first
	self.bubbleSortNewest = function(_array){
	    var swapped;
		var array = _array;
	    do {
	        swapped = false;
	        for (var i=0; i < array.length-1; i++) {
				if(!array[i].Id && array[i].Id != 0)
					array[i].Id = -9999;
				if (!array[i + 1].Id && array[i+1].Id != 0)
					array[i+1].Id = -9999;
				var id_a = array[i].Id;
				var id_b = array[i+1].Id;
	            if (id_a < id_b) {
	                var temp = array[i];
	                array[i] = array[i+1];
	                array[i+1] = temp;
	                swapped = true;
	            }
	        }
	    } while (swapped);
		return array;
	};
	
	//get the path and see if I need to make any truuuuue
	self.checkPathInfoBox = function(path){
		//go through dealArray
		for(var i = 0; i < $scope.dealArray.length; i++){
			var dealPath = "/" + String($scope.dealArray[i].HrefPath); 
			if(path == dealPath){
				$scope.dealArray[i].isOpened = true;
				$location.hash($scope.dealArray[i].HrefPath); //scroll to the correct div
			}
		}
		
	};
	
	//take all of the features and splice into top 4 and another 7 after that
	//will need later in default info and more info
	self.spliceFeatures = function(features, idx){
		$scope.dealArray[idx].TopFourFeatures = [];
		$scope.dealArray[idx].BottomSevenFeatures = [];
		for(var i = 0; i < features.length; i++){
			if(i < 3){
				$scope.dealArray[idx].TopFourFeatures.push(features[i]);
			} else if (i < 11) {
				$scope.dealArray[idx].BottomSevenFeatures.push(features[i]);
			}	
		}
	};
	
	$scope.changeSort = function(){
		
		var sortType = $scope.sortBy;
		
		if (sortType == 0 || sortType == "0"){
			$scope.dealArray = self.bubbleSortNewest($scope.dealArray);	
		} else if (sortType == 1 || sortType == "1"){
			$scope.dealArray = self.bubbleSortAlpha($scope.dealArray);	
		} else if (sortType == 2 || sortType == '2'){
			$scope.dealArray = self.bubbleSortPrice($scope.dealArray);
		}
		
	};
	
	$scope.changePath = function(path){
		$location.path(path);
	};
	
	/*
	This function will send an email to myself (pretty dope stuff). This is how it works:
	html calls this function passing in model from input, where that model stoes the url
	here, we make that into a $resource object, give it some parameters and call $save
	$save will post to /api/sendmessage where express will take the req and use nodemailer
	need to keep in mind to res.send to go full circle
	*/
	$scope.sendMessage = function(_message){
		
		if (messagesSent >= 5)
			return;
		
		var message = new Message();
		message.url = _message;
		if (_message && message != ""){
			message.$save(function(result){
				$scope.messageSent = true;
			});
		}
		
		messagesSent++;
	
	};

	self.shortenTitle = function(title){
		var result = title;
		if (title.length > 200){
			result = title.substring(0, 200);
			result = result + "...";
		}
		return result;
	}

	self.init();

}]);