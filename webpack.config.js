var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var version = require("./package.json").version;

var PROD = (process.env.NODE_ENV === 'production');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });


var node_entry = {}

if (PROD) {
  node_entry["collar-transport.min.latest"] = './node-entry.js';
  node_entry[`collar-transport.min.v${version}`] = './node-entry.js';
} else {
  node_entry["collar-transport.latest"] = './node-entry.js';
  node_entry[`collar-transport.v${version}`] = './node-entry.js';
}

module.exports = [
  {
    entry: {
      'collar-transport' : './web-entry.js'
    },
    output: {
        path: PROD ? path.join(__dirname, "build", "prod", "web") : path.join(__dirname, "build", "dev", "web"),
        filename: PROD ? `[name].min.v${version}.js` : `[name].v${version}.js`
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel', // 'babel-loader' is also a legal name to reference
          query: {
            presets: ['es2015']
          }
        }
      ]
    },
    plugins: PROD ? [
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        output: { comments: false }
      })
    ] : [],
  },
  {
    entry: node_entry,
    target: 'node',
    output: {
        path: PROD ? path.join(__dirname, "build", "prod", "node") : path.join(__dirname, "build", "dev", "node"),
        filename: "[name].js"
    },
    externals: nodeModules,
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel', // 'babel-loader' is also a legal name to reference
          query: {
            presets: ['es2015']
          }
        }
      ]
    },
    plugins: PROD ? [
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        output: { comments: false }
      })
    ] : [
    ]
  }
];
