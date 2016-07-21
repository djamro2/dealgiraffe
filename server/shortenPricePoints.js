
// connect to mongodb
var mongoose       = require('mongoose');
mongoose.connect('mongodb://localhost/DealGiraffe');

var IndexedProduct = require('../server/models/IndexedProduct');

// given the prices array, find the correct items to remvoe
var removeDuplicates = function(prices) {
    return prices.filter(function(price, i) {
        // keep the first and last
        if (i === 0 || i === (prices.length -1)) {
            return true;
        }
        return (prices[i].price !== prices[i-1].price);
    });
};

var runRemoval = function() {
    IndexedProduct.find({}, function(error, products) {
        if (error) {
            return console.log('Error: ' + JSON.stringify(error));
        }

        // products is all the products in the database
        products.forEach(function(product, i) {
            // update price arrays
            console.log('Before run: '  + product.price_amazon_new);
            product.price_amazon_new = removeDuplicates(product.price_amazon_new);
            console.log('After run: '  + product.price_amazon_new);
            product.price_third_new = removeDuplicates(product.price_third_new);
            product.price_third_used = removeDuplicates(product.price_third_used);

            // mongodb requires to mark modified arrays
            product.markModified('price_amazon_new');
            product.markModified('price_third_new');
            product.markModified('price_third_used');

            // save
            product.save(function(error, finalProduct) {
                if (error) {
                    return console.log('Error: ' + JSON.stringify(error));
                }
                console.log('Product Updated!');
            });
        });
    });
};

// utility script to remove price points that are the same
runRemoval();