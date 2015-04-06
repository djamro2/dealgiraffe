
/*
* Things to do next
* Build simple, usable front-end 
* ^Should I need some seed data first??
*
*/

var express = require('express'),
	mongoose = require('mongoose'),
	app = express();

app.listen(3000);

//static files to use
app.use('/scripts', express.static(__dirname + '/client/scripts'));
app.use('/css', express.static(__dirname + '/client/css'));
app.use('/app', express.static(__dirname + '/client/app'));

//home page, set to index.html
app.get('/', function(req,res){
	res.sendFile(__dirname + '/client/app/views/index.html');
});

