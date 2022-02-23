const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/assets/js/index.js',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },  
  output: {
    path: path.resolve(__dirname, 'dist/assets/js/'),
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    publicPath: '/assets/js/',
    compress: true,
    open: true,
    port: 9000,
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
};