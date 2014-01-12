
var fixtures = require('add-fixtures');
var graphs = require('db-graphs');
var GraphMenu = require('graph-menu');
var GraphModal = require('graph-modal');

/**
 * Add fixtures, then dispatch to home route.
 */

fixtures(function (err) {
  if (err) throw err;

  graphs.all(function (err, graphs) {
    if (err) throw err;
    var menu = new GraphMenu();
    each(graphs, menu.add.bind(menu));

    menu.on('select', function (el, graph) {
      var modal = new GraphModal(graph);
      modal.show(el);
    });

    document.body.appendChild(menu.el);
  });
});