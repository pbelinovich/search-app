const configs = require('./configs')
const packageJson = require('./package.json')
const webpack = require('webpack')

const server = configs.getDefaultConfig({
  module: 'server',
  externals: require('./externals'),
  entry: '/src/index.ts',
  outputFolder: './server',
  libraryTarget: 'commonjs2',
  target: 'node',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.VERSION': JSON.stringify(packageJson.version),
    }),
  ],
})

server.module.rules.push({
  test: /.node$/,
  loader: 'node-loader',
})

module.exports = [
  {
    ...server,
    node: {
      __dirname: false,
      __filename: false,
    },
    optimization: {
      minimize: process.env.NODE_ENV === 'PRODUCTION',
    },
  },
]
