
var db = require('db');
var fixtures = require('add-fixtures');
var Graph = require('graph-model');
var GraphMenu = require('graph-menu');
var GraphModal = require('graph-modal');
var series = require('array-series');
var split = require('split-callback');

/**
 * Kick it all off.
 */

series([setup, fixtures, graphs], function (err) {
  if (err) throw err;
});

/**
 * Setup the database.
 *
 * @param {Function} fn
 */

function setup (fn) {
  var fns = split(fn);
  db.transaction(function (t) {
    var schema = '(id INTEGER PRIMARY KEY AUTOINCREMENT, data)';
    var sql = 'CREATE TABLE IF NOT EXISTS graph ' + schema;
    t.executeSql(sql);
  }, fns.success, fns.error);
}

/**
 * Create the graph menu.
 *
 * @param {Function} fn
 */

function graphs (fn) {
  var menu = new GraphMenu();
  document.body.appendChild(menu.el);

  menu.on('select', function (el, graph) {
    var modal = new GraphModal(graph);
    modal.show(el);
  });

  Graph.all(function (err, collection) {
    if (err) return fn(err);
    collection.each(menu.add.bind(menu));
    fn();
  });
}