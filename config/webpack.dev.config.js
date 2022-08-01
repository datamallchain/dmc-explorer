const webpackMerge = require("webpack-merge");
const path = require("path");

const baseWebpackConfig = require("./webpack.base.config");
const utils = require("./utils");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const package = require("../package.json");
const { client } = require("../src/model/config");
const darkTheme = require("@ant-design/dark-theme").default;

module.exports = webpackMerge.merge(baseWebpackConfig, {
  // 指定构建环境
  mode: "development",
  // 插件
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: utils.resolve("../public/index.html"),
      inject: true, // true：默认值，script标签位于html文件的 body 底部
    }),
  ],
  // 开发环境本地启动的服务配置
  devServer: {
    historyApiFallback: true, // 当找不到路径的时候，默认加载index.html文件
    hot: true,
    contentBase: "public", // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要
    // compress: true, // 一切服务都启用gzip 压缩：
    port: "8801",
    host: "localhost",
    // publicPath: utils.resolve("../build"), // 访问资源加前缀
    proxy: {
      // 接口请求代理
      "/v1": {
        target: 'https://explorer.dmctech.io:443',
        changeOrigin: true
      },
      "/1.0": {
        target: 'https://explorer.dmctech.io:443',
        changeOrigin: true
      },
      "/1.1": {
        target: 'https://explorer.dmctech.io:443',
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
            loader: "less-loader", // 编译 less -> CSS
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
            loader: "style-loader", // 创建 <style></style>
          },
          {
            loader: "css-loader", // 转换css
          },
        ],
      },
    ],
  },
});
