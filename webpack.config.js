const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        'main': './src/main.ts',
        'devtools/devtools': './src/devtools/devtools.ts',
        'devtools/panel/panel': './src/devtools/panel/panel.tsx',
        'page': './src/content/page.ts'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loaders: [{
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: './tsconfig.json'
                }
            }]
        }, {
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }, {
            test: /\.(png|woff|woff2|eot|ttf|svg)$/,
            loader: 'url-loader?limit=100000'
        }]
    },
    plugins: [
        new CopyWebpackPlugin([
            './src/manifest.json',
            { from: './assets', to: './assets' },
            { from: './**/*.html', to: './', context: './src' }
        ]),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],
    output: {
        path: __dirname + '/dist',
        filename: '[name].js'
    },
    // devtool: 'sourcemap'
}