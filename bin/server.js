const path = require('path');
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require(
   path.join(__dirname, '..', 'config', 'webpack', 'webpack.config.js'),
);

// console.log(webpackConfig);

const compiler = Webpack(webpackConfig);

console.log(webpackConfig);

const devServerOptions = {
   // Make sure the main config is always first in the config array.
   ...webpackConfig[0].devServer,
};
const server = new WebpackDevServer(devServerOptions, compiler);

const runServer = async () => {
   await server.start();
};

runServer();
