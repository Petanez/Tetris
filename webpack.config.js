const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const webpack = require("webpack")

module.exports = {
  watch: true,
  mode: "development",
  optimization: {
    minimize: false
  },
  entry: [
    path.resolve(__dirname, "src", "js", "index.js"),
    path.resolve(__dirname, "src", "css", "index.css")
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader"
          ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/Tetris.html"
    }),
    new MiniCssExtractPlugin({
      filename: "style.css"
    })
  ]
}
