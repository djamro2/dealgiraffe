/**
 * Created by djamr on 6/2/2016.
 */

var QueryTaskController = require('./../controllers/QueryTaskController');

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};

module.exports = function(app) {
    // in case updater stops, restart from new instance
    app.post('/restartUpdater', isAuthenticated, QueryTaskController.RestartUpdater);

    // return all of the queue items in the db
    app.get('/api/GetAllQueueItems', isAuthenticated, QueryTaskController.GetAllQueueItems);

    // add a new query item
    app.post('/api/AddQueueItem', isAuthenticated, QueryTaskController.AddQueueItem);

    // delete a query item
    app.delete('/api/DeleteQueueItem', isAuthenticated, QueryTaskController.DeleteQueueItem);

    // toggle the pause attribute
    app.post('/api/TogglePauseQueueItem', isAuthenticated, QueryTaskController.TogglePauseQueueItem);

    // make a new query so a certain is found
    app.post('/api/PrioritizeProduct',  isAuthenticated, QueryTaskController.PrioritizeProduct);
};
