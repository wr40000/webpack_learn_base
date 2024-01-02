// Node.js的核心模块，专门用来处理文件路径
const path = require("path");
const ESLintWebpackPlugin = require('eslint-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const getStyleLoaders = (preProcessor) => {
  let loaderArr = [MiniCssExtractPlugin.loader,
         "css-loader",
         {
          loader: 'postcss-loader',
          options: {
            postcssOptions:{
              plugin: [
                'postcss-present-env' // 能解决大多数样式兼容性问题
              ]
            }
          }
         },
         preProcessor].filter((item)=>{
          item
         });
  return loaderArr
}

module.exports = {
  // 入口
  // 相对路径和绝对路径都行
  entry: "./src/main.js",
  output: {
    // path: 文件输出目录，必须是绝对路径
    // path.resolve()方法返回一个绝对路径
    // __dirname 当前文件的文件夹绝对路径
    path: path.resolve(__dirname, "../dist"),
    // filename: 输出文件名
    filename: "static/js/main.js",
    clean: true
  },
  // 加载器
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: getStyleLoaders(),
      },
      {
        test: /\.lss$/i,
        use: getStyleLoaders("less-loader"),
      },
      {
        test: /\.styl$/i,
        use: getStyleLoaders("stylus-loader"),
      },
      {
        test: /\.s[ac]ss/i,
        use: getStyleLoaders("sass-loader"),
      },
      {
        // 正则表达式不要加 g 
        test: /\.(jpe?g|png|gif|webp)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
          },
        },
        generator: {
          // 将图片文件输出到 static/imgs 目录中
          // 将图片文件命名 [hash:8][ext][query]
          // [hash:8]: hash值取8位
          // [ext]: 使用之前的文件扩展名
          // [query]: 添加之前的query参数
          filename: "static/images/[name].[hash:8][ext][query]",
        },
      },
      {
        // 正则表达式不要加 g 
        test: /\.(ttf|woff|woff2|map4|map3|avi)$/,
        type: "asset/resource",
        generator: {
          // 将图片文件输出到 static/imgs 目录中
          // 将图片文件命名 [hash:8][ext][query]
          // [hash:8]: hash值取8位
          // [ext]: 使用之前的文件扩展名
          // [query]: 添加之前的query参数
          filename: "static/media/[name].[hash:8][ext][query]",
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
    ],
  },
  // 插件
  plugins: [
    new ESLintWebpackPlugin({
      context: path.resolve(__dirname, '../src')
    }),
    new HTMLWebpackPlugin({
      // HTML模版所在位置
      template: path.resolve(__dirname, '../index.html')
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/main.css'
    }),
    new CssMinimizerPlugin()
  ],
  // 模式
  mode: "production",
};
