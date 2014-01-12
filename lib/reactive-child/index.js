
var carry = require('carry');
var type = require('type');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Plugin to add a child binding to `reactive`.
 *
 * @param {Reactive} reactive
 */

function plugin (reactive) {
  reactive.bind('data-child', function (el, attr) {
    var other = this.value(attr);
    if ('element' == type(other.el)) other = other.el; // handle views
    carry(other, el);
    el.parentNode.replaceChild(other, el);
  });
}