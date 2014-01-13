
var noop = function(){};

/**
 * Expose `executeSql`.
 */

module.exports = executeSql;

/**
 * Convenience to execute `sql` and `args` on a `db` with a single `callback`.
 *
 * @param {Database} db
 * @param {String} sql
 * @param {Array} args
 * @param {Function} callback
 */

function executeSql (db, sql, args, callback) {
  callback = callback || noop;
  function success (t, res) { callback(null, res); }
  function error (t, err) { callback(err); }

  db.run(function (t) {
    t.executeSql(sql, args, success, error);
  });
}