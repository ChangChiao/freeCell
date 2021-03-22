const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    entry: {
        index: './src/main.js'
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './docs'),
    },
    module: {
        rules: [
            {
                test: /.js$/, exclude: /node_modules/,
                use: { loader: 'babel-loader', options: { presets: ['@babel/preset-env'] } }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', {
                    loader: 'sass-loader',
                    options: {
                        sassOptions: {
                            outputStyle: 'compressed', // Node Sass 的可傳遞選項
                        },
                    },
                },],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: './src/images',
                            publicPath: './docs/images', 
                            esModule: false
                        },
                    },
                ],
            },
        ],
    },
    devServer: {
        //指定開啟port為9000
        port: 9000
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
        }),
        new MiniCssExtractPlugin()
    ],
};