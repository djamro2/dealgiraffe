
var mongoose = require('mongoose');

module.exports = mongoose.model('IndexedProduct', {
    date_created: {type: Date, default: Date.now},
    last_time_updated: {type: Date, default: Date.now},
    page_views: Number,
    item_clicks: Number,
    asin: String,
    YoutubeVideo: String,
    UsefulLinks: [{title: String, url: String}],
    force_frontpage: Boolean,
    query: Object,
    large_data: Object,
    offers_data: Object,
    price_amazon_new: [{ price: Number, date: Date}],
    price_third_new: [{ price: Number, date: Date}],
    price_third_used: [{ price: Number, date: Date}]
});

