
var db = require('db');
var f = require('fmt');
var type = require('type');
var uid = require('uid');

/**
 * Get a graph from the database by `id`.
 *
 * @param {String} id
 * @param {Function} callback
 */

exports.get = function (id, callback) {
  if ('string' != type(id)) return callback(new Error('invalid id'));

  db.run(function (t) {
    create(t);
    exec(t, 'SELECT * FROM GRAPHS WHERE ID=?', [id], function (err, res) {
      if (err) return callback(err);
      callback(null, convert(res.rows.item(0)));
    });
  });
};

/**
 * Get all graphs from the database.
 *
 * @param {Function} callback
 */

exports.all = function (callback) {
  db.run(function (t) {
    create(t);
    exec(t, 'SELECT * FROM GRAPHS', [], function (err, res) {
      if (err) return callback(err);
      var rows = res.rows;
      var ret = [];
      for (var i = 0; i < rows.length; i++) ret.push(convert(rows.item(i)));
      callback(null, ret);
    });
  });
};

/**
 * Add a `graph` to the database.
 *
 * @param {Object} graph
 * @param {Function} callback
 */

exports.add = function (graph, callback) {
  if ('object' != type(graph)) return callback(new Error('invalid graph'));
  var id = graph.id = uid();
  var data;

  try {
    data = JSON.stringify(graph);
  } catch (err) {
    return callback(err);
  }

  db.run(function (t) {
    create(t);
    exec(t, 'INSERT INTO GRAPHS (ID, DATA) VALUES (?, ?)', [id, data], function (err, res) {
      if (err) return callback(err);
      callback(null, graph);
    });
  });
};

/**
 * Remove a graph from the database by `id`.
 *
 * @param {String} id
 * @param {Function} callback
 */

exports.remove = function (id, callback) {
  if ('string' != type(id)) return callback(new Error('invalid id'));

  db.run(function (t) {
    create(t);
    exec('DELETE FROM GRAPHS WHERE ID=?', [id], function (err, res) {
      debugger;
    });
  });
};

/**
 * Remove all graphs from the database.
 *
 * @param {Function} callback
 */

exports.destroy = function (callback) {
  db.run(function (t) {
    exec(t, 'DROP TABLE IF EXISTS GRAPHS');
  }, callback, callback);
};

/**
 * Create the graphs table.
 *
 * @param {Transaction} t
 */

function create (t, callback) {
  exec(t, 'CREATE TABLE IF NOT EXISTS GRAPHS (ID PRIMARY KEY, DATA)');
}

/**
 * Execute SQL on a `transaction`.
 *
 * @param {Transaction} t
 * @param {String} sql
 * @param {Array} args
 * @param {Function} callback
 */

function exec (t, sql, args, callback) {
  function error (err) { if (callback) callback(err); }
  function success (trans, res) { if (callback) callback(null, res); }
  t.executeSql(sql, args, success, error);
}

/**
 * Convert a SQL graph into a nice JSON graph.
 *
 * @param {Object} input
 */

function convert (input) {
  var ret;

  try {
    ret = JSON.parse(input.DATA);
  } catch (err) {
    throw err;
  }

  ret.id = input.ID;
  return ret;
}