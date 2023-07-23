exports.plugins = {
   ESLintWebpackPlugin: require('./eslint-webpack-plugin'),
   TerserWebpackPlugin: require('./terser-webpack-plugin'),
   WebpackBundleAnalyzer: require('./webpack-bundle-analyzer'),
};

exports.loaders = {
   babelES6: require('./babel-modern').babelLoaderES6,
   babelES5: require('./babel-legacy'),
};
