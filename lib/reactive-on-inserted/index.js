
var inserted = require('inserted');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Plugin to callback when the element is inserted into the DOM.
 *
 * @param {Reactive} reactive
 */

function plugin (reactive) {
  reactive.bind('on-inserted', function (el, attr) {
    inserted(el, this.value(attr));
  });
}