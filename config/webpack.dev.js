// Node.js的核心模块，专门用来处理文件路径
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const os = require("os");

const threads = os.cpus().length;
module.exports = {
  // 入口
  // 相对路径和绝对路径都行
  entry: "./src/main.js",
  output: {
    // path: 文件输出目录，必须是绝对路径
    // path.resolve()方法返回一个绝对路径
    // __dirname 当前文件的文件夹绝对路径
    path: undefined,
  },
  // 加载器
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },
          {
            test: /\.less$/i,
            use: ["style-loader", "css-loader", "less-loader"],
          },
          {
            test: /\.styl$/i,
            use: ["style-loader", "css-loader", "stylus-loader"],
          },
          {
            test: /\.s[ac]ss/i,
            use: ["style-loader", "css-loader", "sass-loader"],
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
            include: path.resolve(__dirname, "../src"),
            use: [
              {
                loader: "thread-loader",
                options: {
                  workers: threads,
                },
              },
              {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true, // 开启babel编译缓存
                  cacheCompression: false, // 缓存文件不要压缩
                },
              },
            ],
          },
        ],
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
  ],
  devServer: {
    host: "localhost",
    port: "3000",
    open: true,
    hot: true,
  },
  // 模式
  mode: "development",
  devtool: "cheap-module-source-map",
};
