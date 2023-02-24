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
    
    mode:"production",
    
    plugins:[
        new HtmlWebpackPlugin({
            filename:"index.html",
            template: utils.resolve('../public/index.html'),//html
            inject: true,
            hash: true,
            //  html 
            minify: {
                removeComments: true,              
                collapseWhitespace: true,           
                removeAttributeQuotes: true        
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:8].css',
            chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        }),
        new CopyWebpackPlugin([
            {
                from: utils.resolve('../public'),  
                to: "", // copy
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
        // 
        minimizer: [
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: { 
                    discardComments: { removeAll: true } 
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
                        loader: 'less-loader',
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
                        loader: 'css-loader',  // css
                    }
                ]
            },
        ]
    }
})