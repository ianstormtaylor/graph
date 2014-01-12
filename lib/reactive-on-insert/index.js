
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
  reactive.bind('on-insert', function (el, method) {
    var view = this.reactive.view;
    inserted(el, function () {
      if (!view[method]) throw new Error('method .' + method + '() missing');
      view[method](el);
    });
  });
}