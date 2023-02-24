const webpackMerge = require("webpack-merge");
const path = require("path");

const baseWebpackConfig = require("./webpack.base.config");
const utils = require("./utils");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const package = require("../package.json");
const { client } = require("../src/model/config");
const darkTheme = require("@ant-design/dark-theme").default;

module.exports = webpackMerge.merge(baseWebpackConfig, {
 
  mode: "development",
  
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: utils.resolve("../public/index.html"),
      inject: true, 
    }),
  ],
  
  devServer: {
    historyApiFallback: true, 
    hot: true,
    contentBase: "public",
   
    port: "8801",
    host: "0.0.0.0",
    
    proxy: {
      // "/v1": {
      //   target: 'http://test.dmctech.io:80',
      //   changeOrigin: true
      // },
      // "/1.0": {
      //   target: 'http://test.dmctech.io:80',
      //   changeOrigin: true
      // },
      // "/1.1": {
      //   target: 'http://test.dmctech.io:80',
      //   changeOrigin: true
      // },
      // rc1 
      // "/v1": {
      //   target: 'http://rc1.dmctech.io:80',
      //   changeOrigin: true
      // },
      // "/1.0": {
      //   target: 'http://rc1.dmctech.io:80',
      //   changeOrigin: true
      // },
      // "/1.1": {
      //   target: 'http://rc1.dmctech.io:80',
      //   changeOrigin: true
      // },
      // 
      "/v1": {
        target: 'http://154.22.121.99:8022',
        changeOrigin: true
      },
      "/1.0": {
        target: 'http://154.22.121.99:8022',
        changeOrigin: true
      },
      "/1.1": {
        target: 'http://154.22.121.99:8022',
        changeOrigin: true
      }
    },
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader", //  less -> CSS
            options: {
              modifyVars: Object.assign(darkTheme, {
                "primary-color": "#FF9B3D",
                "link-color": "#FF9B3D",
                // "@border-color-base": "#FF9B3D",
              }),
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader", //  <style></style>
          },
          {
            loader: "css-loader", // css
          },
        ],
      },
    ],
  },
});
