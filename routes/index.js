var comments = require('../lib/comments');

/**
 * Creates the routes for the given express application.
 *
 * @param app - the express application
 * @param nconf - the configuration settings
 */
module.exports = function(app, nconf) {
  // to add a comment
  app.post('/comments', function(request, response) {
    var name = request.body.name;
    var message = request.body.message;
    response.set('Access-Control-Allow-Origin', '*');

    // parameter validation
    if (!request.body.name || !request.body.message ||
        typeof(request.body.name) !== 'string' ||
        typeof(request.body.message) !== 'string') {
      response.send(422, 'Must provide both a name and message.');
    } else {
      comments.addComment(name, message, function(error) {
        if (error) {
          response.send(500, 'Could not add comment.');
        } else {
          response.send(200, { name: name, message: message });
        }
      });
    }
  });

  // to get all comments
  app.get('/comments', function(request, response) {
    response.set('Access-Control-Allow-Origin', '*');

    comments.getComments(function(error, comments) {
      if (error) {
        response.send(500, 'Could not get comments.');
      } else {
        response.send(200, comments);
      }
    });
  });
};
