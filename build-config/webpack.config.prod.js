const webpack = require('webpack')
const { merge } = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const baseConfig = require('./webpack.config.base')


module.exports = merge(baseConfig, {
  output: {
    filename: '[name].[chunkhash:8].js',
  },
  devtool: false,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      cacheGroups: {
        // chunks: 'all',
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          enforce: true,
          chunks: 'initial',
        },
        styles: {
          name: 'styles',
          test: /\.(css|less)$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
    runtimeChunk: true,
    chunkIds: 'named',
  },
  performance: {
    hints: 'warning',
  },
})
