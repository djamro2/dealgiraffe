/**
 * Created by djamr on 6/2/2016.
 */

var ProductController = require('./../controllers/ProductController');

module.exports = function(app) {
    // product page
    app.get('/product', ProductController.ProductPage);
};