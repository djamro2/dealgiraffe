

var nodemailer = require('nodemailer');

var local_codes = require('../../local_codes');

/*
 * Send over email to myself using nodemailer
 * Not completely tested
 */
module.exports.SendEmail = function(req, res){
	
	//nodemailer stuff
	var transporter = nodemailer.createTransport({
	    service: 'gmail',
	    auth: {
	        user: 'dealgiraffe@gmail.com',
	        pass: local_codes.d //TODO
	    }
	});
	
	var mailOptions = {
	  	to: 'dealgiraffe@gmail.com',
	  	subject: 'URL submit',
	  	text: req.body.url
	};

	// send the actual email
	transporter.sendMail(mailOptions, function(error, info){

		if(error){
			return console.log(error);
		}

		res.send(req.body);
	});
	
};
