const utils = require("./utils")
const path = require("path");
const WebpackManifestPlugin = require("webpack-manifest-plugin")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require("webpack")

module.exports = {
    
    entry: {
        app: "./src/index"
    },
    
    output: {
        path: utils.resolve("../build"),
        filename: "static/js/[name].[hash].js",
        publicPath: "/" 
    },
    
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)(\?.*)?$/,
                loader: 'url-loader',
                exclude: /\.svg$/,
                options: {
                    limit: 10000, 
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
                    limit: 10000, 
                    name: 'static/fonts/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json'], 
        alias: {
            '@': path.join(__dirname, '..', "src"), 
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
