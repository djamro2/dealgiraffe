/* global angular */
/* global _ */

'use strict';

var controllers = controllers || angular.module('Dealgiraffe.controllers', []);

//TODO

//fix href path (look at old product)
//make list of deals on the admin panel, ability to delete deal
//look through program, look for bugs and security flaws
//publish! (sftp everything except node_modules, npm install, connect to correct mongodb, add my creds, delete those lines)

controllers.controller('DealgiraffeController', ['$scope', '$http', '$resource', '$location', '$document', '$anchorScroll', 'DealService',
 function($scope, $http, $resource, $location, $document, $anchorScroll, DealService){

	
	var self = this; //export variable (optional of course)
	var origDataArray;
	$scope.dealArray = [];
	$scope.messageSent = false;
	$scope.showExtra = false;
	
	var messagesSent = 0;

	var Message = $resource('/api/sendmessage');

	self.init = function(){
		
		//get all of the deals
		DealService.query(function(result){
			
			var data = {
				deals: result
			};
   			
			origDataArray = result;
			   
    		$scope.dealArray = result;
			
    		for(var i = 0; i < data.deals.length; i++){
				
				var dateAdded = data.deals[i].date;
				
				data.deals[i] = data.deals[i].deal;
				
				$scope.dealArray[i].hasSalePrice = false;
				
    			if(data.deals[i].Items.Item && !data.deals[i].isExpired){
					$scope.dealArray[i].isOpened = false;
					$scope.dealArray[i].dateAdded = dateAdded;
    				$scope.dealArray[i].Title = data.deals[i].Items.Item.ItemAttributes.Title;
					if($scope.dealArray[i].Title)
						$scope.dealArray[i].HrefPath = $scope.dealArray[i].Title.substring(0, 20);
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
		var result = _.sortByOrder(_array, 'Title', 'asc');
		return result;
	};
	
	self.bubbleSortPrice = function(_array){
		var result = _.sortByOrder(_array, 'RealPrice', 'asc');
		return result;
	};
	
	// sort by date
	self.bubbleSortNewest = function(_array){
		var result = _.sortByOrder(_array, 'dateAdded', 'desc');
		return result;
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