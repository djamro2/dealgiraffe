var mongoose = require('mongoose');

module.exports = mongoose.model('Deal',{
	deal: Object,
	asin: String,
	date: {type: Date, default: Date.now}
});