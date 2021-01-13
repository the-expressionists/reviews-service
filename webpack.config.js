const path = require('path');

module.exports = {
  mode: "development",
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },

  module: {
    rules: [
        {
          test: /\.jsx?$/,
          include: [
            path.resolve(__dirname, "src"),
          ],
          loader: "babel-loader",
          options: {
            presets: ["@babel/react", "@babel/preset-env"]
          },
        },
        {
          test: /\.css$/,
          use: [
            { loader: 'style-loader'},
            { loader: 'css-loader'},
          ],
        }
      ]
  }
}