/* global process */
/* global __dirname */

var express =        require('express'),
    bodyParser =     require('body-parser'),
    HomeController = require('./server/controllers/HomeController'),
    local_codes =    require('./local_codes'),
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
}

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/client', express.static(__dirname + '/client'));
  
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

//send the message to me (code in HomeController)
app.post('/api/sendmessage', HomeController.send);

