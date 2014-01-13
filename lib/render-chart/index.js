
var Color = require('color');
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
 */

function renderChart (graph, el) {
  var grad = gradient(graph);
  var chart = new Rickshaw.Graph({
    element: el,
    series: [{
      name: graph.name(),
      color: 'url(#' + grad.id + ')',
      data: map(graph.data(), function (datum, i) {
        return { x: i, y: datum.value };
      })
    }]
  });

  chart.render();
  el.querySelector('svg').appendChild(grad);
}

/**
 * Create a gradient for a `color`.
 *
 * @param {Object} graph
 * @return {Element}
 */

function gradient (graph) {
  var id = graph.primary();
  var color = new Color(graph.color());
  var grad = svg('linearGradient');
  grad.id = id + '-gradient';
  grad.setAttribute('x1', '0%');
  grad.setAttribute('y1', '100%');
  grad.setAttribute('x2', '0%');
  grad.setAttribute('y2', '0%');

  var start = svg('stop');
  start.setAttribute('offset', '5%');
  start.setAttribute('stop-color', color.rgbString());
  grad.appendChild(start);

  var end = svg('stop');
  end.setAttribute('offset', '95%');
  end.setAttribute('stop-color', color.darken(0.2).rgbString());
  grad.appendChild(end);

  return grad;
}