process.env.NODE_ENV = 'production';

var path = require('path');
var rimrafSync = require('rimraf').sync;
var webpack = require('webpack');
var config = require('./webpack.config');

var isInNodeModules = 'node_modules' ===
  path.basename(path.resolve(path.join(__dirname, '..', '..')));
var relative = isInNodeModules ? '../..' : '.';
rimrafSync(relative + '/dist');

webpack(config).run(function(err, stats) {
  if (err) {
    console.error('Failed to create a production dist. Reason:');
    console.error(err.message || err);
    process.exit(1);
  }

  console.log('Successfully generated a bundle in the dist folder!');
});