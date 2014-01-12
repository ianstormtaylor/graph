
var Color = require('color');
var template = require('./index.html');
var view = require('view');

/**
 * Expose `GraphMenuItem`.
 */

var GraphMenuItem = module.exports = view(template);

/**
 * Transform the graph's color into a CSS string.
 *
 * @return {String}
 */

GraphMenuItem.prototype.color = function () {
  var color = new Color(this.model.color);
  return color.rgbString();
};