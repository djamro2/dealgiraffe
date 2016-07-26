
var ProductController = require('./../controllers/ProductController');

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};

module.exports = function(app) {
    app.post('/api/AddProductItem', isAuthenticated, ProductController.AddProductItem);
    app.post('/api/AddProductVideo', isAuthenticated, ProductController.AddProductVideo);
    app.post('/api/DeleteProduct/:id', isAuthenticated, ProductController.DeleteProduct);
    app.post('/api/HideProduct/:id', isAuthenticated, ProductController.HideProduct);
    app.post('/api/ToggleFrontPageProduct', isAuthenticated, ProductController.ToggleFrontPageProduct);
    app.post('/api/AddProductLinks', isAuthenticated, ProductController.AddProductLinks);

    app.get('/api/GetProduct/:id', ProductController.GetProduct);
    app.get('/api/GetProducts/:startpage/:endpage/:sortby', ProductController.GetProducts);
    app.get('/api/GetHomepageProducts', ProductController.GetHomepageProducts);
    app.get('/api/GetGraphicsPageProducts', ProductController.GetGraphicsPageProducts);
    app.get('/api/GetSearchItems', ProductController.GetSearchItems);
    app.get('/api/GetAllProductInfo', isAuthenticated, ProductController.GetAllProductInfo);
    app.get('/api/GetAllProducts', isAuthenticated, ProductController.GetAllProducts);
};