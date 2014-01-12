
var bytes = require('bytes');
var open = window.openDatabase;

/**
 * Settings.
 */

var slug = 'graph';
var version = '1.0';
var name = 'Graph';
var size = bytes('1mb');

/**
 * Expose a new database.
 */

module.exports = exports = open(slug, version, name, size);

/**
 * Helper to make transactions dryer.
 *
 * @param {Function} fn
 * @param {Function} callback
 */

exports.run = function (fn, callback) {
  exports.transaction(fn, callback, callback);
};