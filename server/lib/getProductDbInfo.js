
var IndexedProduct = require('../models/IndexedProduct');

var getProductDbInfo = function(callback) {
    IndexedProduct.find({})
        .sort('-last_time_updated')
        .limit(2)
        .exec(function(err, allItems) {
            if (err) {
                return callback(err);
            }
            if (!allItems || allItems.length == 0) {
                return callback("No items in DB");
            }

            IndexedProduct.count({}, function(err, count) {
                if (err) {
                    return callback(err);
                }
                return callback(null, count, allItems[0].last_time_updated);
            });
        });
};

module.exports = getProductDbInfo;