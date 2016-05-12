/**
 * Created by Daniel on 5/11/2016.
 */

var mongoose = require('mongoose');

module.exports = mongoose.model('IndexedProduct',{
    date_created: {type: Date, default: Date.now},
    last_time_updated: {type: Date, default: Date.now},
    asin: String,
    hidden: Boolean,
    force_frontpage: Boolean,
    page_views: Number,
    raw_data: Object,
    price: [{ price: String, date: Date}],
    rank: [{ rank: String, data: Date}]
});
