
var path = require('path');

module.exports = function(app) {
    var staticPages = ['/', '/contact', '/search', '/graphicscards', '/home'];
    staticPages.map(function(page) {
        app.get(page, function (req, res) {
            page === '/' ? page = '/home' : true;
            res.sendFile(path.resolve(__dirname + '/../../client/views' + page + '.html'));
        });
    });
};