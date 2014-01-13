
var child = require('reactive-child');
var Color = require('color');
var css = require('css');
var domify = require('domify');
var enter = require('reactive-on-enter');
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
    .use(enter)
    .use(insert);
}

/**
 * Return the relative timespan.
 */

Graph.prototype.timespan = function () {
  var data = this.model.data();
  if (!data.length) return '';
  var date = new Date(data[0].date);
  return 'since ' + relative(date) + ' ago';
};

/**
 * Save the model.
 */

Graph.prototype.rename = function () {
  var name = this.el.querySelector('.Graph-name');
  this.model.name(name.textContent);
  this.model.save();
};

/**
 * Hide the modal.
 */

Graph.prototype.hide = function (e) {
  if (e) e.stopPropagation();
  this.el.classList.remove('selected');
  this.render();
};

/**
 * Edit the graph's name.
 */

Graph.prototype.edit = function (e) {
  if (e) e.stopPropagation();
  var name = this.el.querySelector('.Graph-name');
  name.contentEditable = true;
  select(name);
};

/**
 * Add a data point to the graph.
 */

Graph.prototype.add = function (e) {
  if (e) e.stopPropagation();
  var self = this;
  var model = this.model;
  var data = model.data();
  var input = this.el.querySelector('.Graph-input');
  var val = parseInt(value(input), 10);

  data.push({
    date: new Date().toISOString(),
    value: val
  });

  model.data(data);
  model.save(function (err) {
    if (err) throw err;
    value(input, '');
    self.render();
  });
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

/**
 * Select an element's text.
 *
 * @param {Element} el
 */

function select (el) {
  var range = document.createRange();
  range.selectNodeContents(el);
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  el.focus();
}