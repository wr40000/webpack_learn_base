// Node.js的核心模块，专门用来处理文件路径
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const os = require("os");
const TerserPlugin = require("terser-webpack-plugin");

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
    filename: "static/js/[name].js",
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
              plugins: ["@babel/plugin-transform-runtime"]
            },
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
      threads: threads,
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
          from: "./favicon.ico", // 输入路径是相对于项目根目录的
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
        parallel: threads,
      }),
    ],
    splitChunks: {
      // 代码分割配置
      chunks: "all", // 对所有模块都进行分割
      // 以下是默认值
      // minSize: 20000, // 分割代码最小的大小
      // minRemainingSize: 0, // 类似于minSize，最后确保提取的文件大小不能为0
      // minChunks: 1, // 至少被引用的次数，满足条件才会代码分割
      // maxAsyncRequests: 30, // 按需加载时并行加载的文件的最大数量
      // maxInitialRequests: 30, // 入口js文件最大并行请求数量
      // enforceSizeThreshold: 50000, // 超过50kb一定会单独打包（此时会忽略minRemainingSize、maxAsyncRequests、maxInitialRequests）
      cacheGroups: { // 组，哪些模块要打包到一个组
        defaultVendors: { // 组名
          test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
          priority: -10, // 权重（越大越高）
          reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
        },
      //   default: { // 其他没有写的配置会使用上面的默认值
      //     minChunks: 2, // 这里的minChunks权重更大
      //     priority: -20,
      //     reuseExistingChunk: true,
      //   },
      },
    }
  },
  // 模式
  mode: "production",
  devtool: "source-map",
};
