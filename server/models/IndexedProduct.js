/**
 * Created by Daniel on 5/11/2016.
 */

var mongoose = require('mongoose');

module.exports = mongoose.model('IndexedProduct',{
    date_created: {type: Date, default: Date.now},
    last_time_updated: {type: Date, default: Date.now},
    asin: String,
    category: String,
    hidden: Boolean,
    force_frontpage: Boolean,
    page_views: Number,
    raw_data: Object,
    price_new: [{ price: Number, date: Date}],
    rank: [{ rank: Number, date: Date}]
});
