/**
 * Created by djamr on 6/2/2016.
 */

var path = require('path');
var HomeController = require('./../controllers/HomeController');

module.exports = function(app) {

    // home page
    app.get('/', function (req, res) {
        res.sendFile(path.resolve(__dirname + '/../../client/index.html'));
    });

    // send email to myself
    app.post('/api/SendEmail', HomeController.SendEmail);

};