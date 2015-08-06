/**
 * User: Liam Dickson
 * Date: 7/9/15
 * Time: 11:30 AM
 */

'use strict';

module.exports = {
    context: __dirname,
    entry: {
        options: __dirname + "/src/options",
        background: __dirname + "/src/background",
        insertNotice: __dirname + "/src/insertNotice"
    },
    output: {
        path: __dirname + '/extension/js/',
        filename: "[name]-bundle.js"
    },
    resolve: {
        extensions: ['', '.js', '.json', '.jsx'],
        alias: {
            jquery: __dirname + "/extension/js/jquery.min"
        }
    },
    resolveLoader: { root: __dirname + "/node_modules" },
    devtool: 'source-map',
    module: {
        loaders: [
            { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'},
            { test: /\.json$/, loader: 'json' }
        ]
    }
};