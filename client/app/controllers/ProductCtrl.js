/**
 * Created by Daniel on 5/16/2016.
 */

'use strict';

app.controller('ProductController', ['$scope', 'ProductService', function($scope, ProductService){

    self.init = function(){
        // nothing right now
    };

    // Does the work of parsing through a product and assigning relevant fields to the scope
    self.getProductParameters = function(product) {
        $scope.main_image = product.large_data.LargeImage.URL;
    };

    // Based off of the input asin, return the indexed product
    // Called from express-handlebars. Repetitive, but makes things easier down the road
    $scope.get_product_info = function(asin) {
        $scope.asin = asin;
        ProductService.GetProduct({id: asin}, function(product) {
            self.getProductParameters(product);
            initGraphData(product); /* init d3 graph */
        });
    };

    // Input date and format, return formatted data
    $scope.formatDateTime  = function(datetime, format) {
        if (!datetime) return;
        return moment( new Date(datetime)).format(format);
    };

    self.init();
}]);
