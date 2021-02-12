const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, "src", "index.tsx"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html")
    })
  ],
  resolve: {
    extensions: [".js", ".ts", ".tsx"]
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: [/node_modules/, /\.test.ts(x?)$/],
        use: ["babel-loader", "ts-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};
