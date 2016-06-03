
var IndexedProduct = require('../models/IndexedProduct');

var getProductDbInfo = function(callback) {
    IndexedProduct.find({})
        .sort('-last_time_updated')
        .exec(function(err, allItems) {
            if (err) {
                return callback(err);
            }
            if (!allItems || allItems.length == 0) {
                return callback("No items in DB");
            }
            return callback(null, allItems.length, allItems[0].last_time_updated);
        });
};

module.exports = getProductDbInfo;