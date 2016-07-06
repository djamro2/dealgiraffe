/**
 * Created by djamr on 6/2/2016.
 */

var ProductController = require('./../controllers/ProductController');

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};

module.exports = function(app) {
    // return a specific product
    app.get('/api/GetProduct/:id', ProductController.GetProduct);

    // get all products within a specific ranged, with sorted by
    app.get('/api/GetProducts/:startpage/:endpage/:sortby', ProductController.GetProducts);

    // return all products
    app.get('/api/GetAllProducts', isAuthenticated, ProductController.GetAllProducts);

    // return the 24 most recent indexed items
    app.get('/api/GetHomepageProducts', ProductController.GetHomepageProducts);

    // return the 24 most recent indexed items for the graphics cards page
    app.get('/api/GetGraphicsPageProducts', ProductController.GetGraphicsPageProducts);

    // get general info about all db
    app.get('/api/GetAllProductInfo', isAuthenticated, ProductController.GetAllProductInfo);

    // given a searchQuery, currentPage, orderByValue, get a set of items
    app.get('/api/GetSearchItems', ProductController.GetSearchItems);

    // delete a product by id
    app.post('/api/DeleteProduct/:id', isAuthenticated, ProductController.DeleteProduct);

    // toggle the hide attribute of a product
    app.post('/api/HideProduct/:id', isAuthenticated, ProductController.HideProduct);

    // toggle the force_frontpage attribute of a product
    app.post('/api/ToggleFrontPageProduct', isAuthenticated, ProductController.ToggleFrontPageProduct);
};