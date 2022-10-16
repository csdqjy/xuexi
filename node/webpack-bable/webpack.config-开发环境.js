const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
        print: './src/print.js',
    }, // 入口文件
    devtool: 'inline-source-map',
    devServer: {
        static: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Development',
        })
    ],
    output: { // 输出设置
        // filename: 'main.js', // 输出文件名
        filename: '[name].bundle.js', // 输出文件名
        path: path.resolve(__dirname, 'dist'), // 输出文件路径
        clean: true,
        publicPath: '/',
    },
    optimization: {
        runtimeChunk: 'single'
    }
}