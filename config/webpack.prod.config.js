const webpackMerge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.config")
const utils = require("./utils")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin")
const CompressionPlugin = require("compression-webpack-plugin");
const darkTheme = require("@ant-design/dark-theme").default;

module.exports = webpackMerge.merge(baseWebpackConfig,{
    // 指定构建环境  
    mode:"production",
    // 插件
    plugins:[
        new HtmlWebpackPlugin({
            filename:"index.html",
            template: utils.resolve('../public/index.html'),//html模板
            inject: true, // true：默认值，script标签位于html文件的 body 底部
            hash: true, // 在打包的资源插入html会加上hash
            //  html 文件进行压缩
            minify: {
                removeComments: true,               //去注释
                collapseWhitespace: true,           //压缩空格
                removeAttributeQuotes: true         //去除属性引用
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:8].css',
            chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        }),
        new CopyWebpackPlugin([
            {
                from: utils.resolve('../public'),  // 从哪个目录copy
                to: "", // copy到那个目录
                ignore: ['.*']
            },
            {
                from: utils.resolve('../src/serviceWorker.js'), 
                to:""
            }
        ]),
        new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
          }),
  
    ],
    optimization: {
        // 压缩css
        minimizer: [
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: { 
                    discardComments: { removeAll: true } // 移除注释
                } 
            })
        ]
    },
    module: {
        rules: [
            {

                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',

                    },
                    {
                        loader: 'less-loader', // 编译 less -> CSS
                        options: {
                        modifyVars: Object.assign(darkTheme, {
                          "primary-color": "#FF9B3D",
                          "link-color": "#FF9B3D",
                          // "@border-color-base": "#FF9B3D",
                        }),
                        javascriptEnabled: true,
                    }
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,

                    },
                    {
                        loader: 'css-loader',  // 转换css
                    }
                ]
            },
        ]
    }
})