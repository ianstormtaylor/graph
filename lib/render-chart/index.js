
var Chart = require('chart');
var map = require('map');

/**
 * Expose `renderChart`.
 */

module.exports = renderChart;

/**
 * Chart options.
 */

var options = {
  scaleShowLabels: false,
  scaleShowGridLines: false,
  pointDot: false,
  datasetStrokeWidth: 4,
  bezierCurve: false
};

/**
 * Render a line chart on an `el` with a `graph` model.
 *
 * @param {Element} el
 * @param {Object} graph
 */

function renderChart (el, graph) {
  var ctx = el.getContext('2d');
  var data = graph.data;
  var labels = map(data, function (d, i) { return ''; });
  var values = map(data, function (d, i) { return d.value; });

  new Chart(ctx).Line({
    labels: labels,
    datasets: [{
      fillColor: 'linear-gradient(black, white)',
      strokeColor: 'white',
      pointColor: 'white',
      pointStrokeColor: 'transparent',
      data: values
    }]
  }, options);
}