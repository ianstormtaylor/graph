
var ago = require('ago');
var domify = require('domify');
var inserted = require('inserted');
var reactive = require('reactive');
var render = require('render-chart');
var template = require('./index.html');

/**
 * Expose `GraphCanvas`.
 */

module.exports = GraphCanvas;

/**
 * Initialize a new `GraphCanvas` with `graph`.
 *
 * @param {Object} graph
 */

function GraphCanvas (graph) {
  this.model = graph;
  this.el = domify(template);
  reactive(this.el, graph, this);
  inserted(this.el, this.render.bind(this));
}

/**
 * Render the graph.
 */

GraphCanvas.prototype.render = function () {
  var parent = this.el.parentNode;
  this.el.width = parent.offsetWidth * 0.8;
  this.el.height = parent.offsetHeight * 0.8;
  render(this.el, this.model);
};