// Node.js的核心模块，专门用来处理文件路径
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const os = require('os')
const TerserPlugin = require('terser-webpack-plugin')

const threads = os.cpus().length;
const getStyleLoaders = (preProcessor) => {
  let loaderArr = [
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugin: [
            "postcss-present-env", // 能解决大多数样式兼容性问题
          ],
        },
      },
    },
    preProcessor,
  ];
  if (!preProcessor) {
    loaderArr.pop();
  }
  return loaderArr;
};

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
    clean: true,
  },
  // 加载器
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: getStyleLoaders(),
      },
      {
        test: /\.less$/i,
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
        // exclude: /node_modules/, // 排除node_modules代码不编译
        include: path.resolve(__dirname, "../src"), // 也可以用包含
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: threads
            }
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ]        
      },
    ],
  },
  // 插件
  plugins: [
    new ESLintWebpackPlugin({
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules",
      cache: true,
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
        ),
      threads: threads
    }),
    new HTMLWebpackPlugin({
      // HTML模版所在位置
      template: path.resolve(__dirname, "../index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/main.css",
    }),
    
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./favicon.ico",  // 输入路径是相对于项目根目录的
          to: "favicon.ico",
          // noErrorOnMissing: true,  // 如果不存在favicon.ico，不产生错误警告
        },
      ],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        parallel: threads
      })
    ]
  },
  // 模式
  mode: "production",
  devtool: "source-map",
};
