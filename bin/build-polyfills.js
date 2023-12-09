#!/usr/bin/env node

process.env.NODE_ENV = 'production';
process.env.ABSTRACTION_POLYFILLS = true;

const path = require('path');
const webpack = require('webpack');
const webpackConfig = require(path.join(
   __dirname,
   '..',
   'config',
   'webpack',
   'webpack.polyfills.js',
))();

// console.log(webpackConfig);

webpack(webpackConfig, err => {
   // console.log(stats);
   if (err) {
      console.log(err);
   }
});
