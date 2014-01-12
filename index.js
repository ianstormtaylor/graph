
var fixtures = require('add-fixtures');
var graphs = require('db-graphs');
var GraphScreen = require('graph-screen');
var HomeScreen = require('home-screen');
var Router = require('router');

/**
 * Router.
 */

var router = new Router()
  .on('/', home, load, error)
  .on('/graph/:id', graph, load, error);

/**
 * Add fixtures, then dispatch to home route.
 */

fixtures(function (err) {
  if (err) throw err;
  router.dispatch('/');
});

/**
 * Home route.
 *
 * @param {Context} ctx
 * @param {Function} next
 */

function home (ctx, next) {
  graphs.all(function (err, graphs) {
    if (err) next(err);
    var screen = ctx.screen = new HomeScreen(graphs);

    screen.on('select', function (graph) {
      router.dispatch('/graph/' + graph.id);
    });

    next();
  });
}

/**
 * Graph route.
 *
 * @param {Context} ctx
 * @param {Function} next
 */

function graph (ctx, next) {
  var id = ctx.params.id;
  graphs.get(id, function (err, graph) {
    if (err) next(err);
    ctx.screen = new GraphScreen(graph);
    next();
  });
}

/**
 * Load the current screen into the DOM.
 *
 * @param {Context} ctx
 * @param {Function} next
 */

function load (ctx, next) {
  var screen = ctx.screen;
  document.body.innerHTML = '';
  document.body.appendChild(screen.el);
  next();
}

/**
 * Error handler.
 *
 * @param {Error} err
 * @param {Context} ctx
 * @param {Function} next
 */

function error (err, ctx, next) {
  throw err;
}