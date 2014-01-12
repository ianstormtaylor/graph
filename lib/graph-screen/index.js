
var AddDataForm = require('add-data-form');
var child = require('reactive-child');
var Color = require('color');
var domify = require('domify');
var GraphCanvas = require('graph-canvas');
var template = require('./index.html');
var reactive = require('reactive');
var relative = require('relative-date');

/**
 * Expose `GraphScreen`.
 */

module.exports = GraphScreen;

/**
 * Initialize a new `GraphScreen` with `graph`.
 *
 * @param {Object} graph
 */

function GraphScreen (graph) {
  this.model = graph;
  this.el = domify(template);
  this.canvas = new GraphCanvas(graph);
  this.form = new AddDataForm();

  reactive(this.el, graph, this)
    .use(child);
}

/**
 * Transform the graph's color into a CSS string.
 *
 * @return {String}
 */

GraphScreen.prototype.color = function () {
  var color = new Color(this.model.color);
  return color.rgbString();
};

/**
 * Return the relative timespan.
 */

GraphScreen.prototype.timespan = function () {
  var date = new Date(this.model.data[0].date);
  return 'since ' + relative(date) + ' ago';
};