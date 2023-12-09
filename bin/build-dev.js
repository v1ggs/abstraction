#!/usr/bin/env node

process.env.NODE_ENV = 'development';

const path = require('path');
const webpack = require('webpack');
const webpackConfig = require(path.join(
   __dirname,
   '..',
   'config',
   'webpack',
   'webpack.config.js',
));

// console.log(webpackConfig);

webpack(webpackConfig, err => {
   // console.log(stats);
   if (err) {
      console.log(err);
   }
});
