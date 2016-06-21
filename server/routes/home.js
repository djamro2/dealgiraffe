/**
 * Created by djamr on 6/2/2016.
 */

var path = require('path');

module.exports = function(app) {
    // home page
    app.get('/', function (req, res) {
        res.sendFile(path.resolve(__dirname + '/../../client/views/home.html'));
    });
};