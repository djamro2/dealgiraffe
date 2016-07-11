
// global resources 
var express        = require('express');
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var passport       = require('passport');
var expressSession = require('express-session');
var flash          = require('connect-flash');
var handlebars     = require('express-handlebars');

// local resources
var initPassport   = require('./server/passport/init');
var app            = express();

// open server for listening
var port = process.env.DEALGIRAFFE_PORT || 3000;
var internalIP = process.env.INTERNAL_IP || 'localhost';
var server = app.listen(port, internalIP, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('DealGiraffe listening at http://%s:%s', host, port);
});

// connect to mongodb
mongoose.connect('mongodb://localhost/DealGiraffe');

// Serve hot-reloading bundle to client with webpack hot loading
if (process.env.NODE_ENV !== 'production') {
    var webpack = require('webpack');
    var config = require('./webpack.config');
    var compiler = webpack(config);
    app.use(require("webpack-dev-middleware")(compiler, {
        noInfo: true, publicPath: config.output.publicPath
    }));
    app.use(require("webpack-hot-middleware")(compiler));
}

// middleware - json responses
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// middleware - passport
app.use(expressSession({
    secret: 'mySecretKey',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session and displaying in templates
app.use(flash());

// static files
app.use('/client', express.static(__dirname + '/client'));
app.use(express.static(__dirname + '/client'));

// Initialize Passport
initPassport(passport);

// routing (needs to be after middleware)
require('./server/routes/admin')(app);
require('./server/routes/pages')(app);
require('./server/routes/productItem')(app);
require('./server/routes/queryItem')(app);
