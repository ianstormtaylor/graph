
var db = require('db');
var defaults = require('model-defaults');
var model = require('model');
var sqlite = require('model-sqlite');

/**
 * Expose `Graph`.
 */

var Graph = module.exports = model('graph')
  .use(defaults)
  .use(sqlite(db))
  .attr('id')
  .attr('name', { default: 'Untitled' })
  .attr('data', { default: [] })
  .attr('color');