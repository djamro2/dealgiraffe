
var IndexedProduct = require('../models/IndexedProduct');

var getProductDbSize = function(callback) {
    IndexedProduct.collection.stats(function(err, response){
        if (err) {
            return callback(err);
        }
        return callback(null, response.size);
    })
};

module.exports = getProductDbSize;