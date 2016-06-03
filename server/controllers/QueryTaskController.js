
var QueueTask = require('../models/QueueTask');
var IndexedProduct = require('../models/IndexedProduct');

// add a new queue item to the database
module.exports.AddQueueItem = function(req, res) {
    var newItems = {
        searchQuery: req.body.searchQuery,
        searchIndex: req.body.searchIndex,
        category: req.body.category
    };
    var newTask = new QueueTask(newItems);
    newTask.save(function(err, response) {
        if (err) {
            console.log("Error saving new queue task: " + err);
            return res.status(500).send(err);
        }
        res.send(response);
    });
};

// get all queue items
module.exports.GetAllQueueItems = function(req, res) {
    QueueTask.find({})
        .sort('lastRunTime')
        .exec(function(err, tasks) {
            if (err) {
                console.log("Error finding all tasks: " + err);
                return res.status(500).send(err);
            }
            res.send(tasks);
        });
}

// delete a queue items
module.exports.DeleteQueueItem = function(req, res) {
    var id = req.body.id;
    QueueTask.findOne({_id:id})
        .exec(function(err, item) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            item.remove(function(err, final_item){
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                }
                res.json(final_item);
            });
        });
};

// set the paused field to true
module.exports.TogglePauseQueueItem = function(req, res) {
    var id = req.body.id;
    QueueTask.findOne({_id:id})
        .exec(function(err, item) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            item.paused = !item.paused;
            item.save(function(err, final_item){
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                }
                res.json(final_item);
            });
        });
};

// given a certain product title, use that for one cycle
module.exports.PrioritizeProduct = function(req, res) {
    IndexedProduct.findOne({_id: req.body.id})
        .exec(function(err, product) {

            if (err) {
                console.log('Error finding product: ' + err);
                return res.status(500).send(err);
            }

            if (!product.query) {
                console.log('No query in product item');
                return res.status(500).send('No query in product item: ' + product.query);
            }

            var newParams = {
                searchQuery: product.large_data.ItemAttributes.Title,
                searchIndex: product.query.searchIndex,
                category: product.query.category,
                temp: true
            };
            var newQuery = new QueueTask(newParams);
            newQuery.save(function(err, response) {
                if (err) {
                    console.log("Error saving new queue task: " + err);
                    return res.status(500).send(err);
                }
                res.send(response);
            });
        });
};

// restart the updater instance through the command line
module.exports.RestartUpdater = function(req, res) {
    // TODO
};