/* global process */
/* global __dirname */

var express        = require('express'),
    bodyParser     = require('body-parser'),
    HomeController = require('./server/controllers/HomeController'),
    local_codes    = require('./local_codes'),
    passport       = require('passport'),
    LocalStrategy  = require('passport-local').Strategy,
    mongoose       = require('mongoose'),
    expressSession = require('express-session'),
    bCrypt         = require('bcrypt-nodejs'),
    app = express();
    
var isProduction = false;

if (isProduction)
{
  //PRODUCTION 
  var server = app.listen(local_codes.port, local_codes.internal_ip, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
  });
}
else
{
  //DEVELOPMENT
  var server = app.listen(8000, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
  });
  mongoose.connect('mongodb://localhost/MyDatabase');
}

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(expressSession({
  secret: 'mySecretKey',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

app.use('/client', express.static(__dirname + '/client'));

// Initialize Passport
var initPassport = require('./server/passport/init');
initPassport(passport);

//routing (will be moved to it's own file later)
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

app.get('/adminlogin', function(req, res){
  res.sendFile(__dirname + '/client/app/views/admin.html');
});

app.post('/api/sendmessage', HomeController.send);

/* Handle Login POST */
app.post('/login', passport.authenticate('login', {
  successRedirect: '/admin',
  failureRedirect: '/',
  failureFlash : true 
}));

app.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');
});

app.get('/loginSuccess', function(req, res, next) {
  res.send('Successfully authenticated');
});

// As with any middleware it is quintessential to call next()
// if the user is authenticated
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

app.get('/admin', isAuthenticated, function(req, res){
  res.send('Admin signed in! ' + req.user );
});
 
