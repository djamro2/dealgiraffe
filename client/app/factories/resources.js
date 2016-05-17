
app.factory('ProductService', function($resource){
	return $resource('/api/deal', {}, {
		update: {method: 'PUT'},
		getAllProducts: {method: 'GET', url: '/api/GetAllProducts', isArray: true},
		GetProduct: {method: 'GET', url:'/api/GetProduct/:id', params: {id: '@Id'}, isArray: false}
	});
});