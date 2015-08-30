
'use strict';

var controllers = controllers || angular.module('Dealgiraffe.controllers', []);

controllers.controller('AdminController', ['$scope', 'DealService', '$window',
 function($scope, DealService, $window){

	self.init = function(){

		$scope.allDeals = DealService.query(function(result){
			console.log(result);
		});

	};
	
	$scope.addDeal = function(asin){
		
		var dealInfo = {
			asin: asin
		};
		
		DealService.save(dealInfo, function(result){
		})
	};
	
	$scope.removeDeal = function(deal){
		DealService.removeDeal({id: deal._id}, deal, function(result){
			//$window.location.href = '';
		});
	}

	self.init();

}]);