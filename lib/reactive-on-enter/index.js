
var k = require('k');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Plugin to callback when the user pressed enter inside the element.
 *
 * @param {Reactive} reactive
 */

function plugin (reactive) {
  reactive.bind('on-enter', function (el, method) {
    var view = this.reactive.view;
    var on = k(el);
    on('enter', function () {
      if (!view[method]) throw new Error('method .' + method + '() missing');
      view[method](el);
    });
  });
}