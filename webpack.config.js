const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

let config = {
  entry: path.resolve(__dirname, "src", "index.tsx"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    compress: true,
    hot: true,
    host: "0.0.0.0"
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
        exclude: /node_modules/,
        use: ["babel-loader", "ts-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};

module.exports = function(_, argv) {
  if (argv.mode === "development") {
    config.devtool = "eval";
  }

  if (argv.mode === "production") {}

  return config;
}
