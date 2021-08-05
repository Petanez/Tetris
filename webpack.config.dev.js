import path from "path"
const __dirname = path.resolve()
import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"

export default {
  watch: true,
  mode: "development",
  optimization: {
    minimize: false
  },
  devtool: false,
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
      },
      {
        test: /\.png$/,
        use: [
          "file-loader"
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
