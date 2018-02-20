const path = require("path");
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: require.resolve("./src/server.js"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    devtool: "source-map",
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
    },
    target: 'node',
    externals: [nodeExternals()]
};
