
var child = require('reactive-child');
var domify = require('domify');
var each = require('each');
var Emitter = require('emitter');
var menu = require('menu');
var GraphMenuItem = require('graph-menu-item');
var reactive = require('reactive');
var template = require('./index.html');

/**
 * Expose `HomeScreen`.
 */

module.exports = HomeScreen;

/**
 * Create `GraphMenu`.
 */

var GraphMenu = menu(GraphMenuItem);

/**
 * Initialize a new `HomeScreen`.
 *
 * @param {Array} graphs
 */

function HomeScreen (graphs) {
  this.el = domify(template);
  var self = this;
  var menu = this.menu = new GraphMenu();

  each(graphs, function (graph) {
    menu.add(graph);
  });

  menu.on('select', function (el, model, view) {
    self.emit('select', model);
  });

  reactive(this.el, {}, this)
    .use(child);
}

/**
 * Mixin emitter.
 */

Emitter(HomeScreen.prototype);