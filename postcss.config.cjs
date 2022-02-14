const postcssPresetEnv = require("postcss-preset-env")

module.exports = {
  plugins: [
    postcssPresetEnv({
      stage: 2,
      features: {
        "nesting-rules": true,
        "custom-properties": false,
        "custom-media-queries": {
          importFrom: "./src/styles/_media.css", // file with custom media queries
        },
        "prefers-color-scheme-query": false,
      },
    }),
  ],
}
