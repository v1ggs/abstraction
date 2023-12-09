const path = require('path');
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require(path.join(
   __dirname,
   '..',
   'config',
   'webpack',
   'webpack.config.js',
));

// console.log(webpackConfig);

const compiler = Webpack(webpackConfig);
const devServerOptions = { ...webpackConfig.devServer, open: true };
const server = new WebpackDevServer(devServerOptions, compiler);

const runServer = async () => {
   // console.log('Starting server...');
   await server.start();
};

runServer();
