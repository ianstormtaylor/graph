
var child = require('reactive-child');
var Color = require('color');
var css = require('css');
var domify = require('domify');
var insert = require('reactive-on-insert');
var template = require('./index.html');
var reactive = require('reactive');
var relative = require('relative-date');
var render = require('render-chart');
var value = require('value');

/**
 * Expose `Graph`.
 */

module.exports = Graph;

/**
 * Initialize a new `Graph` with `model`.
 *
 * @param {Graph} model
 */

function Graph (model) {
  this.model = model;
  this.el = domify(template);
  reactive(this.el, model, this)
    .use(insert);
}

/**
 * Return the relative timespan.
 */

Graph.prototype.timespan = function () {
  var date = new Date(this.model.data()[0].date);
  return 'since ' + relative(date) + ' ago';
};

/**
 * Hide the modal.
 *
 * @param {Event} e
 */

Graph.prototype.hide = function (e) {
  e.stopPropagation();
  this.el.classList.remove('selected');
  this.render();
};

/**
 * Submit the form.
 */

Graph.prototype.submit = function (e) {
  e.preventDefault();
  var input = this.el.querySelector('.Graph-input');
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

/**
 * Render the chart.
 */

Graph.prototype.render = function () {
  var chart = this.el.querySelector('.Graph-chart');
  var color = new Color(css(this.el, 'background-color'));

  var svg = chart.querySelector('svg');
  if (svg) chart.removeChild(svg);

  css(chart, {
    width: '',
    height: ''
  });

  css(chart, {
    width: chart.offsetWidth,
    height: chart.offsetHeight
  });

  render(this.model, chart, color);
};