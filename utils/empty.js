// This is being used with `webpack.NormalModuleReplacementPlugin` to replace
// 'unwanted' modules (scss, images...) in the `es5` bundle with this empty file.
// IgnorePlugin is not meant for this purpose and produces errors when used.
// `Resolve.alias` does not take regex, so this is the only solution for now.
// Null-loader is deprecated.
// Minification will remove these comments.
