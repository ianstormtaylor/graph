
var child = require('reactive-child');
var db = require('db');
var Graph = require('graph-model');
var GraphMenu = require('graph-menu');
var GraphModal = require('graph-modal');
var reactive = require('reactive');
var series = require('array-series');
var split = require('split-callback');

/**
 * Kick it all off.
 */

series([setup, boot], function (err, res) {
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
 * Get all graphs an initialize the App.
 *
 * @param {Function} fn
 */

function boot (fn) {
  Graph.all(function (err, collection) {
    if (err) return fn(err);
    new App(collection, document.body);
    fn();
  });
}

/**
 * Initialize the `App` with `graphs` and `el`.
 *
 * @param {Collection} graphs
 * @param {Element} el
 */

function App (graphs, el) {
  this.el = el;
  this.collection = graphs;
  var menu = this.menu = new GraphMenu();

  menu.on('select', function (el, graph) {
    var modal = new GraphModal(graph);
    modal.show(el);
  });

  graphs.each(function (graph) {
    menu.add(graph);
  });

  reactive(this.el, {}, this)
    .use(child);
}