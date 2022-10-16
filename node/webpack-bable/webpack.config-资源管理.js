const path = require('path');
// 自定义 JSON 模块 parser
const toml = require('toml');
const yaml = require('yamljs');
const json5 = require('json5');

module.exports = {
    entry: './src/index.js', // 入口文件
    output: { // 输出设置
        // filename: 'main.js', // 输出文件名
        filename: 'bundle.js', // 输出文件名
        path: path.resolve(__dirname, 'dist') // 输出文件路径
    },
    module: { // 模块
        rules: [
            {   // css处理
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {   // 图片处理
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            },
            {   // 字体处理
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource'
            },
            {   // 加载数据
                test: /\.(csv|tsv)$/i,
                use: ['csv-loader']
            },
            {   // 加载数据
                test: /\.xml$/i,
                use: ['xml-loader']
            },
            {   // 自定义 JSON 模块 parser
                test: /\.toml$/i,
                type: 'json',
                parser: {
                    parse: toml.parse
                }
            },
            {   // 自定义 JSON 模块 parser
                test: /\.yaml$/i,
                type: 'json',
                parser: {
                    parse: yaml.parse
                }
            },
            {   // 自定义 JSON 模块 parser
                test: /\.json5$/i,
                type: 'json',
                parser: {
                    parse: json5.parse
                }
            }

        ]
    }
}