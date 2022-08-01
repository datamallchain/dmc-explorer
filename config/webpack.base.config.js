const utils = require("./utils")
const path = require("path");
const WebpackManifestPlugin = require("webpack-manifest-plugin")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require("webpack")

module.exports = {
    // 入口
    entry: {
        app: "./src/index"
    },
    // 出口
    output: {
        path: utils.resolve("../build"),
        filename: "static/js/[name].[hash].js",
        publicPath: "/" // 打包后的资源的访问路径前缀
    },
    // 模块
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)(\?.*)?$/,
                loader: 'url-loader',
                exclude: /\.svg$/,
                options: {
                    limit: 10000, // url-loader 包含file-loader，这里不用file-loader, 小于10000B的图片base64的方式引入，大于10000B的图片以路径的方式导入
                    name: 'static/img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.svg$/,
                loader:"file-loader",
                include: /node_modules/,
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
                exclude: /node_modules/,
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000, // 小于10000B的图片base64的方式引入，大于10000B的图片以路径的方式导入
                    name: 'static/fonts/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(js|jsx)$/,//一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
                exclude: /node_modules/,//屏蔽不需要处理的文件（文件夹）（可选）
                loader: 'babel-loader',//loader的名称（必须）
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json'], // 解析扩展。（当我们通过路导入文件，找不到改文件时，会尝试加入这些后缀继续寻找文件）
        alias: {
            '@': path.join(__dirname, '..', "src"), // 在项目中使用@符号代替src路径，导入文件路径更方便
            // "@ant-design/icons":"purched-antd-icons"
            '@ant-design/icons/lib/dist$': path.resolve(__dirname, '../src/icons.js'),
        }
    },
    plugins: [

        new WebpackManifestPlugin(
            {
                fileName: 'asset-manifest.json',
            }
        ),
        new BundleAnalyzerPlugin(),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]

}
