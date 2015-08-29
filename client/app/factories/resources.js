/* global angular */
var factories = factories || angular.module('Dealgiraffe.factories', []);

factories.factory('DealService', function($resource){
	return $resource('/api/deal', {}, {
		update: {method: 'PUT'}
	});
});