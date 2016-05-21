/**
 * Created by Daniel on 5/19/2016.
 */

var aws = require('aws-lib');

var main        = require('./index.js');
var local_codes = require('../local_codes');

module.exports = function(app) {

    /*
     * Return the html page for the admin controls for the updater
     */
    app.get('/admin', function(req, res) {
        res.sendFile(__dirname + '/admin.html');
    });

    /*
     * Add the product item to the database
     */
    app.post('/addProductItem', function(req, res) {

        var asin = req.body.asin;

        main.add_to_products_index(asin, false, function(new_item){
            res.json(new_item);
        });
    });

    /*
     * For simple testing purposed
     */
    app.get('/sampleRequest/:asin', function(req, res){

        var prodAdv = aws.createProdAdvClient(local_codes.a, local_codes.b, local_codes.c);

        var params = {
            ResponseGroup: "Large",
            Keywords: 'Graphics Card',
            SearchIndex: 'PCHardware',
            ItemPage: 9
        };

        prodAdv.call("ItemSearch", params, function(err, item_response) {
            res.json(item_response);
        });

    });
    
};
