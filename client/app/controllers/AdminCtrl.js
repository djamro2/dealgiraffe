
'use strict';

var controllers = controllers || angular.module('Dealgiraffe.controllers', []);

controllers.controller('AdminController', ['$scope', 'DealService',
 function($scope, DealService){

	self.init = function(){

	};
	
	$scope.addDeal = function(asin){
		
		var dealInfo = {
			asin: asin
		};
		
		
		DealService.save(dealInfo, function(result){
		})
	}

	self.init();

}]);