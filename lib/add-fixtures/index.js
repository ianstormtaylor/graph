
var Batch = require('batch');
var colors = require('colors');
var each = require('each');
var Graph = require('graph-model');
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

  each(json, function (attrs) {
    batch.push(function (done) {
      attrs.color = random(values(colors));
      new Graph(attrs).save(done);
    });
  });

  Graph.destroyAll(function (err) {
    if (err) return callback(err);
    batch.end(function (err, res) {
      callback(err, res);
    });
  });
}