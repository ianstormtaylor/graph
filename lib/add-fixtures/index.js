
var Batch = require('batch');
var colors = require('colors');
var each = require('each');
var graphs = require('db-graphs');
var json = require('./graphs.json');
var random = require('pickrand');
var values = require('object').values;

/**
 * Expose `addFixtures`.
 */

module.exports = addFixtures;

/**
 * Add fixtures to the database.
 *
 * @param {Function} callback
 */

function addFixtures (callback) {
  var batch = new Batch();

  each(json, function (graph) {
    batch.push(function (done) {
      graph.color = random(values(colors));
      graphs.add(graph, done);
    });
  });

  graphs.destroy(function (err) {
    if (err) return callback(err);
    batch.end(function (err, res) {
      callback(err, res);
    });
  });
}