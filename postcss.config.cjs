const postcssPresetEnv = require("postcss-preset-env")

module.exports = {
  plugins: [
    postcssPresetEnv({
      stage: 0,
      features: {
        "nesting-rules": true,
        "custom-properties": false,
        // "custom-media-queries": {
        //   importFrom: "./src/styles/_queries.css", // file with custom media queries
        // },
        "prefers-color-scheme-query": false,
      },
    }),
  ],
}
