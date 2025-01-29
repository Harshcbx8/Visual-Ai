const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
  // Your other Webpack config...
  resolve: {
    fallback: {
      process: require.resolve('process/browser'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new Dotenv(),
  ],
};
