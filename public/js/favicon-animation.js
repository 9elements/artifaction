/**
 * Safari can't handle SVG favicons :(
 * So only apply svg-favicon animation in non-safari browsers
 */

window.safari === void 0 &&
  favicon.animate(
    [...Array(8).keys()].map((i) => `./favicons/favicon-frame-${i + 1}.svg`),
    1100
  )
