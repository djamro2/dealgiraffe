/**
 * Created by Daniel on 5/14/2016.
 */

var passport = require('passport');
var path     = require('path');

var HomeController      = require('./controllers/HomeController');
var ProductController   = require('./controllers/ProductController');
var QueueTaskController = require('./controllers/QueueTaskController');

/*
 * Check to see if the current user has an authentication cookie
 */
var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
};


module.exports = function(app) {

    /* static files */

    app.get('/', function (req, res) {
        res.sendFile(path.resolve(__dirname + '/../client/index.html'));
    });

    // TODO: add back in authentication
    app.get('/admin', function(req, res){
        res.sendFile(path.resolve(__dirname + '/../client/app/views/admin_react.html'));
    });

    app.get('/adminlogin', function(req, res){
        res.sendFile(__dirname + '/../client/app/views/adminlogin.html');
    });

    app.get('/admin/ViewAllItems', function(req, res){
        res.sendFile(__dirname + '/../client/app/views/admin_view_all_items.html');
    });

    app.get('/product/:id', ProductController.ProductPage);

    /* admin routes */

    app.get('/loginFailure', function(req, res, next) {
        res.send('Failed to authenticate');
    });

    app.get('/loginSuccess', function(req, res, next) {
        res.send('Successfully authenticated');
    });

    app.post('/login', passport.authenticate('login', {
        successRedirect: '/admin',
        failureRedirect: '/',
        failureFlash : true
    }));

    /* API routes */
    app.post('/api/SendEmail', HomeController.SendEmail);
    app.get('/api/GetAllProducts', ProductController.GetAllProducts);
    app.get('/api/GetAllProductInfo', ProductController.GetAllProductInfo);
    app.get('/api/GetProduct/:id', ProductController.GetProduct);
    app.post('/api/DeleteProduct/:id', ProductController.DeleteProduct);
    app.post('/api/HideProduct/:id', ProductController.HideProduct);
    app.post('/api/ForceFrontPageProduct/:id', ProductController.ForceFrontPageProduct);
    app.get('/api/GetAllQueueItems', QueueTaskController.GetAllQueueItems);
    app.post('/api/AddQueueItem', QueueTaskController.AddQueueItem);
    app.delete('/api/DeleteQueueItem', QueueTaskController.DeleteQueueItem);
    app.post('/api/TogglePauseQueueItem', QueueTaskController.TogglePauseQueueItem);
};