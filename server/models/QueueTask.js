var mongoose = require('mongoose');

module.exports = mongoose.model('QueueTask',{
    searchQuery: String,
    searchIndex: String,
    category: String,
    currentPage: {type: Number, default: 1},
    priority: {type: Number, default: 0},
    paused: {type: Boolean, default: false},
    temp: {type: Boolean, default: false},
    lastRunTime: {type: Date, default: new Date(0)}
});
