const path = require("path")

module.exports = {
  watch: true,
  mode: "development",
  optimization: {
    minimize: false
  },
  entry: [
    path.resolve(__dirname, "src", "js", "index.js"),
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  }
}