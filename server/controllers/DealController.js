
var aws = require('aws-lib');
var local_codes = require('../../local_codes');
var Deal = require('../models/deal');

module.exports.addDeal = function(req, res){
	
	var prodAdv = aws.createProdAdvClient(local_codes.a, 
								  local_codes.b, 
								  local_codes.c);
								
	prodAdv.call("ItemLookup", {ResponseGroup: "Large", 
							    IdType: "ASIN",
							    ItemId: req.body.asin}, function(err, result) {
									
		var deal = new Deal({deal: result, asin: req.body.asin});
		
		deal.save(function(err, result){
			//console.log('deal saved');
		});
		
	});
	
	//send something back
	res.json(req.body);
	
}

module.exports.getAllDeals = function(req, res)
{
	
	Deal.find({}, function(err, result){
		
		res.json(result);
		
	});

}

module.exports.removeDeal = function(req, res)
{
	
	var id = req.params.id;
	
	Deal.find({ _id: id}).remove().exec(function(err, result){
		res.json(result);
	});

}