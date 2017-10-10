const path = require('path')
const webpack = require('webpack')

const config = require('./config');

module.exports = {
  entry: [
    './app/index.js'
  ],

  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'public')
  },

  resolve: {
    modules: [
      path.resolve('./app'),
      path.resolve('./node_modules')
    ]
  },

  devtool: '#inline-source-map',

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          'babel-loader'
        ],
	exclude: /node_modules/
      },
      {
        test: /\.scss?$/,
        use: [
          'style-loader',
          'css-loader',
	  'sass-loader?includePaths[]=./node_modules'
	]
      },
      {
        test: /\.(png|jpg)?$/,
        use: 'file-loader',
        exclude: /node_modules/
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        API_URL: JSON.stringify(config.api_url),
      },
    }),
  ]
}
