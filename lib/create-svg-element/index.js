
/**
 * Expose `createSvgElement`.
 */

module.exports = createSvgElement;

/**
 * Create an SVG element by `name`.
 *
 * @param {String} name
 */

function createSvgElement (name) {
  return document.createElementNS('http://www.w3.org/2000/svg', name);
}