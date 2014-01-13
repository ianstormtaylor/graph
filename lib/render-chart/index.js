
var clone = require('clone');
var isodate = require('isodate-traverse');
var map = require('map');
var Rickshaw = require('rickshaw');
var svg = require('create-svg-element');

/**
 * Expose `renderChart`.
 */

module.exports = renderChart;

/**
 * Render a chart for a `graph` and `el`.
 *
 * @param {Object} graph
 * @param {Element} el
 * @param {Color} color
 */

function renderChart (graph, el, color) {
  var name = graph.name();
  var data = format(graph.data());
  if (!data.length) return;

  var grad = gradient(graph, color);
  var chart = new Rickshaw.Graph({
    element: el,
    series: [{
      data: data,
      name: name,
      color: 'url(#' + grad.id + ')'
    }]
  });

  chart.render();
  el.querySelector('svg').appendChild(grad);
}

/**
 * Format a graph's `data` for plotting.
 *
 * @param {Array} data
 * @return {Array}
 */

function format (data) {
  if (!data.length) return [];
  data = clone(data);
  isodate(data);
  data.sort(byDate);

  var start = data[0].date.getTime();

  return map(data, function (datum, i) {
    return {
      x: datum.date.getTime() - start,
      y: datum.value
    };
  });
}

/**
 * Sort data by date.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Number}
 */

function byDate (a, b) {
  if (a.date < b.date) return -1;
  if (a.date > b.date) return 1;
  return 0;
}

/**
 * Create a gradient for a `color`.
 *
 * @param {Object} graph
 * @param {Color} color
 * @return {Element}
 */

function gradient (graph, color) {
  var id = graph.primary();
  var grad = svg('linearGradient');
  grad.id = id + '-gradient';
  grad.setAttribute('x1', '0%');
  grad.setAttribute('y1', '100%');
  grad.setAttribute('x2', '0%');
  grad.setAttribute('y2', '0%');

  var start = svg('stop');
  start.setAttribute('offset', '10%');
  start.setAttribute('stop-color', color.rgbString());
  grad.appendChild(start);

  var end = svg('stop');
  end.setAttribute('offset', '100%');
  end.setAttribute('stop-color', color.darken(0.2).rgbString());
  grad.appendChild(end);

  return grad;
}