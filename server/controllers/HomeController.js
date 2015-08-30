

var nodemailer = require('nodemailer');
var local_codes = require('../../local_codes')

var emailsSent = 0;

setTimeout(function(){
	emailsSent = 0;	
}, 300000);

module.exports.send = function(req, res){
	//for now, just see what I sent over to the back-end
	//console.log(req.body.url);
	
	//nodemailer stuff
	var transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: {
	    user: 'dealgiraffe@gmail.com',
	    pass: local_codes.d
	  }
	});
	
	var mailOptions = {
	  to: 'dealgiraffe@gmail.com',
	  subject: 'URL submit',
	  text: req.body.url
	};
	
	//only send if there were less than 15 sends per 5 minutes
	if(emailsSent < 10){
		transporter.sendMail(mailOptions, function(error, info){
			emailsSent++;
		    console.log('functon called!');
		    if(error){
		        return console.log(error);
		    }
		    console.log('Message sent: ' + info.response);
		
		});	
	}
	
	res.send(req.body); //last thing, need this to go full circle
	
};
