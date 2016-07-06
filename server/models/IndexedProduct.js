
var mongoose = require('mongoose');
var textSearch = require('mongoose-text-search');

var IndexedProductSchema = mongoose.Schema({
    date_created: {type: Date, default: Date.now},
    last_time_updated: {type: Date, default: Date.now},
    page_views: Number,
    item_clicks: Number,
    asin: String,
    force_frontpage: Boolean,
    query: Object,
    large_data: Object,
    offers_data: Object,
    price_amazon_new: [{ price: Number, date: Date}],
    price_third_new: [{ price: Number, date: Date}],
    price_third_used: [{ price: Number, date: Date}]
});

IndexedProductSchema.plugin(textSearch);
IndexedProductSchema.index({ 'large_data.ItemAttributes.Title' : 'text'});

module.exports = mongoose.model('IndexedProduct', IndexedProductSchema)

