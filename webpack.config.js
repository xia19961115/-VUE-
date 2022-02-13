const path = require('path')
const fs = require('fs')
const Webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
// css抽离成单独文件
const miniCssExtractPlugin = require('mini-css-extract-plugin')
// 压缩CSS
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
// 进度条插件
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin')
// 复用loader
let isDevelopment = process.env.NODE_ENV === 'development'
console.log(isDevelopment);
const commonCssLoader = [
    isDevelopment? 'style-loader' : miniCssExtractPlugin.loader,
    'css-loader',
    {
      // 还需要在package.json中定义browserslist
      loader: 'postcss-loader',
    }
]
// 获取.env文件中的内容
let fileName = path.join(__dirname, `./.env.${process.env.NODE_ENV}`);
let data = fs.readFileSync(fileName, { encoding: 'utf8' })
let d = data.replace(/\r/g, ',').replace(/\n/g, '').replace(/\s/g, '').replace(/\'/g, '').replace(/\"/g, '') // 把换行和回车替换
let arr = d.split(',').map(item => {
  return item.split('=')
})
let obj = {}
arr.forEach(item => {
  obj[item[0]] = JSON.stringify(item[1])
})
// 文件倒出
module.exports = {
    // 文件的入口
    entry: './src/main.js',
    // 文件的出口
    output: {
        path: path.resolve(__dirname,'dist'),
        // publicPath:'/dev',
        filename: 'js/[name].[contenthash:6].js',
        clean:true
    },
    resolve: {
        extensions: [".js", ".json", ".mjs", ".vue", ".ts", ".jsx", ".tsx"],
        alias: {
          "@": path.resolve(__dirname, "src"),
        },
    },
    // 使用的loader
    module:{
        rules:[
            {test: /\.vue$/, use: 'vue-loader'},
            {test: /\.css$/,use: [...commonCssLoader]},
            {test:/\.s[ca]ss$/,use:[...commonCssLoader,'sass-loader']},
            {
                test: /\.m?js$/,
                use:{
                    loader:'babel-loader'
                }
            },
            // webpack5 用法
            {
                test:/\.(jpe?g|png|gif|svg)$/,
                type:'asset/resource',
                generator: {
                    filename: 'img/[name].[hash:8].[ext]'
                  }
            },
            // 字体
            {
                test:/\.(eot|ttf|woff2?)$/,
                type:'asset/resource',
                generator: {
                    filename: 'font/[name].[hash:8].[ext]'
                  }
            }
        ]
    },
    // 插件
    plugins: [
        new OptimizeCssAssetsWebpackPlugin(),
        new VueLoaderPlugin(),
        new ProgressBarWebpackPlugin(),
        new miniCssExtractPlugin({
            filename: 'css/[name].[contenthash:6].css'
        }),
        new HtmlWebpackPlugin({
            template:'./public/index.html',
            title:'自定义安装vue',
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
            }
        }),
        new TerserPlugin({
            extractComments: false,// webpack5不将注释提取到单独的文件中
        }),
        new Webpack.DefinePlugin({
            'process': {
                'env':{
                    BASE_URL: "'/'",
                    ...obj
                }
            }
        }),
    ],
    // devtool: 'hidden-source-map',
    // 热更新
    devServer:{
        // contentBase: path.resolve(__dirname, 'dist'),
        static: path.resolve(__dirname,'dist'),
        // quiet: true,
        open:true,
        // host:'local-ip',
        hot: true,
        port: 'auto',
        compress:true,
        client:{
            logging:'error'
        }
    }
}