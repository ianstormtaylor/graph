
var fixtures = require('add-fixtures');
var child = require('reactive-child');
var db = require('db');
var Graph = require('graph-model');
var Item = require('graph-view');
var menu = require('menu');
var reactive = require('reactive');
var series = require('array-series');
var split = require('split-callback');

/**
 * Create a graph menu.
 */

var Menu = menu(Item);

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
    new App(collection, document.body.querySelector('.App'));
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
  var menu = this.menu = new Menu();

  // TODO pass collection straight to menu constructor
  graphs.each(function (graph) {
    menu.add(graph);
  });

  menu.on('select', function (el, model, view) {
    view.render();
  });

  menu.on('add', function (el, model, view) {
    view.edit();
  });

  reactive(this.el, {}, this)
    .use(child);
}

/**
 * Create a new graph.
 *
 * @param {Event} e
 */

App.prototype.new = function (e) {
  var col = this.collection;
  var menu = this.menu;
  var model = new Graph();

  model.save(function (err) {
    if (err) throw err;
    col.push(model);
    menu.add(model);
  });
};