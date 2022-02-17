/**
 * Safari can't handle SVG favicons :(
 * So only apply svg-favicon animation in non-safari browsers
 */
if (window.safari === undefined) {
  favicon.animate(
    [...Array(8).keys()].map((i) => `./favicons/favicon-frame-0${i + 1}.svg`),
    1100
  )
}
