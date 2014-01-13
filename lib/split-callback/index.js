
var noop = function(){};

/**
 * Expose `splitCallback`.
 */

module.exports = splitCallback;

/**
 * Split a callback into two "success" and "error" callbacks for APIs that don't
 * take a single combined function with a first error argument.
 *
 * @param {Function} fn
 * @return {Object}
 */

function splitCallback (fn) {
  fn = fn || noop;

  function error () {
    fn.apply(this, arguments);
  }

  function success () {
    var args = [].slice.call(arguments);
    args.unshift(null);
    fn.apply(this, args);
  }

  return {
    error: error,
    success: success
  };
}