
var child = require('reactive-child');
var Color = require('color');
var css = require('css');
var domify = require('domify');
var graphs = require('db-graphs');
var insert = require('reactive-on-insert');
var template = require('./index.html');
var reactive = require('reactive');
var relative = require('relative-date');
var render = require('render-chart');
var value = require('value');

/**
 * Expose `GraphModal`.
 */

module.exports = GraphModal;

/**
 * Initialize a new `GraphModal` with `graph`.
 *
 * @param {Graph} graph
 */

function GraphModal (graph) {
  this.model = graph;
  this.el = domify(template);
  reactive(this.el, graph, this)
    .use(insert);
}

/**
 * Transform the graph's color into a CSS string.
 *
 * @return {String}
 */

GraphModal.prototype.color = function () {
  var color = new Color(this.model.color());
  return color.rgbString();
};

/**
 * Return the relative timespan.
 */

GraphModal.prototype.timespan = function () {
  var date = new Date(this.model.data()[0].date);
  return 'since ' + relative(date) + ' ago';
};

/**
 * Show the modal.
 */

GraphModal.prototype.show = function () {
  document.body.appendChild(this.el);
};

/**
 * Hide the modal.
 */

GraphModal.prototype.hide = function () {
  this.el.parentNode.removeChild(this.el);
};

/**
 * Render the chart.
 */

GraphModal.prototype.render = function () {
  var header = this.el.querySelector('.GraphModal-header');
  var chart = this.el.querySelector('.GraphModal-chart');
  var form = this.el.querySelector('.GraphModal-form');
  var width = this.el.offsetWidth;
  var start = header.offsetTop + header.offsetHeight;
  var end = form.offsetTop;
  var height = end - start;

  css(chart, {
    height: height,
    width: width,
    left: 0,
    top: start
  });

  render(this.model, chart);
};

/**
 * Submit the form.
 */

GraphModal.prototype.submit = function (e) {
  e.preventDefault();
  var input = this.el.querySelector('.GraphModal-input');
  var val = value(input);
  var data = this.model.data();

  data.push({
    date: Date.now(),
    value: val
  });

  this.model
    .data(data)
    .save();
};