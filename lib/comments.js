var db = require('redis').createClient();

/* Redis key that corresponds to the list of comments. */
var REDIS_COMMENTS_KEY = 'comments';

/* Adds a comment with the given name and message to the database. Calls the
 * given callback with a potential error once finished.
 *
 * Arguments:
 * name -- the name of the person posting the comment
 * message -- the comment itself
 * callback -- the callback to call once finished
 */
exports.addComment = function(name, message, callback) {
  // find existing comments
  this.getComments(function(error, comments) {
    if (error) {
      callback(error);
    } else {
      // add the new comment
      comments.push({ name: name, message: message });

      db.set(REDIS_COMMENTS_KEY, JSON.stringify(comments), callback);
    }
  });
};

/* Gets all comments and returns them as an array.
 *
 * Arguments:
 * callback -- the callback to call with the array of comments
 */
exports.getComments = function(callback) {
  db.get(REDIS_COMMENTS_KEY, function(error, comments) {
    if (error) {
      callback(error, null);
    } else {
      if (comments === null) {
        // no comments yet; return []
        callback(null, []);
      } else {
        callback(null, JSON.parse(comments));
      }
    }
  });
};
