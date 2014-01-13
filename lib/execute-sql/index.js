
var split = require('split-callback');

/**
 * Expose `executeSql`.
 */

module.exports = executeSql;

/**
 * Convenience to execute SQL on a `transaction` with a single callback.
 *
 * @param {Transaction} t
 * @param {String} sql
 * @param {Array} args
 * @param {Function} callback
 */

function executeSql (t, sql, args, callback) {
  var fns = split(callback);
  t.executeSql(sql, args, fns.success, fns.error);
}