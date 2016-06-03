
var path = require('path');
var passport = require('passport');

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};

module.exports = function(app) {

    // login to the admin panel
    app.get('/login', function(req, res){
        res.sendFile(path.resolve(__dirname + '/../../client/views/login.html'));
    });

    // return static admin panel
    app.get('/admin', isAuthenticated, function(req, res){
        res.sendFile(path.resolve(__dirname + '/../../client/views/admin.html'));
    });

    // POST request to login
    app.post('/login', passport.authenticate('login', {
        successRedirect: '/admin',
        failureRedirect: '/login?fail=1',
        failureFlash : true
    }));

};
